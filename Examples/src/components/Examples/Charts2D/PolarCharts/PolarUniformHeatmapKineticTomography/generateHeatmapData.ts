export function generateKineticTomographyData(
    radiusSegments: number = 36, // Number of concentric rings
    angleSegments: number = 20,   // Number of angular segments
) {
    const data = new Array(radiusSegments);
    
    // Fill the data array
    for (let r = 0; r < radiusSegments; r++) {
        data[r] = new Array(angleSegments);
        
        for (let a = 0; a < angleSegments; a++) {
            const angle = (a / angleSegments) * 2 * Math.PI;
            
            // Add more NaNs in the lower radius values
            const nanProbability = r < radiusSegments/3 ? 0.5 : 0.3;
            
            if (Math.random() < nanProbability) {
                data[r][a] = NaN;
                continue;
            }
            
            // Create an angular bias for higher values at A=20
            // Using a non-linear distribution to make it irregular
            const angularBias = 0.2 * Math.pow(a / angleSegments, 1.5) * 
                                (1 + 0.3 * Math.sin(a * 0.7));
            
            // Generate values between -0.6 and 0.6
            let value = 0.3 * Math.sin(angle * 3) * Math.cos(r / 4);
            value += 0.2 * Math.sin(r / 2 + angle * 2);
            value += angularBias; // Add the bias
            value += 0.1 * Math.random() - 0.05;
            
            // Scale to range between -0.6 and 0.6
            value = value * 0.6;
            
            // Ensure value is between -0.6 and 0.6
            value = Math.max(-0.6, Math.min(0.6, value));
            
            // Round to 3 decimal places for readability
            data[r][a] = Math.round(value * 1000) / 1000;
        }
    }
    
    return data;
}