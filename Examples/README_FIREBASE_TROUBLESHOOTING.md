# 🔥 Firebase Troubleshooting Guide

## **Problem**: No data appearing in Firebase Realtime Database despite correct environment variables

### **🔍 Step-by-Step Diagnosis**

#### **1. Check Browser Console for Errors**

Open your browser's Developer Tools (F12) and check the Console tab for:

-   ✅ Firebase initialization messages
-   ❌ Error messages
-   🔧 Connection test results

**Expected Console Output:**

```
✅ Firebase initialized successfully
📊 Database URL: https://biofeedback-a3a9d-default-rtdb.firebaseio.com
🔧 Firebase Logger initialized
✅ Firebase Logger: Connection test successful
```

**If you see errors, note them down!**

#### **2. Test Firebase Connection Manually**

1. Click the **🧪 Test Firebase** button in your app
2. Check console for test results
3. Check Firebase Console for new data

#### **3. Verify Firebase Security Rules**

**⚠️ CRITICAL**: This is likely the main issue!

Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Realtime Database → Rules

**Current Rules (Problematic):**

```json
{
    "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
    }
}
```

**Updated Rules (Allow Read/Write):**

```json
{
    "rules": {
        ".read": true,
        ".write": true
    }
}
```

**⚠️ WARNING**: These rules allow anyone to read/write. For production, use proper authentication.

#### **4. Check Firebase Project Settings**

1. **Go to Firebase Console** → Project Settings
2. **Verify these match your .env file:**
    - Project ID: `biofeedback-a3a9d`
    - Web API Key: `AIzaSyC2Il3KXMbvIwiVO-q2QnyjCzXWOU6qUBQ`
    - Database URL: `https://biofeedback-a3a9d-default-rtdb.firebaseio.com`

#### **5. Verify Database Path**

**Expected Data Structure:**

```
biofeedback-a3a9d-default-rtdb.firebaseio.com/
├── connection_test/          # Connection test data
├── processed_sensor_logs/    # Main sensor data
│   ├── -NxYz123...          # Auto-generated keys
│   └── -NxYz124...
├── logs_summary/             # Summary information
└── events/                   # Event logs
```

#### **6. Test with Firebase CLI (Optional)**

If you have Firebase CLI installed:

```bash
firebase login
firebase projects:list
firebase database:get / --project biofeedback-a3a9d
```

### **🔧 Common Fixes**

#### **Fix 1: Update Security Rules**

```json
{
    "rules": {
        ".read": true,
        ".write": true
    }
}
```

#### **Fix 2: Check Database Region**

-   Ensure your database is in the correct region
-   Check if there are any regional restrictions

#### **Fix 3: Verify Environment Variables**

-   Ensure `.env` file is in the **root directory** (not in subfolders)
-   Restart your development server after changing `.env`
-   Check that all variables start with `REACT_APP_`

#### **Fix 4: Clear Browser Cache**

-   Hard refresh (Ctrl+F5)
-   Clear browser cache and cookies
-   Try incognito/private browsing mode

### **🧪 Testing Steps**

1. **Upload the updated ESP32 code** (with new pin configuration)
2. **Restart your React development server**
3. **Open browser console** and look for Firebase messages
4. **Click "🧪 Test Firebase" button**
5. **Check Firebase Console** for new data
6. **Wait 30 seconds** for automatic logging to start

### **📊 Expected Results**

**After successful setup, you should see:**

-   Console: `✅ Firebase Logger: Successfully logged data #1 to Firebase`
-   Firebase Console: New data under `processed_sensor_logs/`
-   Data appearing every 30 seconds when sensors are active

### **🚨 Still Not Working?**

**Check these additional issues:**

1. **Network/Firewall**: Corporate networks may block Firebase
2. **Browser Extensions**: Ad blockers might interfere
3. **Firebase Quota**: Check if you've exceeded free tier limits
4. **Project Status**: Ensure Firebase project is active and not suspended

### **📞 Get Help**

**Include these details when asking for help:**

1. Console error messages (screenshot)
2. Firebase security rules (copy/paste)
3. Environment variables (with sensitive data redacted)
4. Browser and OS version
5. Steps you've already tried

---

**💡 Pro Tip**: The "🧪 Test Firebase" button will help isolate whether the issue is with Firebase configuration or with the automatic logging system.
