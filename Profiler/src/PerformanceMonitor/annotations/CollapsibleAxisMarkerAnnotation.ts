import { AnnotationHoverEventArgs } from "scichart";
import { IAxisMarkerAnnotationOptions } from "scichart";
import { AxisMarkerAnnotation } from "scichart";

export class CollapsibleAxisMarkerAnnotation extends AxisMarkerAnnotation {
    protected originalLabel = this.formattedValue;
    protected isCollapsed: boolean = true;

    constructor(options?: IAxisMarkerAnnotationOptions) {
        super(options);
        this.originalLabel = options?.formattedValue;
        this.formattedValue = this.originalLabel.charAt(0);

        this.hovered.subscribe((args: AnnotationHoverEventArgs) => {
            if (args.isHovered) {
                if (this.isCollapsed) {
                    (args.sender as AxisMarkerAnnotation).formattedValue = this.originalLabel;
                }

                this.isCollapsed = false;
            } else {
                this.isCollapsed = true;
                (args.sender as AxisMarkerAnnotation).formattedValue = this.originalLabel.charAt(0);
            }
        });
    }
}
