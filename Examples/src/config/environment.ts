// Environment configuration for the application
// This file ensures environment variables are properly loaded and validated

interface EnvironmentConfig {
    firebase: {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
        appId: string;
    };
    app: {
        isDevelopment: boolean;
        isProduction: boolean;
        version: string;
    };
}

// Safe way to access environment variables in both Node.js and browser
const getEnvVar = (key: string): string | undefined => {
    // Try to access process.env (Node.js)
    if (typeof process !== "undefined" && process.env) {
        return process.env[key];
    }

    // Try to access window.__ENV__ (if set by webpack)
    if (typeof window !== "undefined" && (window as any).__ENV__) {
        return (window as any).__ENV__[key];
    }

    // Try to access global.__ENV__ (if set by webpack)
    if (typeof global !== "undefined" && (global as any).__ENV__) {
        return (global as any).__ENV__[key];
    }

    return undefined;
};

// Fallback Firebase configuration (from .env file)
const FALLBACK_FIREBASE_CONFIG = {
    apiKey: "AIzaSyC2Il3KXMbvIwiVO-q2QnyjCzXWOU6qUBQ",
    authDomain: "biofeedback-a3a9d.firebaseapp.com",
    databaseURL: "https://biofeedback-a3a9d-default-rtdb.firebaseio.com",
    projectId: "biofeedback-a3a9d",
    storageBucket: "biofeedback-a3a9d.firebasestorage.app",
    messagingSenderId: "954340658821",
    appId: "1:954340658821:web:a00254b2676da9d5d3e3ec",
};

// Load environment variables with fallbacks
const loadEnvironmentConfig = (): EnvironmentConfig => {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
        console.log("🌐 Browser environment detected");
        console.log("🔍 Available environment variables:", {
            REACT_APP_FIREBASE_API_KEY: getEnvVar("REACT_APP_FIREBASE_API_KEY") ? "✅ Set" : "❌ Missing",
            REACT_APP_FIREBASE_AUTH_DOMAIN: getEnvVar("REACT_APP_FIREBASE_AUTH_DOMAIN") ? "✅ Set" : "❌ Missing",
            REACT_APP_FIREBASE_DATABASE_URL: getEnvVar("REACT_APP_FIREBASE_DATABASE_URL") ? "✅ Set" : "❌ Missing",
            REACT_APP_FIREBASE_PROJECT_ID: getEnvVar("REACT_APP_FIREBASE_PROJECT_ID") ? "✅ Set" : "❌ Missing",
            REACT_APP_FIREBASE_STORAGE_BUCKET: getEnvVar("REACT_APP_FIREBASE_STORAGE_BUCKET") ? "✅ Set" : "❌ Missing",
            REACT_APP_FIREBASE_MESSAGING_SENDER_ID: getEnvVar("REACT_APP_FIREBASE_MESSAGING_SENDER_ID")
                ? "✅ Set"
                : "❌ Missing",
            REACT_APP_FIREBASE_APP_ID: getEnvVar("REACT_APP_FIREBASE_APP_ID") ? "✅ Set" : "❌ Missing",
        });
    }

    // Try to load from environment variables first, fallback to hardcoded values
    const config: EnvironmentConfig = {
        firebase: {
            apiKey: getEnvVar("REACT_APP_FIREBASE_API_KEY") || FALLBACK_FIREBASE_CONFIG.apiKey,
            authDomain: getEnvVar("REACT_APP_FIREBASE_AUTH_DOMAIN") || FALLBACK_FIREBASE_CONFIG.authDomain,
            databaseURL: getEnvVar("REACT_APP_FIREBASE_DATABASE_URL") || FALLBACK_FIREBASE_CONFIG.databaseURL,
            projectId: getEnvVar("REACT_APP_FIREBASE_PROJECT_ID") || FALLBACK_FIREBASE_CONFIG.projectId,
            storageBucket: getEnvVar("REACT_APP_FIREBASE_STORAGE_BUCKET") || FALLBACK_FIREBASE_CONFIG.storageBucket,
            messagingSenderId:
                getEnvVar("REACT_APP_FIREBASE_MESSAGING_SENDER_ID") || FALLBACK_FIREBASE_CONFIG.messagingSenderId,
            appId: getEnvVar("REACT_APP_FIREBASE_APP_ID") || FALLBACK_FIREBASE_CONFIG.appId,
        },
        app: {
            isDevelopment: getEnvVar("NODE_ENV") === "development" || true, // Default to development
            isProduction: getEnvVar("NODE_ENV") === "production" || false,
            version: getEnvVar("REACT_APP_VERSION") || "1.0.0",
        },
    };

    // Validate required Firebase configuration
    const requiredFirebaseFields = ["apiKey", "authDomain", "databaseURL", "projectId"];
    const missingFields = requiredFirebaseFields.filter(
        (field) => !config.firebase[field as keyof typeof config.firebase]
    );

    if (missingFields.length > 0) {
        console.warn("⚠️ Missing required Firebase environment variables:", missingFields);
        console.warn("💡 Please check your .env file and ensure all required variables are set");

        // In development, provide helpful debugging info
        if (isBrowser) {
            console.warn("🔧 Debug: Environment variables not accessible in browser");
            console.warn("💡 This usually means webpack is not configured to expose them");
            console.warn("💡 Check if webpack has DefinePlugin configured for environment variables");
        }
    } else {
        console.log("✅ All required Firebase environment variables are loaded");
    }

    return config;
};

// Export the loaded configuration
export const envConfig = loadEnvironmentConfig();

// Export individual Firebase config for direct use
export const firebaseConfig = envConfig.firebase;

// Export environment helpers
export const isDevelopment = envConfig.app.isDevelopment;
export const isProduction = envConfig.app.isProduction;
export const appVersion = envConfig.app.version;

// Debug logging in development
if (isDevelopment) {
    console.log("🔧 Development environment detected");
    console.log("📊 Environment config loaded:", {
        firebase: {
            apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : "Missing",
            authDomain: firebaseConfig.authDomain,
            databaseURL: firebaseConfig.databaseURL,
            projectId: firebaseConfig.projectId,
        },
        app: {
            version: appVersion,
            environment: getEnvVar("NODE_ENV") || "development",
        },
    });
}
