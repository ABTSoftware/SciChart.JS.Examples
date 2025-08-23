# 🔥 Firebase Integration for ESP32 Vital Signs Monitor

This guide will help you set up Firebase logging for your ESP32 vital signs monitor. The system will log sensor data every 30 seconds when the frontend is connected.

## 📋 What You'll Get

-   **Real-time sensor data logging** every 30 seconds
-   **Automatic logging** only when frontend is connected
-   **Complete sensor data** including ECG, GSR, Respiratory, Heart Rate, and IBI
-   **Firebase Realtime Database** storage for easy access

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
    - Scroll down to "Your apps" section
    - Copy the "Web API Key"
    - Go back to "Realtime Database"
    - Copy the database URL (looks like: `https://your-project.firebaseio.com`)

### Step 2: Update Credentials

1. **Edit the `.env` file** in the `esp32` folder:

    ```bash
    # Replace these with your actual Firebase credentials
    FIREBASE_API_KEY=your-actual-api-key-here
    FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
    FIREBASE_USER_EMAIL=your-email@example.com
    FIREBASE_USER_PASSWORD=your-password-here
    ```

2. **Run the setup script**:
    ```bash
    cd esp32
    python setup_firebase.py
    ```

### Step 3: Install Arduino Library

1. **Open Arduino IDE**
2. **Go to Tools > Manage Libraries**
3. **Search for**: "Firebase ESP32 Client"
4. **Install** the library by "Mobizt"

### Step 4: Upload to ESP32

1. **Open** `main.ino` in Arduino IDE
2. **Select your ESP32 board** and port
3. **Upload** the code

## 📊 Data Structure

The Firebase database will store data in this structure:

```
/sensor_logs/
  ├── 1234567890/
  │   ├── timestamp: "1234567890"
  │   ├── ecg_raw: 2048
  │   ├── gsr_raw: 1500
  │   ├── respiratory_raw: 1800
  │   ├── heart_rate: 75
  │   ├── ibi: 800
  │   ├── frontend_connected: true
  │   └── connected_clients: 1
  └── 1234567920/
      └── ... (next 30-second log)
```

## 🔧 How It Works

### Logging Conditions

-   ✅ **Frontend connected** via WebSocket
-   ✅ **Every 30 seconds** automatically
-   ✅ **Real sensor data** from analog pins
-   ✅ **Complete dataset** including all vital signs

### Data Flow

```
Analog Pins → ESP32 Processing → Firebase Realtime Database
     ↓              ↓                    ↓
   Raw ADC    Pan-Tompkins        JSON Logs
   Values     Beat Detection      Every 30s
```

### Connection Tracking

-   **WebSocket events** track frontend connection
-   **Automatic start/stop** of Firebase logging
-   **Client count** monitoring

## 🛠️ Troubleshooting

### Common Issues

1. **"Firebase not ready"**

    - Check WiFi connection
    - Verify Firebase credentials in `.env`
    - Ensure Firebase library is installed

2. **"Firebase signin failed"**

    - Check email/password in `.env`
    - Verify Firebase project settings
    - Ensure Realtime Database is enabled

3. **No logs appearing**
    - Check if frontend is connected
    - Verify WebSocket connection
    - Check Serial Monitor for errors

### Debug Commands

Check Serial Monitor for these messages:

```
✅ Firebase signin successful
✅ Frontend connected - starting Firebase logging
✅ Firebase log successful: /sensor_logs/1234567890
```

## 📱 Viewing Data

### Firebase Console

1. Go to your Firebase project
2. Navigate to "Realtime Database"
3. Look for `/sensor_logs/` folder
4. Data updates every 30 seconds when connected

### Programmatic Access

```javascript
// Example: Read latest sensor data
firebase
    .database()
    .ref("sensor_logs")
    .orderByKey()
    .limitToLast(1)
    .once("value")
    .then((snapshot) => {
        const data = snapshot.val();
        console.log("Latest sensor data:", data);
    });
```

## 🔒 Security Notes

-   **Test mode** is enabled for development
-   **Production** should use proper Firebase security rules
-   **Credentials** are stored in `.env` file (keep secure)
-   **WiFi credentials** are also in `.env`

## 📈 Next Steps

1. **Set up Firebase security rules** for production
2. **Add data visualization** using Firebase data
3. **Implement data analytics** on logged sensor data
4. **Add alerts** for abnormal vital signs

## 🎯 Expected Results

After setup, you should see:

-   ✅ **Firebase logs** every 30 seconds when frontend connected
-   ✅ **Complete sensor data** in Firebase Realtime Database
-   ✅ **Automatic start/stop** based on frontend connection
-   ✅ **Real-time monitoring** of vital signs

---

**Need help?** Check the Serial Monitor for detailed error messages and connection status.
