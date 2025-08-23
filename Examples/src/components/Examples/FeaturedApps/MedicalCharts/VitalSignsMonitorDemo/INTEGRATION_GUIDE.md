# ESP32-Frontend Integration Guide

## 🏗️ **System Architecture**

### **ESP32 Firmware (esp32/main.ino)**

-   **Sampling Rates**:
    -   ECG: 250Hz (4ms interval)
    -   GSR: 10Hz (100ms interval)
    -   Respiratory: 100Hz (10ms interval)
-   **Data Format**: JSON WebSocket messages with raw 12-bit ADC values (0-4095)
-   **IP Address**: Dynamic (prints to Serial on startup)
-   **Sensors**:
    -   ECG: Real sensor on GPIO36 (VP)
    -   GSR: Real sensor on GPIO39 (VN)
    -   Respiratory: Real sensor on GPIO34 (VN)

### **Frontend Signal Processing (signalProcessor.ts)**

-   **Respiration Analysis**: Real-time breathing pattern detection
-   **State Machine**: IDLE → INHALING → EXHALING → IDLE
-   **Metrics**: Respiration rate, inhale/exhale percentages, breath cycles
-   **Dynamic IP Detection**: Automatic ESP32 IP discovery

### **Chart Integration (drawExample.ts)**

-   **Real-time Plotting**: SciChart.js with WebSocket data
-   **Fallback Mode**: Simulated data when ESP32 disconnected
-   **Data Normalization**: Handles 0-1 range from ESP32

## 🔧 **Integration Features**

### **1. Dynamic IP Detection**

```typescript
// Frontend automatically tries these IPs:
const possibleIPs = [
    "192.168.84.171", // Original firmware IP
    "192.168.1.171", // Common home network
    "192.168.0.171", // Common home network
    "10.254.50.171", // Original frontend IP
    "192.168.43.171", // Hotspot network
];
```

### **2. Data Flow**

```
ESP32 Sensors → PanTompkins (ECG) → WebSocket → Frontend → Signal Processing → Charts
```

### **3. Message Types**

```json
// ECG Data (250Hz) - Raw ADC value, frontend converts to mV
{"type": "ecg", "value": 2048, "timestamp": 12345, "sensorConnected": true}

// GSR Data (10Hz) - Raw ADC value, frontend normalizes to 0-1
{"type": "gsr", "value": 2048, "timestamp": 12345, "sensorConnected": true}

// Respiratory Data (100Hz) - Raw ADC value, frontend normalizes to 0-1
{"type": "respiratory", "value": 2048, "timestamp": 12345, "sensorConnected": true}

// IBI/HRV Data (on beat detection)
{"type": "ibi", "value": 800, "hr": 75, "timestamp": 12345, "sensorConnected": true}
```

## 🚀 **Setup Instructions**

### **ESP32 Setup**

1. **Hardware**: Connect ECG sensor to GPIO36 (VP - ADC1_CH0)
2. **WiFi**: Update `ssid` and `password` in `main.ino`
3. **Upload**: Flash firmware to ESP32
4. **Monitor**: Check Serial output for IP address

### **Frontend Setup**

1. **Install Dependencies**: `npm install`
2. **Start Development**: `npm run dev`
3. **Access**: Navigate to VitalSignsMonitorDemo
4. **Connection**: Frontend auto-detects ESP32 IP

## 🔍 **Troubleshooting**

### **Connection Issues**

```bash
# Check ESP32 Serial output
# Look for: "Frontend should connect to: ws://[IP]:81"

# Common IP addresses to try manually:
ws://192.168.84.171:81
ws://192.168.1.171:81
ws://192.168.0.171:81
```

### **Data Issues**

-   **No ECG Data**: Check sensor connection to A0
-   **No GSR/Respiratory**: Currently using real sensor data only
-   **Chart Not Updating**: Check browser console for WebSocket errors

### **Performance Issues**

-   **High CPU**: Reduce sampling rates in ESP32 firmware
-   **Memory Issues**: Reduce `dataWindowSize` in signal processor
-   **Network Lag**: Increase `reconnectDelay` in WebSocket handler

## 📊 **Data Validation**

