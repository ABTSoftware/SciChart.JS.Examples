export class AudioData {
    public pointsCount: number;
    public xData: number[];
    public yData: number[];

    constructor(pointsCount: number) {
        this.pointsCount = pointsCount;
        this.xData = new Array<number>(pointsCount);
        this.yData = new Array<number>(pointsCount);
    }
}
