# ESP32 Sensor Calibration Guide

This guide will help you calibrate your ESP32-based vital signs monitoring system using the AD8232 ECG sensor, HW-484 sound sensor for breathing detection, and GSR sensor.

## 🎯 What This Calibration Does

The calibration process will:

1. **Establish baseline values** for each sensor when the subject is at rest
2. **Analyze breathing patterns** to distinguish between breath in/out
3. **Calculate optimal thresholds** for breath detection
4. **Provide recommendations** for sensor configuration

## 📋 Prerequisites

-   ESP32 development board
-   AD8232 ECG sensor module
-   HW-484 sound sensor module
-   GSR (Galvanic Skin Response) sensor
-   Arduino IDE with ESP32 board support
-   Python 3.7+ (for data analysis)

## 🔌 Hardware Setup

### Sensor Connections

```
ESP32 Pin    Sensor        Connection
GPIO32       AD8232       Analog Output
GPIO33       GSR           Analog Output
GPIO27       HW-484        Analog Output
3.3V         All Sensors   Power Supply
GND          All Sensors   Ground
```

### Sensor Placement

-   **AD8232**: Place electrodes on chest (RA, LA, RL positions)
-   **HW-484**: Position near nose/mouth for breathing detection
-   **GSR**: Attach to fingers or palm for skin conductance measurement

## 🚀 Calibration Process

### Step 1: Upload Calibration Code

1. Open `sensor_calibration.ino` in Arduino IDE
2. Select your ESP32 board and port
3. Upload the code to your ESP32

### Step 2: Run Calibration

1. Open Serial Monitor at **115200 baud**
2. The calibration will start automatically in 5 seconds
3. Follow the on-screen instructions

### Step 3: Data Collection Phases

#### Phase 1: Baseline Calibration (30 seconds)

-   **Subject**: Remain completely still
-   **Purpose**: Establish baseline sensor values
-   **Output**: Sensor ranges, noise levels, baseline values

#### Phase 2: Breath Analysis (60 seconds)

-   **Subject**: Breathe normally and steadily
-   **Purpose**: Analyze breathing patterns and detect breath in/out
-   **Output**: Breath detection accuracy, respiratory rate calculation

#### Phase 3: Continuous Monitoring

-   **Subject**: Perform various activities (breathing exercises, movement)
-   **Purpose**: Real-time sensor data analysis
-   **Output**: Live sensor readings with breath detection

## 📊 Understanding the Output

### Baseline Calibration Results

```
ECG Sensor (AD8232):
  Range: 2048 - 3072 (Span: 1024)
  Baseline: 2560
  Noise Level: ±512

GSR Sensor:
  Range: 1800 - 2300 (Span: 500)
  Baseline: 2050
  Noise Level: ±250

Respiratory Sensor (HW-484):
  Range: 1900 - 2100 (Span: 200)
  Baseline: 2000
  Noise Level: ±100
```

### Breath Detection Analysis

```
🫁 BREATH IN detected! Raw: 2100, Deviation: +100
🫁 BREATH OUT detected! Raw: 1900, Deviation: -100
```

### Real-time Data Format

```
DATA: timestamp, ecg_raw, ecg_dev, gsr_raw, gsr_dev, resp_raw, resp_dev
DATA: 12345, 2560, +0, 2050, +0, 2000, +0
```

## 🔬 Data Analysis

### Step 1: Save Serial Output

1. Copy all Serial Monitor output
2. Save to a text file (e.g., `calibration_data.txt`)

### Step 2: Run Analysis Script

```bash
python calibration_analyzer.py calibration_data.txt
```

### Step 3: Review Recommendations

The script will generate:

-   Optimal thresholds for each sensor
-   Breath detection parameters
-   Filtering recommendations
-   ESP32 code snippets

## 🎯 Calibration Recommendations

### Breath Detection Thresholds

Based on your data, the script will recommend:

```cpp
// Example recommendations
const int BREATH_IN_THRESHOLD = 75;    // 70% of mean breath-in deviation
const int BREATH_OUT_THRESHOLD = 75;   // 70% of mean breath-out deviation
const int MIN_BREATH_INTERVAL = 1000;  // 1 second minimum between breaths
```

### Sensor-Specific Thresholds

