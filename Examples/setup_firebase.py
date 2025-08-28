#!/usr/bin/env python3
"""
Frontend Firebase Setup Script for Vital Signs Monitor
This script helps you set up Firebase logging for the frontend.
"""

import os
import json
from pathlib import Path

def read_env_file():
    """Read the .env file and return a dictionary of variables."""
    env_vars = {}
    env_file = Path('.env')
    
    if not env_file.exists():
        print("❌ .env file not found!")
        return None
    
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key] = value
    
    return env_vars

def validate_firebase_credentials(env_vars):
    """Validate that Firebase credentials are properly set."""
    required_vars = [
        'REACT_APP_FIREBASE_API_KEY',
        'REACT_APP_FIREBASE_AUTH_DOMAIN',
        'REACT_APP_FIREBASE_DATABASE_URL',
        'REACT_APP_FIREBASE_PROJECT_ID',
        'REACT_APP_FIREBASE_STORAGE_BUCKET',
        'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
        'REACT_APP_FIREBASE_APP_ID'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not env_vars.get(var) or env_vars[var] == f'your-{var.lower().replace("react_app_firebase_", "").replace("_", "-")}-here':
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing or invalid Firebase credentials: {', '.join(missing_vars)}")
        return False
    
    print("✅ Firebase credentials look good!")
    return True

def print_setup_instructions():
    """Print setup instructions for Firebase."""
    print("\n" + "="*60)
    print("🔥 FRONTEND FIREBASE SETUP INSTRUCTIONS")
    print("="*60)
    print("\n1. Go to Firebase Console: https://console.firebase.google.com/")
    print("2. Create a new project or select existing one")
    print("3. Enable Realtime Database:")
    print("   - Go to Realtime Database")
    print("   - Click 'Create Database'")
    print("   - Choose 'Start in test mode' (for development)")
    print("4. Get your credentials:")
    print("   - Go to Project Settings > General")
    print("   - Copy 'Web API Key'")
    print("   - Copy 'Project ID'")
    print("   - Copy 'Storage Bucket'")
    print("   - Copy 'Messaging Sender ID'")
    print("   - Copy 'App ID'")
    print("   - Go to Realtime Database")
    print("   - Copy the database URL")
    print("5. Update the .env file with your credentials")
    print("6. Run this script again to validate")
    print("\n" + "="*60)

def main():
    print("🚀 Frontend Firebase Setup Script")
    print("="*40)
    
    # Check if .env file exists
    env_vars = read_env_file()
    if not env_vars:
        print_setup_instructions()
        return
    
    # Validate credentials
    if not validate_firebase_credentials(env_vars):
        print_setup_instructions()
        return
    
    print("\n🎉 Setup complete! Your frontend is ready to log to Firebase.")
    print("\n📋 What will be logged:")
    print("- Heart Rate (BPM)")
    print("- Respiratory Rate (breaths/min)")
    print("- GSR Value and Trend")
    print("- ECG Signal Quality")
    print("- HRV Metrics (SDNN, RMSSD, pNN50, LF/HF Power)")
    print("- Respiratory Metrics (inhale/exhale percentages)")
    print("- Connection Status")
    print("\n📊 Data Structure:")
    print("/processed_sensor_logs/")
    print("  └── [auto-generated-id]/")
    print("      ├── timestamp: 1234567890")
    print("      ├── heartRate: 75")
    print("      ├── respiratoryRate: 16")
    print("      ├── gsrValue: 0.65")
    print("      ├── gsrTrend: 'increasing'")
    print("      ├── ecgQuality: 'good'")
    print("      ├── hrvMetrics: {...}")
    print("      ├── respiratoryMetrics: {...}")
    print("      └── connectionStatus: {...}")
    print("\n⏰ Logging Frequency: Every 30 seconds when ESP32 is connected")
    print("\n🔍 View Data:")
    print("1. Go to Firebase Console > Realtime Database")
    print("2. Look for 'processed_sensor_logs' folder")
    print("3. Data updates every 30 seconds when connected")

if __name__ == "__main__":
    main() 