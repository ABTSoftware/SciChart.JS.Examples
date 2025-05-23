// based on Sweep-line algorithm for constrained Delaunay triangulation

function findTrianglesWithEdge(edge, triangles) {
    const [p1, p2] = edge;
    return triangles.filter(triangle => {
        const edges = [
            [triangle.a, triangle.b],
            [triangle.b, triangle.c],
            [triangle.c, triangle.a]
        ];
        return edges.some(
            e => (pointsEqual(e[0], p1) && pointsEqual(e[1], p2)) || (pointsEqual(e[0], p2) && pointsEqual(e[1], p1))
        );
    });
}

function formQuadrilateral(triangle1, triangle2, sharedEdge) {
    // Find the two vertices not on the shared edge
    const [p1, p2] = sharedEdge;
    const vertices1 = [triangle1.a, triangle1.b, triangle1.c];
    const vertices2 = [triangle2.a, triangle2.b, triangle2.c];

    const vertex1 = vertices1.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));
    const vertex2 = vertices2.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));

    return [p1, vertex1, p2, vertex2];
}

function isConvex(quad) {
    // Check if quadrilateral is convex by testing all interior angles < 180°
    const [p1, p2, p3, p4] = quad;

    function crossProduct(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    }

    const signs = [
        crossProduct(p1, p2, p3),
        crossProduct(p2, p3, p4),
        crossProduct(p3, p4, p1),
        crossProduct(p4, p1, p2)
    ];

    // All cross products should have the same sign for convex polygon
    return signs.every(s => s >= 0) || signs.every(s => s <= 0);
}

function shouldFlip(edge, quad) {
    // Check if flipping the edge improves Delaunay property
    const [p1, p2, p3, p4] = quad;

    // Current configuration: edge p1-p3
    // Proposed flip: edge p2-p4

    // Check if new triangles would be better (simplified heuristic)
    const currentAngle1 = getMinAngle([p1, p2, p3]);
    const currentAngle2 = getMinAngle([p1, p3, p4]);
    const newAngle1 = getMinAngle([p1, p2, p4]);
    const newAngle2 = getMinAngle([p2, p3, p4]);

    return Math.min(newAngle1, newAngle2) > Math.min(currentAngle1, currentAngle2);
}

function flipEdge(affectedTriangles, triangles) {
    if (affectedTriangles.length !== 2) return;

    const [tri1, tri2] = affectedTriangles;

    // Find shared edge
    const edges1 = [
        [tri1.a, tri1.b],
        [tri1.b, tri1.c],
        [tri1.c, tri1.a]
    ];
    const edges2 = [
        [tri2.a, tri2.b],
        [tri2.b, tri2.c],
        [tri2.c, tri2.a]
    ];

    let sharedEdge = null;
    for (let e1 of edges1) {
        for (let e2 of edges2) {
            if (
                (pointsEqual(e1[0], e2[0]) && pointsEqual(e1[1], e2[1])) ||
                (pointsEqual(e1[0], e2[1]) && pointsEqual(e1[1], e2[0]))
            ) {
                sharedEdge = e1;
                break;
            }
        }
        if (sharedEdge) break;
    }

    if (!sharedEdge) return;

    // Find the vertices not on shared edge
    const vertices1 = [tri1.a, tri1.b, tri1.c];
    const vertices2 = [tri2.a, tri2.b, tri2.c];
    const [p1, p2] = sharedEdge;

    const vertex1 = vertices1.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));
    const vertex2 = vertices2.find(v => !pointsEqual(v, p1) && !pointsEqual(v, p2));

    // Remove old triangles
    const index1 = triangles.indexOf(tri1);
    const index2 = triangles.indexOf(tri2);

    if (index1 > -1) triangles.splice(index1, 1);
    if (index2 > -1) triangles.splice(index2 > index1 ? index2 - 1 : index2, 1);

    // Add new triangles with flipped edge
    triangles.push({ a: p1, b: vertex1, c: vertex2 });
    triangles.push({ a: p2, b: vertex1, c: vertex2 });
}