```cpp
// ECG Sensor
const int ECG_PEAK_THRESHOLD = 341;    // Range/3 for QRS detection

// GSR Sensor
const int GSR_CHANGE_THRESHOLD = 62;   // Range/8 for significant changes

// Respiratory Sensor
const int RESP_BREATH_THRESHOLD = 50;  // Range/4 for breath detection
```

## 🔧 Implementing Calibration Results

### Update Your Main Code

1. Copy recommended thresholds to `main.ino`
2. Replace existing threshold values
3. Test with real subjects
4. Fine-tune if necessary

### Example Implementation

```cpp
// Updated breath detection in main.ino
int calculateRespiratoryRate(int rawValue, unsigned long timestamp) {
  int deviation = abs(rawValue - respBaseline);

  if (deviation > BREATH_IN_THRESHOLD && !breathDetected) {
    if (timestamp - lastBreathTime > MIN_BREATH_INTERVAL) {
      breathDetected = true;
      lastBreathTime = timestamp;

      // Determine breath direction
      if (rawValue > respBaseline) {
        // Breath IN
        Serial.println("🫁 Breath IN detected");
      } else {
        // Breath OUT
        Serial.println("🫁 Breath OUT detected");
      }
    }
  } else if (deviation <= BREATH_IN_THRESHOLD) {
    breathDetected = false;
  }

  return currentRespRate;
}
```

## 📈 Expected Results

### Good Calibration Indicators

-   **ECG**: Clear QRS peaks, stable baseline
-   **Breathing**: Distinct breath in/out patterns
-   **GSR**: Stable readings with clear response to stimuli

### Poor Calibration Indicators

-   **ECG**: Excessive noise, unstable baseline
-   **Breathing**: Unclear breath patterns, false detections
-   **GSR**: Drifting baseline, poor signal-to-noise ratio

## 🚨 Troubleshooting

### Common Issues

#### No Sensor Readings

-   Check wiring connections
-   Verify power supply (3.3V)
-   Ensure proper ground connection

#### Excessive Noise

-   Check for loose connections
-   Move away from electrical interference
-   Verify sensor placement

#### Poor Breath Detection

-   Adjust sensor position near nose/mouth
-   Check for background noise
-   Verify threshold calculations

#### Unstable Baseline

-   Ensure subject remains still during calibration
-   Check for sensor movement
-   Verify stable power supply

### Sensor-Specific Issues

#### AD8232 ECG

-   **No signal**: Check electrode placement and conductivity
-   **High noise**: Ensure good skin contact and electrode adhesion
-   **Baseline drift**: Check for movement artifacts

#### HW-484 Sound Sensor

-   **Poor breath detection**: Adjust microphone position
-   **Background noise**: Use in quiet environment
-   **False triggers**: Increase detection threshold

#### GSR Sensor

-   **No response**: Check electrode contact
-   **Drifting values**: Ensure stable electrode placement
-   **Poor sensitivity**: Clean electrodes and skin

## 🔄 Recalibration

### When to Recalibrate

-   After changing sensor placement
-   When switching subjects
-   If detection accuracy decreases
-   After hardware modifications

### Recalibration Process

1. Follow the same calibration procedure
2. Compare results with previous calibration
3. Adjust thresholds if necessary
4. Document changes for future reference

## 📚 Additional Resources

### Technical Documentation

-   [AD8232 ECG Sensor Datasheet](https://wiki.keyestudio.com/Ks0261_keyestudio_AD8232_ECG_Measurement_Heart_Monitor_Sensor_Module)
-   [HW-484 Sound Sensor Guide](https://sichiray-tech.yuque.com/dm0eyv/chanpin/iqepdr0qglekrtc3)
-   [ESP32 ADC Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/peripherals/adc.html)

### Best Practices

-   Calibrate in a controlled environment
-   Document all calibration parameters
-   Test with multiple subjects
-   Monitor long-term performance
-   Implement adaptive thresholds

## 🎉 Success Criteria

Your calibration is successful when:

-   ✅ Breath detection accuracy > 90%
-   ✅ Respiratory rate calculation within ±2 breaths/min
-   ✅ ECG signal quality suitable for QRS detection
-   ✅ GSR baseline stability maintained
-   ✅ Real-time performance meets requirements

## 📞 Support

If you encounter issues:

1. Review this guide thoroughly
2. Check hardware connections
3. Verify sensor specifications
4. Test with known good sensors
5. Document specific error messages

---

**Remember**: Calibration is crucial for accurate vital signs monitoring. Take your time, follow the process carefully, and document your results for future reference.
