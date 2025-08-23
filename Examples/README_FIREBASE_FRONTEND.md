# 🔥 Frontend Firebase Integration for Vital Signs Monitor

This guide will help you set up Firebase logging on the **frontend side** to log **processed sensor data** every 30 seconds when the ESP32 is connected.

## 📋 What You'll Get

-   **Processed sensor data logging** every 30 seconds
-   **Automatic logging** only when ESP32 is connected
-   **Complete processed metrics** including:
    -   Heart Rate (BPM)
    -   Respiratory Rate (breaths/min)
    -   GSR Value and Trend Analysis
    -   ECG Signal Quality Assessment
    -   HRV Metrics (SDNN, RMSSD, pNN50, LF/HF Power)
    -   Respiratory Metrics (inhale/exhale percentages)
    -   Connection Status

## 🚀 Quick Setup

### Step 1: Firebase Project Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create a new project** or select existing one
3. **Enable Realtime Database**:
    - Go to "Realtime Database" in the left sidebar
    - Click "Create Database"
    - Choose "Start in test mode" (for development)
    - Select a location close to you
4. **Get your credentials**:
    - Go to "Project Settings" (gear icon) > "General"
    - Copy all the required values (see Step 2)

### Step 2: Update Frontend Credentials

1. **Edit the `.env` file** in the **root directory**:

    ```bash
    # Replace these with your actual Firebase credentials
    REACT_APP_FIREBASE_API_KEY=your-actual-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
    REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
    REACT_APP_FIREBASE_APP_ID=your-app-id
    ```

2. **Run the setup script** (from root directory):
    ```bash
    python setup_firebase.py
    ```

### Step 3: Install Firebase Dependencies

1. **Install Firebase SDK**:

    ```bash
    npm install firebase
    ```

2. **Restart your development server**:
    ```bash
    npm run dev:clean
    ```

### Step 4: ESP32 Connection

Your ESP32 IP address is already configured in the frontend code:

-   **ESP32 IP**: `10.171.208.121` (from your mobile hotspot)
-   **WebSocket URL**: `ws://10.171.208.121:81`
-   **Port**: 81

The frontend will automatically try to connect to your ESP32 when the page loads.

## 📊 Data Structure

The Firebase database will store **processed data** in this structure:

```
/processed_sensor_logs/
  ├── -NxYz1234567890/
  │   ├── timestamp: 1234567890
  │   ├── heartRate: 75
  │   ├── respiratoryRate: 16
  │   ├── gsrValue: 0.65
  │   ├── gsrTrend: "increasing"
  │   ├── ecgQuality: "good"
  │   ├── hrvMetrics: {
  │   │   ├── sdnn: 45.2
  │   │   ├── rmssd: 32.1
  │   │   ├── pnn50: 25.5
  │   │   ├── lfPower: 156.7
  │   │   ├── hfPower: 89.3
  │   │   └── lfHfRatio: 1.75
  │   │ }
  │   ├── respiratoryMetrics: {
  │   │   ├── breathCount: 12
  │   │   ├── inhalePercent: 45
  │   │   ├── exhalePercent: 55
  │   │   └── breathingState: "inhale"
  │   │ }
  │   ├── connectionStatus: {
  │   │   ├── esp32Connected: true
  │   │   └── sensorsConnected: {
  │   │       ├── ecg: true
  │   │       ├── gsr: true
  │   │       └── respiratory: true
  │   │     }
  │   │ }
  │   ├── logTimestamp: 1234567890
  │   └── logId: "-NxYz1234567890"
  └── -NxYz1234567920/
      └── ... (next 30-second log)
```

## 🔧 How It Works

### Logging Conditions

-   ✅ **ESP32 connected** via WebSocket (`10.171.208.121:81`)
-   ✅ **Every 30 seconds** automatically
-   ✅ **Processed data** from frontend signal processing
-   ✅ **Complete metrics** including HRV and respiratory analysis

### Data Flow

```
ESP32 Raw Data → Frontend Processing → Firebase Realtime Database
     ↓                    ↓                        ↓
   Raw ADC        Signal Processing        Processed Logs
   Values         HRV Analysis           Every 30s
                  Respiratory Analysis
                  GSR Trend Analysis
```

### Connection Tracking

-   **WebSocket events** track ESP32 connection
-   **Automatic start/stop** of Firebase logging
-   **Processed data only** (no raw ADC values)

## 🛠️ Troubleshooting

### Common Issues

1. **"Firebase not ready"**

    - Check Firebase credentials in `.env` (root directory)
    - Ensure Firebase SDK is installed
    - Verify Realtime Database is enabled

2. **"Firebase log failed"**

    - Check Firebase project settings
    - Verify database rules allow writes
    - Check network connectivity

3. **No logs appearing**

    - Check if ESP32 is connected (`10.171.208.121:81`)
    - Verify WebSocket connection
    - Check browser console for errors

4. **ESP32 connection issues**
    - Ensure ESP32 is powered and connected to mobile hotspot
    - Verify ESP32 IP is `10.171.208.121`
    - Check that WebSocket server is running on port 81

### Debug Commands

Check browser console for these messages:

```
✅ Firebase Logger: Connection status set to true
✅ Firebase Logger: Successfully logged processed sensor data
✅ WEBSOCKET: ESP32 WebSocket connected successfully!
```

## 📱 Viewing Data

### Firebase Console

1. Go to your Firebase project
2. Navigate to "Realtime Database"
3. Look for `processed_sensor_logs` folder
4. Data updates every 30 seconds when ESP32 connected

### Programmatic Access

```javascript
// Example: Read latest processed sensor data
firebase
    .database()
    .ref("processed_sensor_logs")
    .orderByKey()
    .limitToLast(1)
    .once("value")
    .then((snapshot) => {
        const data = snapshot.val();
        console.log("Latest processed data:", data);
    });
```

## 🔒 Security Notes

-   **Test mode** is enabled for development
-   **Production** should use proper Firebase security rules
-   **Credentials** are stored in `.env` file (keep secure)
-   **Processed data only** (no raw sensor values)

## 📈 What Gets Logged

### Vital Signs

-   **Heart Rate**: Current BPM from Pan-Tompkins
-   **Respiratory Rate**: Breaths per minute
-   **GSR Value**: Normalized conductance value
-   **GSR Trend**: Increasing/decreasing/stable

### Signal Quality

-   **ECG Quality**: Good/fair/poor based on signal analysis
-   **HRV Metrics**: SDNN, RMSSD, pNN50, LF/HF power
-   **Respiratory Metrics**: Inhale/exhale percentages

### System Status

-   **ESP32 Connection**: Connected/disconnected
-   **Sensor Status**: Individual sensor connection status
-   **Timestamp**: When the data was logged

## 🎯 Expected Results

After setup, you should see:

-   ✅ **Processed data logs** every 30 seconds when ESP32 connected
-   ✅ **Complete metrics** in Firebase Realtime Database
-   ✅ **Automatic start/stop** based on ESP32 connection
-   ✅ **Real-time monitoring** of processed vital signs

---

**Need help?** Check the browser console for detailed error messages and connection status.
