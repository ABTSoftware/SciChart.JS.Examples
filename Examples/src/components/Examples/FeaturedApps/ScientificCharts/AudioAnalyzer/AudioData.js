export class AudioData {
    pointsCount;
    xData;
    yData;
    constructor(pointsCount) {
        this.pointsCount = pointsCount;
        this.xData = new Array(pointsCount);
        this.yData = new Array(pointsCount);
    }
}
