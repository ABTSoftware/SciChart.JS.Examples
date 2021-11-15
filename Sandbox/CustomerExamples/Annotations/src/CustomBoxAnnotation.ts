import { BoxAnnotation, IBoxAnnotationOptions } from 'scichart/Charting/Visuals/Annotations/BoxAnnotation';

type TListenSelectedFn = (isSelected: boolean) => void;

export class CustomBoxAnnotation extends BoxAnnotation {
    private listenSelectedFn: TListenSelectedFn;

    constructor(listenIsSelected: TListenSelectedFn, props?: IBoxAnnotationOptions) {
        super(props);
        this.listenSelectedFn = listenIsSelected;
    }

    public set isSelected(value: boolean) {
        if (value !== this.isSelected) {
            this.listenSelectedFn(value);
        }
        super.isSelected = value;
    }

    public get isSelected(): boolean {
        return super.isSelected;
    }
}
