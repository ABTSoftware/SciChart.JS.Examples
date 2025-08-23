#!/usr/bin/env python3
"""
Firebase Setup Script for ESP32 Vital Signs Monitor
This script helps you set up Firebase and update the ESP32 code with your credentials.
"""

import os
import re
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

def update_esp32_code(env_vars):
    """Update the ESP32 main.ino file with Firebase credentials."""
    ino_file = Path('main.ino')
    
    if not ino_file.exists():
        print("❌ main.ino file not found!")
        return False
    
    # Read the current file
    with open(ino_file, 'r') as f:
        content = f.read()
    
    # Update Firebase configuration
    replacements = {
        'your-api-key-here': env_vars.get('FIREBASE_API_KEY', 'your-api-key-here'),
        'your-database-url-here': env_vars.get('FIREBASE_DATABASE_URL', 'your-database-url-here'),
        'your-email@example.com': env_vars.get('FIREBASE_USER_EMAIL', 'your-email@example.com'),
        'your-password-here': env_vars.get('FIREBASE_USER_PASSWORD', 'your-password-here'),
        'Airtel_301': env_vars.get('WIFI_SSID', 'Airtel_301'),
        'Wifi@2025': env_vars.get('WIFI_PASSWORD', 'Wifi@2025')
    }
    
    # Apply replacements
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    # Write back to file
    with open(ino_file, 'w') as f:
        f.write(content)
    
    print("✅ ESP32 code updated with your credentials!")
    return True

def validate_firebase_credentials(env_vars):
    """Validate that Firebase credentials are properly set."""
    required_vars = [
        'FIREBASE_API_KEY',
        'FIREBASE_DATABASE_URL', 
        'FIREBASE_USER_EMAIL',
        'FIREBASE_USER_PASSWORD'
    ]
    
    missing_vars = []
    for var in required_vars:
        if not env_vars.get(var) or env_vars[var] == f'your-{var.lower().replace("firebase_", "").replace("_", "-")}-here':
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing or invalid Firebase credentials: {', '.join(missing_vars)}")
        return False
    
    print("✅ Firebase credentials look good!")
    return True

def print_setup_instructions():
    """Print setup instructions for Firebase."""
    print("\n" + "="*60)
    print("🔥 FIREBASE SETUP INSTRUCTIONS")
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
    print("   - Go to Realtime Database")
    print("   - Copy the database URL")
    print("5. Update the .env file with your credentials")
    print("6. Run this script again to update the ESP32 code")
    print("\n" + "="*60)

def main():
    print("🚀 ESP32 Firebase Setup Script")
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
    
    # Update ESP32 code
    if update_esp32_code(env_vars):
        print("\n🎉 Setup complete! Your ESP32 is ready to log to Firebase.")
        print("\n📋 Next steps:")
        print("1. Install Firebase library in Arduino IDE:")
        print("   - Tools > Manage Libraries")
        print("   - Search: 'Firebase ESP32 Client'")
        print("   - Install by 'Mobizt'")
        print("2. Upload the updated main.ino to your ESP32")
        print("3. Connect your frontend to see Firebase logging every 30 seconds")
        print("4. Check Firebase Console > Realtime Database > sensor_logs")
    else:
        print("❌ Failed to update ESP32 code")

if __name__ == "__main__":
    main() 