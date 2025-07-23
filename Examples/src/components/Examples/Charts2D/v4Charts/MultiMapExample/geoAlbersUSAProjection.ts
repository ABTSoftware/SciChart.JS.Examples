// @ts-nocheck
export default function transformToAlbersUSA(geojson) {
    // Albers USA projection parameters
    const CONUS_PARAMS = {
        phi1: (29.5 * Math.PI) / 180, // Standard parallel 1
        phi2: (45.5 * Math.PI) / 180, // Standard parallel 2
        phi0: (23 * Math.PI) / 180, // Origin latitude
        lambda0: (-96 * Math.PI) / 180, // Central meridian
        x0: 0, // False easting
        y0: 0, // False northing
    };

    const ALASKA_PARAMS = {
        phi1: (55 * Math.PI) / 180,
        phi2: (65 * Math.PI) / 180,
        phi0: (50 * Math.PI) / 180,
        lambda0: (-154 * Math.PI) / 180,
        x0: 0,
        y0: 0,
    };

    const HAWAII_PARAMS = {
        phi1: (8 * Math.PI) / 180,
        phi2: (18 * Math.PI) / 180,
        phi0: (3 * Math.PI) / 180,
        lambda0: (-157 * Math.PI) / 180,
        x0: 0,
        y0: 0,
    };

    // Albers equal-area conic projection function
    function albersProjection(lon, lat, params) {
        const phi = lat;
        const lambda = lon;
        const phi1 = params.phi1;
        const phi2 = params.phi2;
        const phi0 = params.phi0;
        const lambda0 = params.lambda0;

        // Calculate projection constants
        const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
        const theta = n * (lambda - lambda0);
        const C = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
        const rho = Math.sqrt(C - 2 * n * Math.sin(phi)) / n;
        const rho0 = Math.sqrt(C - 2 * n * Math.sin(phi0)) / n;

        // Calculate projected coordinates
        const x = rho * Math.sin(theta) + params.x0;
        const y = rho0 - rho * Math.cos(theta) + params.y0;

        return [x, y];
    }

    // Determine which projection to use based on state
    function getProjectionForState(stateName) {
        if (stateName === "Alaska") {
            return { params: ALASKA_PARAMS, type: "alaska" };
        }
        if (stateName === "Hawaii") {
            return { params: HAWAII_PARAMS, type: "hawaii" };
        }
        return { params: CONUS_PARAMS, type: "conus" };
    }

    // Transform coordinates for Alaska and Hawaii positioning
    function transformSpecialRegions(x, y, type) {
        switch (type) {
            case "alaska":
                // Scale down Alaska and position it closer to the continental US
                // Adjust these values as needed:
                // First number controls Alaska's size
                // Second number controls horizontal position (more negative = further left)
                // Third number  controls vertical position (more negative = lower)
                const [first, second, third] = [0.35, -0.31, 0.03];

                return [x * first + second, y * first + third];
            case "hawaii":
                // Position Hawaii below California
                return [x - 0.17, y - 0.23];
            default:
                return [x, y];
        }
    }

    // Transform a single coordinate pair
    function transformCoordinate(coord, projection) {
        const [lon, lat] = coord;
        const lonRad = (lon * Math.PI) / 180;
        const latRad = (lat * Math.PI) / 180;

        const [x, y] = albersProjection(lonRad, latRad, projection.params);
        const [finalX, finalY] = transformSpecialRegions(x, y, projection.type);

        return [finalX, finalY];
    }

    // Recursively transform coordinates based on geometry type
    function transformCoordinates(coords, depth, projection) {
        if (depth === 0) {
            // Single coordinate pair [lon, lat]
            return transformCoordinate(coords, projection);
        } else {
            // Array of coordinates
            return coords.map((coord) => transformCoordinates(coord, depth - 1, projection));
        }
    }

    // Determine coordinate depth for different geometry types
    function getCoordinateDepth(geometry) {
        switch (geometry.type) {
            case "Point":
                return 0;
            case "LineString":
            case "MultiPoint":
                return 1;
            case "Polygon":
            case "MultiLineString":
                return 2;
            case "MultiPolygon":
                return 3;
            default:
                return 0;
        }
    }

    // Transform a single geometry
    function transformGeometry(geometry, stateName) {
        if (!geometry || !geometry.coordinates) {
            return geometry;
        }

        const projection = getProjectionForState(stateName);
        const depth = getCoordinateDepth(geometry);

        return {
            ...geometry,
            coordinates: transformCoordinates(geometry.coordinates, depth, projection),
        };
    }

    // Transform the entire GeoJSON
    function transformGeoJSON(geojson) {
        if (geojson.type === "FeatureCollection") {
            return {
                ...geojson,
                features: geojson.features.map((feature) => ({
                    ...feature,
                    geometry: transformGeometry(feature.geometry, feature.properties?.NAME),
                })),
            };
        } else if (geojson.type === "Feature") {
            return {
                ...geojson,
                geometry: transformGeometry(geojson.geometry, geojson.properties?.NAME),
            };
        } else {
            // Direct geometry object
            return transformGeometry(geojson);
        }
    }

    return transformGeoJSON(geojson);
}