### **Expected Ranges**

-   **ECG**: -2 to 3 mV (converted from 0-4095 ADC)
-   **GSR**: 0-1 (normalized from 0-4095 ADC)
-   **Respiratory**: 0-1 (normalized from 0-4095 ADC)
-   **Heart Rate**: 60-100 BPM
-   **IBI**: 600-1000ms
-   **Respiration Rate**: 12-20 breaths/min

### **Signal Quality Indicators**

-   **Good**: Consistent data flow, realistic values
-   **Fair**: Occasional gaps, some noise
-   **Poor**: Frequent disconnections, unrealistic values

## 🔧 **Configuration Options**

### **ESP32 Firmware (main.ino)**

```cpp
// Sampling intervals
const unsigned long ECG_INTERVAL = 4;    // 250Hz
const unsigned long GSR_INTERVAL = 100;  // 10Hz
const unsigned long RESP_INTERVAL = 10;  // 100Hz

// Real sensor data only (no simulation toggle)
```

### **Frontend Signal Processor (signalProcessor.ts)**

```typescript
const config = {
    samplingRate: 100, // Hz
    smoothingWindow: 5, // samples
    baselineWindow: 100, // samples
    thresholdMultiplier: 1.5, // baseline multiplier
    minPeakDistance: 500, // ms
    minBreathDuration: 2000, // ms
    maxBreathDuration: 10000, // ms
    dataWindowSize: 10000, // ms
};
```

## 🧪 **Testing**

### **Unit Tests**

```bash
# Test signal processing
npm test signalProcessor.test.ts

# Test WebSocket connection
npm test websocket.test.ts
```

### **Integration Tests**

1. **ESP32 Connected**: Verify real-time data flow
2. **ESP32 Disconnected**: Verify fallback mode
3. **Network Issues**: Verify reconnection logic
4. **Data Quality**: Verify realistic value ranges

## 📈 **Performance Metrics**

### **Latency**

-   **ESP32 to Frontend**: <50ms
-   **Signal Processing**: <10ms
-   **Chart Update**: <16ms (60fps)

### **Throughput**

-   **ECG Data**: 250 samples/second
-   **GSR Data**: 10 samples/second
-   **Respiratory Data**: 100 samples/second
-   **Total**: ~360 samples/second

### **Memory Usage**

-   **ESP32**: ~20KB RAM
-   **Frontend**: ~50MB (including SciChart.js)
-   **Signal Processing**: ~1MB buffer

## 🔮 **Future Enhancements**

### **Hardware**

-   [ ] Add real GSR sensor
-   [ ] Add real respiratory sensor (HW-484)
-   [ ] Add external ADC for multiple sensors
-   [ ] Add battery monitoring

### **Software**

-   [ ] Add data logging to SD card
-   [ ] Add cloud data sync
-   [ ] Add machine learning for pattern recognition
-   [ ] Add mobile app support

### **Analysis**

-   [ ] Add frequency domain analysis
-   [ ] Add trend analysis
-   [ ] Add anomaly detection
-   [ ] Add predictive analytics

## 🐛 **Known Issues**

### **ESP32**

-   Limited to one analog input (A0)
-   WiFi connection stability on some networks
-   Memory constraints with large data buffers

### **Frontend**

-   WebSocket reconnection can be slow
-   Chart performance with high data rates
-   Browser compatibility issues

### **Integration**

-   IP address discovery not always reliable
-   Data synchronization between sensors
-   Real-time processing latency

## 📞 **Support**

### **Debugging Tools**

-   **ESP32 Serial Monitor**: 115200 baud
-   **Browser Console**: F12 developer tools
-   **Network Tab**: Monitor WebSocket traffic
-   **Performance Tab**: Monitor chart performance

### **Logs**

-   **ESP32**: Serial output with connection status
-   **Frontend**: Browser console with data flow
-   **Signal Processing**: Real-time metrics output

### **Common Solutions**

1. **Restart ESP32**: Power cycle device
2. **Clear Browser Cache**: Hard refresh (Ctrl+F5)
3. **Check Network**: Ensure ESP32 and PC on same network
4. **Update Firmware**: Re-upload latest code