function pointsEqual(p1, p2) {
    const epsilon = 1e-10;
    return Math.abs(p1[0] - p2[0]) < epsilon && Math.abs(p1[1] - p2[1]) < epsilon;
}

function getMinAngle(triangle) {
    const [a, b, c] = triangle;

    function angle(p1, vertex, p2) {
        const v1 = [p1[0] - vertex[0], p1[1] - vertex[1]];
        const v2 = [p2[0] - vertex[0], p2[1] - vertex[1]];

        const dot = v1[0] * v2[0] + v1[1] * v2[1];
        const mag1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1]);
        const mag2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1]);

        return Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))));
    }

    const angle1 = angle(b, a, c);
    const angle2 = angle(a, b, c);
    const angle3 = angle(a, c, b);

    return Math.min(angle1, angle2, angle3);
}

function constrainedDelaunayTriangulation(points) {
    // Close polygon if needed
    const polygon = closePolygon(points);
    const constraints = createConstraints(polygon);

    // Create bounding triangle
    const bounds = getBounds(polygon);
    const superTriangle = createSuperTriangle(bounds);
    const allPoints = [...polygon, ...superTriangle];

    // Initial Delaunay triangulation using Bowyer-Watson
    let triangles = bowyerWatson(allPoints);

    // Enforce constraints using sweep-line approach
    constraints.forEach(constraint => {
        triangles = enforceConstraint(constraint, triangles);
    });

    // Remove super triangle and external triangles
    triangles = triangles.filter(t => !containsSuperVertex(t, superTriangle) && isTriangleInside(t, polygon));

    return triangles.map(t => [t.a, t.b, t.c]);
}

// Bowyer-Watson algorithm for Delaunay triangulation
function bowyerWatson(points) {
    const triangles = [];

    // Start with super triangle
    const bounds = getBounds(points);
    const super1 = [bounds.minX - 100, bounds.minY - 100];
    const super2 = [bounds.maxX + 100, bounds.minY - 100];
    const super3 = [bounds.maxX / 2, bounds.maxY + 100];

    triangles.push({ a: super1, b: super2, c: super3 });

    // Add points one by one
    points.forEach(point => {
        const badTriangles = [];
        const polygon = [];

        // Find bad triangles (circumcircle contains point)
        triangles.forEach((triangle, i) => {
            if (inCircumcircle(point, triangle)) {
                badTriangles.push(i);
                // Add edges to polygon
                addEdgeToPolygon(polygon, [triangle.a, triangle.b]);
                addEdgeToPolygon(polygon, [triangle.b, triangle.c]);
                addEdgeToPolygon(polygon, [triangle.c, triangle.a]);
            }
        });

        // Remove bad triangles
        badTriangles.sort((a, b) => b - a).forEach(i => triangles.splice(i, 1));

        // Create new triangles
        polygon.forEach(edge => {
            triangles.push({ a: edge[0], b: edge[1], c: point });
        });
    });

    return triangles;
}

// Constraint enforcement using edge swapping
function enforceConstraint(constraint, triangles) {
    const [p1, p2] = constraint;
    const intersectingEdges = findIntersectingEdges(p1, p2, triangles);

    intersectingEdges.forEach(edge => {
        const affectedTriangles = findTrianglesWithEdge(edge, triangles);
        if (affectedTriangles.length === 2) {
            const quad = formQuadrilateral(affectedTriangles[0], affectedTriangles[1], edge);
            if (isConvex(quad) && shouldFlip(edge, quad)) {
                flipEdge(affectedTriangles, triangles);
            }
        }
    });

    return triangles;
}

// Geometric helper functions
function inCircumcircle(point, triangle) {
    const [ax, ay] = triangle.a;
    const [bx, by] = triangle.b;
    const [cx, cy] = triangle.c;
    const [dx, dy] = point;

    const adx = ax - dx,
        ady = ay - dy;
    const bdx = bx - dx,
        bdy = by - dy;
    const cdx = cx - dx,
        cdy = cy - dy;

    const abdet = adx * bdy - bdx * ady;
    const bcdet = bdx * cdy - cdx * bdy;
    const cadet = cdx * ady - adx * cdy;
    const alift = adx * adx + ady * ady;
    const blift = bdx * bdx + bdy * bdy;
    const clift = cdx * cdx + cdy * cdy;

    return alift * bcdet + blift * cadet + clift * abdet > 0;
}

