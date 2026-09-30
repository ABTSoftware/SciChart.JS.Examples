import {
    BaseSceneEntity3D,
    ESceneEntityType,
    ImmediateLitMeshContext,
    parseColorToUIntArgb,
    TSciChart3D,
    Vector3,
} from "scichart";

/** One cross-section of the ribbon: its two edge vertices in data space, plus the colour they share. */
type TRibbonRib = { left: Vector3; right: Vector3; color: number };

const SEGMENT_COUNT = 240;
const HALF_WIDTH = 13;
const TURNS = 2.5;

/**
 * A custom scene entity which draws an aurora-like, banked helix as a single triangle strip using
 * {@link ImmediateLitMeshContext}. Immediate meshes are useful when no built-in 3D series can describe
 * the shape you need - a swept path, a non-uniform tube, or application-specific geometry.
 */
export class AuroraRibbonSceneEntity extends BaseSceneEntity3D<any> {
    public readonly type = ESceneEntityType.Custom;

    // The ribbon never changes, so the geometry is built once and only the world transform is redone per pass.
    private readonly ribs: TRibbonRib[] = buildRibbon();

    constructor(webAssemblyContext: TSciChart3D) {
        super(webAssemblyContext);
        this.setNativeEntity(webAssemblyContext.SCRTSceneEntity.implement(this));
    }

    public override Render(): void {
        if (!this.isVisible || !this.currentRenderPassData) return;

        // #region_coordinate_transform_start
        const { xCalc, yCalc, zCalc, worldDimensions } = this.currentRenderPassData;
        const toWorld = (point: Vector3) =>
            new Vector3(
                xCalc.getCoordinate(point.x) - worldDimensions.x / 2,
                yCalc.getCoordinate(point.y),
                zCalc.getCoordinate(point.z) - worldDimensions.z / 2
            );
        // #region_coordinate_transform_end

        // setVertex3() always takes world coordinates. Mapping the data-space ribs through the current
        // render-pass calculators means axis ranges and worldDimensions affect the mesh.
        const ribs = this.ribs.map((rib) => ({
            left: toWorld(rib.left),
            right: toWorld(rib.right),
            color: rib.color,
        }));

        const context = new ImmediateLitMeshContext(
            this.webAssemblyContext,
            this.webAssemblyContext.eTSRRenderMode.TSR_RENDERMODE_TRIANGLESTRIP
        );

        // TSR_RENDERMODE_TRIANGLESTRIP joins consecutive vertices, so each left/right pair adds one ribbon segment.
        for (let i = 0; i < ribs.length; i++) {
            const { left, right, color } = ribs[i];
            const previous = ribs[Math.max(0, i - 1)];
            const next = ribs[Math.min(ribs.length - 1, i + 1)];

            // Normals are recomputed in world space because axis scaling can alter their direction.
            // left + right is twice the rib centre, but only the direction of the tangent matters here.
            const along = next.left.add(next.right).subtract(previous.left.add(previous.right));
            const normal = right.subtract(left).crossProduct(along);
            normal.normalize();

            const v = i / (ribs.length - 1);
            context.normal3(normal.x, normal.y, normal.z);
            context.setVertexColor(color);

            context.texCoord2(0, v);
            context.setVertex3v(left);

            context.texCoord2(1, v);
            context.setVertex3v(right);
        }

        // dispose() submits the completed mesh and releases the native resources.
        context.dispose();
    }
}

/** Sweeps a ribbon along a helix, banking it from side to side and shading it from blue to orange. */
function buildRibbon(): TRibbonRib[] {
    const angleAt = (index: number) => (index / (SEGMENT_COUNT - 1)) * TURNS * Math.PI * 2;

    const centers = Array.from({ length: SEGMENT_COUNT }, (_, i) => {
        const angle = angleAt(i);
        const radius = 62 + 10 * Math.sin(angle * 0.6);
        const height = -75 + (i / (SEGMENT_COUNT - 1)) * 150;
        return new Vector3(radius * Math.cos(angle), height, radius * Math.sin(angle));
    });

    return centers.map((center, i) => {
        const previous = centers[Math.max(0, i - 1)];
        const next = centers[Math.min(SEGMENT_COUNT - 1, i + 1)];

        // The ribbon's width runs perpendicular to the path in the XZ plane, so it stays edge-on around each turn.
        const tangentX = next.x - previous.x;
        const tangentZ = next.z - previous.z;
        const tangentLength = Math.hypot(tangentX, tangentZ) || 1;
        const widthX = (tangentZ / tangentLength) * HALF_WIDTH;
        const widthZ = (-tangentX / tangentLength) * HALF_WIDTH;
        const bank = 7 * Math.sin(angleAt(i) * 3);

        const progress = i / (SEGMENT_COUNT - 1);
        const red = Math.round(50 + progress * 170);
        const green = Math.round(225 - progress * 125);
        const blue = Math.round(255 - progress * 45);

        return {
            left: new Vector3(center.x - widthX, center.y - bank, center.z - widthZ),
            right: new Vector3(center.x + widthX, center.y + bank, center.z + widthZ),
            color: parseColorToUIntArgb(`rgb(${red},${green},${blue})`),
        };
    });
}
