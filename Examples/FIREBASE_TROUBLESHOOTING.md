# 🔥 Firebase Troubleshooting Guide

This guide helps resolve Firebase installation and dependency issues.

## 🚀 Quick Fix Commands

### 1. Install Firebase with Dependency Resolution

```bash
npm run install:firebase
```

### 2. Manual Firebase Installation

```bash
npm install firebase@^10.7.1
```

### 3. Clear npm Cache and Reinstall

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🔍 Common Issues and Solutions

### Issue 1: "Module not found: 'firebase'"

**Symptoms:**

-   Error: `Cannot find module 'firebase'`
-   Import fails: `import { initializeApp } from 'firebase/app'`

**Solutions:**

1. **Install Firebase:**

    ```bash
    npm install firebase@^10.7.1
    ```

2. **Check package.json:**

    ```json
    {
        "dependencies": {
            "firebase": "^10.7.1"
        }
    }
    ```

3. **Restart development server:**
    ```bash
    npm run dev:clean
    ```

### Issue 2: "Firebase App named '[DEFAULT]' already exists"

**Symptoms:**

-   Error: `Firebase App named '[DEFAULT]' already exists`
-   Multiple Firebase initializations

**Solutions:**

1. **Check for duplicate imports in firebaseLogger.ts:**

    ```typescript
    // Ensure only one initialization
    if (!app) {
        app = initializeApp(firebaseConfig);
    }
    ```

2. **Clear browser cache and restart**

### Issue 3: "Firebase configuration error"

**Symptoms:**

-   Error: `Firebase configuration error`
-   Invalid API key or project settings

**Solutions:**

1. **Verify .env file in root directory:**

    ```env
    REACT_APP_FIREBASE_API_KEY=your-actual-api-key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
    REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
    REACT_APP_FIREBASE_PROJECT_ID=your-project-id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
    REACT_APP_FIREBASE_APP_ID=your-app-id
    ```

2. **Run setup validation:**
    ```bash
    python setup_firebase.py
    ```

### Issue 4: "Dependency conflicts"

**Symptoms:**

-   npm audit warnings
-   Version conflicts
-   Peer dependency warnings

**Solutions:**

1. **Run dependency resolution:**

    ```bash
    npm audit fix
    npm install
    ```

2. **Check for conflicting packages:**
    ```bash
    npm ls firebase
    npm ls react
    npm ls typescript
    ```

### Issue 5: "WebSocket connection issues"

**Symptoms:**

-   ESP32 not connecting
-   WebSocket client disconnects
-   Connection timeout

**Solutions:**

1. **Test WebSocket connection:**

    - Open `test_websocket.html` in browser
    - Try connecting to `ws://10.171.208.121:81`

2. **Check ESP32 Serial Monitor:**

    - Verify IP address: `10.171.208.121`
    - Check WebSocket server status
    - Look for connection logs

3. **Network troubleshooting:**
    - Ensure both devices on same network
    - Check firewall settings
    - Verify ESP32 WiFi connection

## 📋 Installation Checklist

### ✅ Pre-Installation

-   [ ] Node.js and npm installed
-   [ ] Project dependencies installed
-   [ ] .env file created in root directory

### ✅ Firebase Setup

-   [ ] Firebase project created
-   [ ] Realtime Database enabled
-   [ ] Credentials copied to .env
-   [ ] Firebase SDK installed

### ✅ Verification

-   [ ] `npm list firebase` shows version
-   [ ] No TypeScript errors
-   [ ] WebSocket connection works
-   [ ] Firebase logging functional

## 🛠️ Advanced Troubleshooting

### PowerShell Execution Policy Issues

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### npm Permission Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall with clean slate
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Configuration Issues

```json
// tsconfig.json - ensure Firebase types are included
{
    "compilerOptions": {
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true
    }
}
```

### Webpack Configuration Issues

```javascript
// webpack.config.js - ensure Firebase is bundled
module.exports = {
    resolve: {
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer"),
        },
    },
};
```

## 📞 Getting Help

### Debug Commands

```bash
# Check Firebase installation
npm list firebase

# Check for dependency conflicts
npm audit

# Test WebSocket connection
# Open test_websocket.html in browser

# Validate .env file
python setup_firebase.py
```

### Console Logs to Check

```javascript
// Browser console - look for these messages:
✅ Firebase Logger: Connection status set to true
✅ Firebase Logger: Successfully logged processed sensor data
✅ WEBSOCKET: ESP32 WebSocket connected successfully!
```

### ESP32 Serial Monitor - Look for:

```
WiFi connected!
IP Address: 10.171.208.121
ESP32 WebSocket server started on port 81
WebSocket client #0 connected from [IP]
```

## 🎯 Expected Results

After successful setup:

-   ✅ Firebase logs data every 30 seconds when ESP32 connected
-   ✅ CSV files download when recording stops
-   ✅ WebSocket connection shows "Connected" status
-   ✅ No console errors related to Firebase or WebSocket
-   ✅ ESP32 sends data to frontend successfully

---

**Need more help?** Check the browser console for detailed error messages and connection status.
