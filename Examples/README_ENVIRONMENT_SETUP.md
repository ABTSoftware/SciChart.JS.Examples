# Environment Variables Setup Guide

## **🔧 Overview**

This guide explains how to properly configure environment variables for the Vital Signs Monitor application, particularly for Firebase integration.

## **📁 File Structure**

```
project-root/
├── .env                          # Environment variables file
├── src/
│   ├── config/
│   │   └── environment.ts       # Environment configuration loader
│   └── components/
│       └── Examples/
│           └── FeaturedApps/
│               └── MedicalCharts/
│                   └── VitalSignsMonitorDemo/
│                       └── firebaseLogger.ts  # Firebase integration
```

## **🌍 Environment Variables**

### **Required Variables**

The following environment variables must be set in your `.env` file:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### **Important Notes**

1. **REACT*APP* Prefix**: All environment variables must start with `REACT_APP_` to be accessible in React
2. **No Spaces**: Don't use spaces around the `=` sign
3. **No Quotes**: Don't wrap values in quotes unless they contain spaces
4. **Restart Required**: You must restart your development server after changing `.env` files

## **🔧 Setup Steps**

### **Step 1: Create .env File**

Create a `.env` file in your project root directory:

```bash
# In your project root
touch .env
```

### **Step 2: Add Firebase Credentials**

Copy your Firebase credentials from the Firebase Console and add them to `.env`:

```bash
# Firebase Configuration for Frontend
REACT_APP_FIREBASE_API_KEY=AIzaSyC2Il3KXMbvIwiVO-q2QnyjCzXWOU6qUBQ
REACT_APP_FIREBASE_AUTH_DOMAIN=biofeedback-a3a9d.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://biofeedback-a3a9d-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=biofeedback-a3a9d
REACT_APP_FIREBASE_STORAGE_BUCKET=biofeedback-a3a9d.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=954340658821
REACT_APP_FIREBASE_APP_ID=1:954340658821:web:a00254b2676da9d5d3e3ec
```

### **Step 3: Restart Development Server**

After creating/modifying the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## **🔍 Verification**

### **Check Console Logs**

When the application starts, you should see:

```
🌐 Browser environment detected
🔍 Available environment variables:
  REACT_APP_FIREBASE_API_KEY: ✅ Set
  REACT_APP_FIREBASE_AUTH_DOMAIN: ✅ Set
  REACT_APP_FIREBASE_DATABASE_URL: ✅ Set
  REACT_APP_FIREBASE_PROJECT_ID: ✅ Set
  REACT_APP_FIREBASE_STORAGE_BUCKET: ✅ Set
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ✅ Set
  REACT_APP_FIREBASE_APP_ID: ✅ Set
✅ All required Firebase environment variables are loaded
🔧 Development environment detected
📊 Environment config loaded: {...}
```

### **Check Firebase Connection**

Look for these logs in the console:

```
🧪 Testing Firebase connection...
✅ Firebase Logger: Connection test successful
📊 Test data written to: connection_test
📖 Test data read back successfully: {...}
```

## **🚨 Troubleshooting**

### **Problem: Environment Variables Not Loading**

**Symptoms:**

-   Console shows "❌ Missing" for environment variables
-   Firebase connection fails
-   "process.env is undefined" errors

**Solutions:**

1. **Verify .env location**: Ensure `.env` is in the project root (same level as `package.json`)
2. **Check variable names**: All variables must start with `REACT_APP_`
3. **Restart server**: Environment variables are only loaded when the server starts
4. **Clear cache**: Try `npm run build` then `npm run dev`

### **Problem: Firebase Connection Fails**

**Symptoms:**

-   "❌ Firebase Logger: Connection test failed" errors
-   Permission denied errors

**Solutions:**

1. **Check Firebase Rules**: Ensure database rules allow read/write
2. **Verify Project ID**: Check that project ID matches Firebase console
3. **Check API Key**: Ensure API key is correct and not restricted
4. **Network Issues**: Check if your network blocks Firebase

### **Problem: TypeScript Errors**

**Symptoms:**

-   Compilation errors about missing properties
-   Type mismatches

**Solutions:**

1. **Restart TypeScript server**: In VS Code, Ctrl+Shift+P → "TypeScript: Restart TS Server"
2. **Clear build cache**: Delete `node_modules/.cache` and restart
3. **Check imports**: Ensure `environment.ts` is properly imported

## **🔒 Security Best Practices**

### **Do NOT Commit .env Files**

Add `.env` to your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### **Use Different Configs for Different Environments**

```bash
# Development
.env.development

# Production
.env.production

# Local overrides
.env.local
```

### **Validate Environment Variables**

The `environment.ts` file automatically validates required variables and provides helpful error messages.

## **📚 Additional Resources**

-   [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
-   [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
-   [Environment Variables Best Practices](https://12factor.net/config)

## **🆘 Getting Help**

If you're still having issues:

1. Check the browser console for error messages
2. Verify your Firebase project settings
3. Ensure your `.env` file is properly formatted
4. Restart your development server
5. Check that all required variables are set

## **✅ Success Checklist**

-   [ ] `.env` file created in project root
-   [ ] All `REACT_APP_` variables set
-   [ ] Development server restarted
-   [ ] Console shows "✅ All required Firebase environment variables are loaded"
-   [ ] Firebase connection test successful
-   [ ] No TypeScript compilation errors