function orientation(p, q, r) {
    const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (Math.abs(val) < 1e-10) return 0; // collinear
    return val > 0 ? 1 : 2; // clockwise or counterclockwise
}

function segmentsIntersect(p1, q1, p2, q2) {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    return (
        (o1 !== o2 && o3 !== o4) ||
        (o1 === 0 && onSegment(p1, p2, q1)) ||
        (o2 === 0 && onSegment(p1, q2, q1)) ||
        (o3 === 0 && onSegment(p2, p1, q2)) ||
        (o4 === 0 && onSegment(p2, q1, q2))
    );
}

function onSegment(p, q, r) {
    return (
        q[0] <= Math.max(p[0], r[0]) &&
        q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) &&
        q[1] >= Math.min(p[1], r[1])
    );
}

function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        if (
            polygon[i][1] > point[1] !== polygon[j][1] > point[1] &&
            point[0] <
                ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1])) / (polygon[j][1] - polygon[i][1]) +
                    polygon[i][0]
        ) {
            inside = !inside;
        }
    }
    return inside;
}

// Utility functions
function closePolygon(points) {
    const first = points[0];
    const last = points[points.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
        return [...points, first];
    }
    return points;
}

function createConstraints(polygon) {
    const constraints = [];
    for (let i = 0; i < polygon.length - 1; i++) {
        constraints.push([polygon[i], polygon[i + 1]]);
    }
    return constraints;
}

function getBounds(points) {
    return points.reduce(
        (bounds, point) => ({
            minX: Math.min(bounds.minX, point[0]),
            maxX: Math.max(bounds.maxX, point[0]),
            minY: Math.min(bounds.minY, point[1]),
            maxY: Math.max(bounds.maxY, point[1])
        }),
        {
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity
        }
    );
}

function createSuperTriangle(bounds) {
    const dx = bounds.maxX - bounds.minX;
    const dy = bounds.maxY - bounds.minY;
    const deltaMax = Math.max(dx, dy) * 2;

    return [
        [bounds.minX - deltaMax, bounds.minY - deltaMax],
        [bounds.maxX + deltaMax, bounds.minY - deltaMax],
        [(bounds.minX + bounds.maxX) / 2, bounds.maxY + deltaMax]
    ];
}

function findIntersectingEdges(p1, p2, triangles) {
    const intersecting = [];
    triangles.forEach(triangle => {
        const edges = [
            [triangle.a, triangle.b],
            [triangle.b, triangle.c],
            [triangle.c, triangle.a]
        ];
        edges.forEach(edge => {
            if (segmentsIntersect(p1, p2, edge[0], edge[1])) {
                intersecting.push(edge);
            }
        });
    });
    return intersecting;
}

function isTriangleInside(triangle, polygon) {
    const centroid = [
        (triangle.a[0] + triangle.b[0] + triangle.c[0]) / 3,
        (triangle.a[1] + triangle.b[1] + triangle.c[1]) / 3
    ];
    return pointInPolygon(centroid, polygon);
}

function containsSuperVertex(triangle, superTriangle) {
    return superTriangle.some(
        superVertex =>
            (triangle.a[0] === superVertex[0] && triangle.a[1] === superVertex[1]) ||
            (triangle.b[0] === superVertex[0] && triangle.b[1] === superVertex[1]) ||
            (triangle.c[0] === superVertex[0] && triangle.c[1] === superVertex[1])
    );
}

function addEdgeToPolygon(polygon, edge) {
    // Only add edge if it's not already in polygon (removes duplicates)
    const exists = polygon.some(existingEdge => existingEdge[0] === edge[1] && existingEdge[1] === edge[0]);
    if (!exists) {
        polygon.push(edge);
    } else {
        // Remove the existing edge (it was shared by two triangles)
        const index = polygon.findIndex(existingEdge => existingEdge[0] === edge[1] && existingEdge[1] === edge[0]);
        polygon.splice(index, 1);
    }
}

export default constrainedDelaunayTriangulation;
