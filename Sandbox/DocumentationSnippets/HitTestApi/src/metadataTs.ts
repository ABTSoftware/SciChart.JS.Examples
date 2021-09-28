import { IPointMetadata } from 'scichart/Charting/Model/IPointMetadata';

export class ForbesMetadata implements IPointMetadata {
    public isSelected: boolean = false;
    public name: string;
    public country: string;
    public age: number;

    constructor(name: string, age: number, country: string) {
        this.name = name;
        this.country = country;
        this.age = age;
    }
}

export const forbesData: Array<[number, ForbesMetadata]> = [
    [203.4, new ForbesMetadata('Elon Musk', 50, 'United States')],
    [197.7, new ForbesMetadata('Jeff Bezos', 57, 'United States')],
    [175.9, new ForbesMetadata('Bernard Arnault & family', 72, 'France')],
    [131.0, new ForbesMetadata('Bill Gates', 65, 'United States')],
    [126.4, new ForbesMetadata('Mark Zuckerberg', 37, 'United States')],
    [120.7, new ForbesMetadata('Larry Page', 48, 'United States')],
    [119.6, new ForbesMetadata('Larry Ellison', 77, 'United States')],
    [116.3, new ForbesMetadata('Sergey Brin', 48, 'United States')],
    [101.5, new ForbesMetadata('Warren Buffett', 91, 'United States')],
    [98.5, new ForbesMetadata('Mukesh Ambani', 64, 'India')]
];
