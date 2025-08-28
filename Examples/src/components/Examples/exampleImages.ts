export const exampleImages = {
    VitalSignsMonitorDemo: require("./FeaturedApps/MedicalCharts/VitalSignsMonitorDemo/javascript-vital-signs-ecg-medical-chart-example.jpg"),
};

export const getExampleImage = (name: string) => {
    return exampleImages[name as keyof typeof exampleImages];
};
