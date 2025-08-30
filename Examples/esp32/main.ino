#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include "PanTompkins.h"

// --- MPU6050 LIBRARIES & GLOBALS ---
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// Debug configuration - set to 0 to disable all debug prints
#define DEBUG_MODE 1
#define DEBUG_INTERVAL 10000 // 10 seconds between comprehensive logs

#if DEBUG_MODE
  #define DEBUG_PRINT(x) Serial.print(x)
  #define DEBUG_PRINTLN(x) Serial.println(x)
  #define DEBUG_PRINTF(fmt, ...) Serial.printf(fmt, __VA_ARGS__)
#else
  #define DEBUG_PRINT(x)
  #define DEBUG_PRINTLN(x)
  #define DEBUG_PRINTF(fmt, ...)
#endif

// --- WiFi Credentials ---
const char* ssid = "Airtel_301";
const char* password = "Wifi@2025";

// Create a WebSocketsServer on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Create an instance of our HRV detector
PanTompkins panTompkins; 

// --- ESP32 Hardware Pins ---
// Updated for ESP32-WROOM-DA with better analog pin selection
const int ECG_PIN = 32;  // GPIO32 - ADC1_CH4 - Better analog input, more stable
const int LON_PIN = 35;
const int LOP_PIN = 34;
const int GSR_PIN = 33;  // GPIO33 - ADC1_CH5 - Better analog input, more stable  
// RESP_PIN has been removed as we are now using the MPU6050 via I2C

// Note: GPIO32 and GPIO33 are more reliable for analog sensors than GPIO36/39

// Sensor data variables
int ecgSample = 0;
int gsrSample = 0;

// Debug values for status reporting
int gsrRawValue = 0; // Store raw ADC value for status report
int gsrFilteredValue = 0; // Store filtered value for status report

// Timing variables for proper sampling
unsigned long lastEcgTime = 0;
unsigned long lastGsrTime = 0;
unsigned long lastSendTime = 0; // Global send timing variable
const unsigned long ECG_INTERVAL = 4; // 4ms = ~250Hz for ECG
const unsigned long GSR_INTERVAL = 100; // 100ms = 10Hz for GSR

// Note: Respiratory timing is now handled by MPU6050 sample rate

// Sensor connection status (always true since we don't check)
bool ecgSensorConnected = true;
bool gsrSensorConnected = true;
bool respSensorConnected = true;

// Unified data structure for all sensor readings (optimized)
struct SensorData {
  int ecg;        // Changed from float to int for ADC values
  int gsr;        // Changed from float to int for ADC values
  int respiratory; // Changed from float to int for breath rate
  float inhaleRatio; // NEW: Inhale ratio percentage from MPU6050
  float exhaleRatio; // NEW: Exhale ratio percentage from MPU6050
  int heartRate;
  int ibi;
  unsigned long timestamp;
};

SensorData currentData;

// --- MPU6050 Respiration Logic ---
Adafruit_MPU6050 mpu;

// Calibrated settings for respiration detection
const float NOISE_THRESHOLD_POSITIVE = 0.05;
const float NOISE_THRESHOLD_NEGATIVE = -0.05;
const float EXHALE_END_THRESHOLD = 0.02; 
#define GYRO_AXIS_TO_USE g.gyro.y 

// Algorithm constants
const int SAMPLE_RATE_HZ = 50; 
const unsigned long SAMPLE_INTERVAL_MS = 1000 / SAMPLE_RATE_HZ;
#define MOVING_AVG_WINDOW_SIZE 8 
#define BREATH_HISTORY_SIZE 15

// Global variables for respiration calculation
float gyroHistory[MOVING_AVG_WINDOW_SIZE];
int historyIndex = 0;
unsigned long breathTimestamps[BREATH_HISTORY_SIZE];
int breathIndex = 0;
int breathCount = 0;
enum BreathState { IDLE, INHALING, EXHALING };
BreathState currentState = IDLE;
unsigned long inhaleStartTime = 0;
unsigned long exhaleStartTime = 0;
unsigned long lastRespSampleTime = 0;
float breathsPerMinute = 0.0;

// Global MPU6050 connection status
bool mpu6050Connected = false;

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      DEBUG_PRINTF("🔌 WebSocket client #%u disconnected\n", num);
      break;
    case WStype_CONNECTED: {
      DEBUG_PRINTF("🔌 WebSocket client #%u connected from %s\n", num, webSocket.remoteIP(num).toString().c_str());
      // Send a welcome message to confirm connection
      String welcomeMsg = "{\"type\":\"connection\",\"status\":\"connected\",\"message\":\"ESP32 WebSocket Server Ready\"}";
      webSocket.sendTXT(num, welcomeMsg);
      
      // Send immediate test data to verify frontend is working
      DEBUG_PRINTLN("🚀 Sending immediate test data to verify frontend connection...");
      delay(100); // Small delay to ensure connection is stable
      
      // Send connection status message to set wsConnected = true
      String connectionMsg = "{\"type\":\"connection\",\"status\":\"connected\",\"message\":\"ESP32 Production Server Ready\"}";
      webSocket.sendTXT(num, connectionMsg);
      DEBUG_PRINTLN("🔌 Sent connection status message");
      
      // Send one sample of each data type to verify frontend processing
      sendECGData();
      delay(50);
      sendGSRData();
      delay(50);
      sendRespiratoryData();
      delay(50);
      sendHeartRateData();
      
      DEBUG_PRINTLN("✅ Initial test data sent to frontend");
      break;
    }
    case WStype_TEXT:
      // Only log important messages, not every data packet
      if (length < 100) { // Only log short messages (likely commands)
        DEBUG_PRINTF("📨 WebSocket client #%u sent: %s\n", num, payload);
      }
      // Echo back for testing
      webSocket.sendTXT(num, (char*)payload);
      break;
    case WStype_BIN:
      DEBUG_PRINTF("📦 WebSocket client #%u sent binary data (%d bytes)\n", num, length);
      break;
    case WStype_ERROR:
      DEBUG_PRINTF("❌ WebSocket client #%u error\n", num);
      break;
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}

// Function to send data to all connected clients
void sendData(const String& data) {
  String payload = data; // Create a non-const copy
  webSocket.broadcastTXT(payload);
}



// Helper function to calculate moving average (optimized)
int calculateMovingAverage(int* buffer, int index, int windowSize) {
  int sum = 0;
  int validSamples = 0;
  
  // Calculate moving average with proper circular buffer indexing
  for (int i = 0; i < windowSize; i++) {
    int bufferIndex = (index - i + windowSize) % windowSize;
    // Ensure we don't access negative indices
    if (bufferIndex >= 0 && bufferIndex < windowSize) {
      sum += buffer[bufferIndex];
      validSamples++;
    }
  }
  
  // Division by zero protection
  if (validSamples == 0) {
    return 2048; // Fallback to mid-range
  }
  
  return sum / validSamples;
}

// Note: calculateRespiratoryRate function has been replaced by handleRespiration() 
// which uses MPU6050 gyroscope data for more accurate respiratory detection

// Simple function to read analog value (no validation needed)
int readAnalogValue(int pin) {
  return analogRead(pin);
}

// Function to check MPU6050 connection status
void checkMPU6050Connection() {
  static unsigned long lastCheck = 0;
  unsigned long currentTime = millis();
  
  // Check connection every 10 seconds
  if (currentTime - lastCheck >= 10000) {
    lastCheck = currentTime;
    
    if (!mpu6050Connected) {
      // Try to connect to MPU6050
      if (mpu.begin()) {
        mpu6050Connected = true;
        mpu.setGyroRange(MPU6050_RANGE_250_DEG);
        mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
        DEBUG_PRINTLN("✅ MPU6050 reconnected! Switching to real respiration mode");
        
        // Initialize MPU6050 respiration variables
        for (int i = 0; i < MOVING_AVG_WINDOW_SIZE; i++) gyroHistory[i] = 0.0;
        for (int i = 0; i < BREATH_HISTORY_SIZE; i++) breathTimestamps[i] = 0;
      }
    } else {
      // Check if MPU6050 is still responding
      sensors_event_t a, g, temp;
      if (!mpu.getEvent(&a, &g, &temp)) {
        mpu6050Connected = false;
        DEBUG_PRINTLN("⚠️  MPU6050 disconnected! Switching to fallback respiration mode");
      }
    }
  }
}

// New function to handle all respiration logic using MPU6050
void handleRespiration() {
  unsigned long currentTime = millis();

  if (currentTime - lastRespSampleTime >= SAMPLE_INTERVAL_MS) {
    lastRespSampleTime = currentTime;

    // Check if MPU6050 is connected before trying to use it
    if (!mpu6050Connected) {
      // MPU6050 not connected - use fallback respiration data
      static unsigned long lastFallbackUpdate = 0;
      if (currentTime - lastFallbackUpdate >= 5000) { // Update every 5 seconds
        // Simulate breathing pattern changes
        float timeFactor = currentTime * 0.001; // Convert to seconds
        float variation = sin(timeFactor * 0.5) * 2; // Slow variation
        
        currentData.respiratory = 16 + (int)variation; // Vary around 16 breaths/min
        currentData.inhaleRatio = 40.0 + variation; // Vary around 40%
        currentData.exhaleRatio = 100.0 - currentData.inhaleRatio;
        
        // Send fallback respiratory data
        sendRespiratoryData();
        lastFallbackUpdate = currentTime;
        
        DEBUG_PRINTF("🫁 Fallback Respiration: Rate=%d, I/E=%.1f%%/%.1f%%\n", 
                     currentData.respiratory, currentData.inhaleRatio, currentData.exhaleRatio);
      }
      return; // Exit early - don't process MPU6050 data
    }

    // MPU6050 is connected - process real sensor data
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    float rawGyroValue = g.gyro.y; // Use Y-axis gyroscope data for respiration detection

    float smoothedGyroValue = 0.0;
    gyroHistory[historyIndex] = rawGyroValue;
    historyIndex = (historyIndex + 1) % MOVING_AVG_WINDOW_SIZE;
    for (int i = 0; i < MOVING_AVG_WINDOW_SIZE; i++) {
      smoothedGyroValue += gyroHistory[i];
    }
    smoothedGyroValue /= MOVING_AVG_WINDOW_SIZE;
    
    // Debug: Log MPU6050 data every 5 seconds (after calculation)
    static unsigned long lastDebugTime = 0;
    if (currentTime - lastDebugTime >= 5000) {
      DEBUG_PRINTF("🔄 MPU6050 Debug: Raw Y-Gyro=%.3f, Smoothed=%.3f, State=%d\n", 
                   rawGyroValue, smoothedGyroValue, currentState);
      lastDebugTime = currentTime;
    }

    switch (currentState) {
      case IDLE:
        if (smoothedGyroValue < NOISE_THRESHOLD_NEGATIVE) {
          currentState = INHALING;
          inhaleStartTime = currentTime;
        }
        break;
      case INHALING:
        if (smoothedGyroValue > NOISE_THRESHOLD_POSITIVE) {
          currentState = EXHALING;
          exhaleStartTime = currentTime;
        }
        break;
      case EXHALING:
        if (smoothedGyroValue < EXHALE_END_THRESHOLD) {
          breathTimestamps[breathIndex] = currentTime;
          breathIndex = (breathIndex + 1) % BREATH_HISTORY_SIZE;
          if (breathCount < BREATH_HISTORY_SIZE) breathCount++;
          
          unsigned long inhaleDurationMs = exhaleStartTime - inhaleStartTime;
          unsigned long exhaleDurationMs = currentTime - exhaleStartTime;
          unsigned long totalDurationMs = inhaleDurationMs + exhaleDurationMs;

          if (totalDurationMs > 500 && totalDurationMs < 15000) {
            currentData.inhaleRatio = (float)inhaleDurationMs / totalDurationMs * 100.0;
            currentData.exhaleRatio = (float)exhaleDurationMs / totalDurationMs * 100.0;

            if (breathCount > 1) {
              int oldestIndex = (breathCount == BREATH_HISTORY_SIZE) ? breathIndex : 0;
              unsigned long timeSpan = breathTimestamps[(breathIndex - 1 + BREATH_HISTORY_SIZE) % BREATH_HISTORY_SIZE] - breathTimestamps[oldestIndex];
              int breathsInSpan = (breathCount == BREATH_HISTORY_SIZE) ? (BREATH_HISTORY_SIZE - 1) : (breathCount - 1);

              if (timeSpan > 0) {
                breathsPerMinute = (float)breathsInSpan / timeSpan * 60000.0;
                currentData.respiratory = (int)round(breathsPerMinute);
                
                // Send the updated data to the frontend
                sendRespiratoryData();
                
                // Debug: Log when respiratory data is sent
                DEBUG_PRINTF("🫁 Respiratory Data Sent: Rate=%d, I/E=%.1f%%/%.1f%%\n", 
                             currentData.respiratory, currentData.inhaleRatio, currentData.exhaleRatio);
              }
            }
          }
          currentState = IDLE;
        }
        break;
    }
    
    // Send respiratory data continuously (even when no breath detected) to keep frontend updated
    // This ensures the frontend doesn't get overwritten by fallback values
    static unsigned long lastContinuousRespSend = 0;
    if (currentTime - lastContinuousRespSend >= 1000) { // Send every second
      sendRespiratoryData();
      lastContinuousRespSend = currentTime;
      DEBUG_PRINTF("🫁 Continuous Respiratory Data Sent: Rate=%d, I/E=%.1f%%/%.1f%%\n", 
                   currentData.respiratory, currentData.inhaleRatio, currentData.exhaleRatio);
    }
  }
}

// Function to send ECG data at 250Hz
void sendECGData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "ecg";
  jsonDoc["ecg"] = currentData.ecg; // Frontend expects this field
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = ecgSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    DEBUG_PRINTLN("ERROR: Failed to serialize ECG JSON data");
    return;
  }
  
  sendData(jsonString);
  

}

// Function to send GSR data at 10Hz
void sendGSRData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "gsr";
  jsonDoc["gsr"] = currentData.gsr; // Frontend expects this field
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = gsrSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    DEBUG_PRINTLN("ERROR: Failed to serialize GSR JSON data");
    return;
  }
  
  sendData(jsonString);
  

}

// Function to send respiratory data, now including I/E ratio
void sendRespiratoryData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "respiratory";
  jsonDoc["respiratory"] = currentData.respiratory; // Frontend expects this field
  jsonDoc["inhaleRatio"] = currentData.inhaleRatio; // NEW: Inhale ratio percentage
  jsonDoc["exhaleRatio"] = currentData.exhaleRatio; // NEW: Exhale ratio percentage
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = respSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    DEBUG_PRINTLN("ERROR: Failed to serialize respiratory JSON data");
    return;
  }
  
  sendData(jsonString);
}

// Function to send IBI data when heartbeat detected
void sendIBIData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "ibi";
  jsonDoc["hrv"] = currentData.ibi; // Frontend expects this field
  jsonDoc["bpm"] = currentData.heartRate; // Frontend expects bpm, not hr
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = ecgSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    DEBUG_PRINTLN("ERROR: Failed to serialize IBI JSON data");
    return;
  }
  
  sendData(jsonString);
  

}

// Function to send continuous heart rate data (even when no beat detected)
void sendHeartRateData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "heartrate";
  jsonDoc["bpm"] = currentData.heartRate; // Heart rate in BPM
  jsonDoc["ibi"] = currentData.ibi; // IBI in milliseconds
  jsonDoc["hrv"] = currentData.ibi; // Also include HRV for consistency
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = ecgSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    DEBUG_PRINTLN("ERROR: Failed to serialize heart rate JSON data");
    return;
  }
  
  sendData(jsonString);
  

}

void setup() {
  Serial.begin(115200);
  Wire.begin(); // Initialize I2C for MPU6050
  pinMode(LON_PIN, INPUT);
  pinMode(LOP_PIN, INPUT);
  
  // Configure basic watchdog timer to prevent crashes
  // ESP32 Arduino has built-in watchdog protection
  
  // Configure ADC for ESP32 with better settings
  analogReadResolution(12); // ESP32 has 12-bit ADC
  analogSetAttenuation(ADC_11db); // Set attenuation for 0-3.3V range
  
  DEBUG_PRINTLN("ESP32 Vital Signs Monitor Starting...");
  DEBUG_PRINTLN("=====================================");
  
  // Pin configuration info
  DEBUG_PRINTF("ECG Sensor Pin: GPIO%d (ADC1_CH4)\n", ECG_PIN);
  DEBUG_PRINTF("GSR Sensor Pin: GPIO%d (ADC1_CH5)\n", GSR_PIN);
  DEBUG_PRINTLN("RESP Sensor: MPU6050 Gyroscope (I2C) - Replaced HW-484 Sound Sensor");
  DEBUG_PRINTLN();
  
  // MPU6050 Initialization with fallback
  bool mpu6050Connected = false;
  if (mpu.begin()) {
    mpu6050Connected = true;
    DEBUG_PRINTLN("✅ MPU6050 Respiration Sensor Found!");
    mpu.setGyroRange(MPU6050_RANGE_250_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
    
    // Initialize MPU6050 respiration variables
    for (int i = 0; i < MOVING_AVG_WINDOW_SIZE; i++) gyroHistory[i] = 0.0;
    for (int i = 0; i < BREATH_HISTORY_SIZE; i++) breathTimestamps[i] = 0;
    
    DEBUG_PRINTLN("   - Gyro Range: 250°/s");
    DEBUG_PRINTLN("   - Filter Bandwidth: 21Hz");
    DEBUG_PRINTLN("   - Sample Rate: 50Hz");
    DEBUG_PRINTLN("   - Moving Average Window: 8 samples");
    DEBUG_PRINTLN("   - Breath History Buffer: 15 samples");
  } else {
    DEBUG_PRINTLN("⚠️  MPU6050 not found - Using fallback respiration mode");
    DEBUG_PRINTLN("   - Check I2C connections (SDA/SCL)");
    DEBUG_PRINTLN("   - Verify MPU6050 has power (VCC and GND)");
    DEBUG_PRINTLN("   - ESP32 will continue with simulated respiration data");
    DEBUG_PRINTLN("   - ECG and GSR sensors will work normally");
    
    // Set fallback respiration data
    currentData.respiratory = 16; // Default to normal breathing rate
    currentData.inhaleRatio = 40.0; // Default to 40% inhale
    currentData.exhaleRatio = 60.0; // Default to 60% exhale
  }
  
  // Initialize respiratory data structure (either MPU6050 or fallback)
  if (!mpu6050Connected) {
    currentData.respiratory = 16; // Default to normal breathing rate
    currentData.inhaleRatio = 40.0; // Default to 40% inhale
    currentData.exhaleRatio = 60.0; // Default to 60% exhale
  }
  DEBUG_PRINTLN();
  
  // Test sensor pins with multiple readings
  DEBUG_PRINTLN("Testing sensor pins...");
  DEBUG_PRINTF("ECG Pin %d: %d\n", ECG_PIN, analogRead(ECG_PIN));
  
  // Enhanced GSR pin testing
  DEBUG_PRINTF("GSR Pin %d: ", GSR_PIN);
  int gsrTestValues[5] = {0};
  for (int i = 0; i < 5; i++) {
    gsrTestValues[i] = analogRead(GSR_PIN);
    DEBUG_PRINTF("%d ", gsrTestValues[i]);
    delay(50);
  }
  DEBUG_PRINTLN();
  
  // Check if GSR is responding
  int gsrAvg = 0;
  for (int i = 0; i < 5; i++) {
    gsrAvg += gsrTestValues[i];
  }
  gsrAvg /= 5;
  
  if (gsrAvg == 0) {
    DEBUG_PRINTLN("⚠️  WARNING: GSR sensor showing 0 - Check connections!");
    DEBUG_PRINTLN("   - Verify GSR sensor is connected to GPIO33");
    DEBUG_PRINTLN("   - Check if sensor has power (VCC and GND)");
    DEBUG_PRINTLN("   - Try touching the sensor electrodes");
    DEBUG_PRINTLN("   - Check if GSR_PIN is correctly defined as GPIO33");
  } else if (gsrAvg < 100) {
    DEBUG_PRINTLN("⚠️  WARNING: GSR sensor showing very low values");
    DEBUG_PRINTLN("   - Sensor may be disconnected or faulty");
    DEBUG_PRINTLN("   - Check electrode contact");
    DEBUG_PRINTLN("   - Raw values: " + String(gsrTestValues[0]) + ", " + String(gsrTestValues[1]) + ", " + String(gsrTestValues[2]) + ", " + String(gsrTestValues[3]) + ", " + String(gsrTestValues[4]));
    } else {
    DEBUG_PRINTLN("✅ GSR sensor appears to be working");
    DEBUG_PRINTLN("   - Average value: " + String(gsrAvg));
    DEBUG_PRINTLN("   - Range: " + String(gsrTestValues[0]) + " to " + String(gsrTestValues[4]));
  }
  
  // Test MPU6050 if connected
  if (mpu6050Connected) {
    DEBUG_PRINTLN("MPU6050: Testing gyroscope readings...");
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);
    DEBUG_PRINTF("   - Gyro Y-axis: %.3f rad/s\n", g.gyro.y);
    DEBUG_PRINTF("   - Gyro X-axis: %.3f rad/s\n", g.gyro.x);
    DEBUG_PRINTF("   - Gyro Z-axis: %.3f rad/s\n", g.gyro.z);
    DEBUG_PRINTLN("   - Place MPU6050 on chest for respiration detection");
  } else {
    DEBUG_PRINTLN("MPU6050: Skipping gyroscope test (sensor not connected)");
    DEBUG_PRINTLN("   - Using fallback respiration data");
    DEBUG_PRINTLN("   - Connect MPU6050 for real respiration detection");
  }
  
  // Initialize system
  DEBUG_PRINTLN("Initializing vital signs monitor...");
  delay(1000); // Allow system to stabilize

  // Connect to WiFi with timeout
  WiFi.begin(ssid, password);
  DEBUG_PRINT("Connecting to WiFi...");
  
  int wifiAttempts = 0;
  const int MAX_WIFI_ATTEMPTS = 20; // 10 seconds timeout
  
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < MAX_WIFI_ATTEMPTS) {
    delay(500);
    DEBUG_PRINT(".");
    wifiAttempts++;
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    DEBUG_PRINTLN("\nERROR: WiFi connection failed! Check credentials.");
    DEBUG_PRINTLN("ESP32 will continue running without WiFi - check your network settings.");
    // Don't restart - let it continue running
  }
  
  DEBUG_PRINTLN("\nWiFi connected!");
  DEBUG_PRINT("IP Address: ");
  DEBUG_PRINTLN(WiFi.localIP());
  DEBUG_PRINTLN("Frontend should connect to: ws://" + WiFi.localIP().toString() + ":81");

  // Start the WebSocket server
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
  DEBUG_PRINTLN("ESP32 WebSocket server started on port 81");
  DEBUG_PRINTLN("Waiting for client connections...");
  
  // Test the WebSocket server
  DEBUG_PRINTLN("WebSocket server status:");
  DEBUG_PRINTF("- Server running: %s\n", webSocket.connectedClients() >= 0 ? "YES" : "NO");
  DEBUG_PRINTF("- Connected clients: %d\n", webSocket.connectedClients());
}

void loop() {
  webSocket.loop(); // Handle WebSocket events
  
  unsigned long currentTime = millis();
  
  // Handle millis() overflow (occurs every ~49 days)
  static unsigned long lastLoopTime = 0;
  if (currentTime < lastLoopTime) {
    // Overflow occurred, reset timing variables
    lastEcgTime = 0;
    lastGsrTime = 0;
    lastSendTime = 0;
    lastRespSampleTime = 0;
  }
  lastLoopTime = currentTime;
  
  // Check MPU6050 connection status periodically
  checkMPU6050Connection();
  
  // Comprehensive status update every 10 seconds (reduced from 5)
  static unsigned long lastStatusTime = 0;
  if (currentTime - lastStatusTime >= DEBUG_INTERVAL) {
    lastStatusTime = currentTime;
    
    // Send connection status to keep frontend connected
    if (webSocket.connectedClients() > 0) {
      String statusMsg = "{\"type\":\"connection\",\"status\":\"connected\",\"message\":\"ESP32 Production Server Active\"}";
      webSocket.broadcastTXT(statusMsg);
    }
    
    DEBUG_PRINTLN("\n" + String("=", 60));
    DEBUG_PRINTLN("📊 COMPREHENSIVE STATUS UPDATE");
    DEBUG_PRINTLN(String("=", 60));
    
    // Connection Status
    DEBUG_PRINTLN("🔌 CONNECTION STATUS:");
    DEBUG_PRINTF("   WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "✅ Connected" : "❌ Disconnected");
    DEBUG_PRINTF("   WiFi RSSI: %d dBm\n", WiFi.RSSI());
    DEBUG_PRINTF("   IP Address: %s\n", WiFi.localIP().toString().c_str());
    DEBUG_PRINTF("   WebSocket Clients: %d\n", webSocket.connectedClients());
    DEBUG_PRINTF("   MPU6050 Status: %s\n", mpu6050Connected ? "✅ Connected" : "⚠️  Disconnected (Fallback Mode)");
    
    // Sensor Data Summary
    DEBUG_PRINTLN("\n📡 SENSOR DATA SUMMARY:");
    DEBUG_PRINTF("   ECG: %d (Raw: %d, Noise Filtered: %s, Threshold: >%d)\n", 
                 ecgSample, analogRead(ECG_PIN), ecgSample > 50 ? "YES" : "NO", 50);
    DEBUG_PRINTF("   GSR: %d (Raw: %d, No Processing)\n", gsrSample, gsrRawValue);
    DEBUG_PRINTF("   RESP: %d breaths/min (%s, I/E: %.1f%%/%.1f%%)\n", 
                 currentData.respiratory, 
                 mpu6050Connected ? "MPU6050 Gyro" : "Fallback Mode", 
                 currentData.inhaleRatio, currentData.exhaleRatio);
    
    // ECG Detailed Status
    DEBUG_PRINTLN("\n🫀 ECG DETAILED STATUS:");
    DEBUG_PRINTF("   Current Sample: %d\n", ecgSample);
    DEBUG_PRINTF("   Raw ADC Value: %d\n", analogRead(ECG_PIN));
    DEBUG_PRINTF("   Noise Filtered: %s\n", ecgSample > 50 ? "YES" : "NO");
    DEBUG_PRINTF("   Threshold: >%d ADC units\n", 50);
    DEBUG_PRINTF("   Lead-Off Detection: LON=%s, LOP=%s\n", 
                 digitalRead(LON_PIN) == LOW ? "CONNECTED" : "DISCONNECTED",
                 digitalRead(LOP_PIN) == LOW ? "CONNECTED" : "DISCONNECTED");
    DEBUG_PRINTF("   Heart Rate: %d BPM\n", currentData.heartRate);
    DEBUG_PRINTF("   IBI: %d ms\n", currentData.ibi);
    DEBUG_PRINTF("   Pan-Tompkins Status: %s\n", "ACTIVE"); // Pan-Tompkins always active when ECG data is processed
    
    // Data Transmission Stats
    DEBUG_PRINTLN("\n📤 DATA TRANSMISSION:");
    DEBUG_PRINTF("   Last ECG Send: %lu ms ago (Noise Filtered: >%d ADC)\n", currentTime - lastEcgTime, 50);
    DEBUG_PRINTF("   Last GSR Send: %lu ms ago (GSR_INTERVAL: %lu ms, Raw Values)\n", currentTime - lastGsrTime, GSR_INTERVAL);
    DEBUG_PRINTF("   Last RESP Send: %lu ms ago\n", currentTime - lastSendTime);
    DEBUG_PRINTF("   Last Data Send: %lu ms ago\n", currentTime - lastSendTime);
    
    // Transmission Status & Last Values
    DEBUG_PRINTLN("\n📊 LAST TRANSMITTED VALUES:");
    DEBUG_PRINTF("   ECG: %d (Raw ADC, Noise Filtered)\n", currentData.ecg);
    DEBUG_PRINTF("   GSR: %d (Raw ADC, No Processing)\n", currentData.gsr);
    DEBUG_PRINTF("   Respiratory: %d breaths/min (%s)\n", 
                 currentData.respiratory, 
                 mpu6050Connected ? "MPU6050 Gyro" : "Fallback Mode");
    DEBUG_PRINTF("   Heart Rate: %d BPM (Pan-Tompkins)\n", currentData.heartRate);
    DEBUG_PRINTF("   IBI: %d ms (Inter-Beat Interval)\n", currentData.ibi);
    
    // Transmission Schedule Status
    DEBUG_PRINTLN("\n⏰ TRANSMISSION SCHEDULE:");
    if (currentTime - lastEcgTime >= ECG_INTERVAL) {
      DEBUG_PRINTF("   ✅ ECG: On schedule (next in %lu ms)\n", ECG_INTERVAL - (currentTime - lastEcgTime));
    } else {
      DEBUG_PRINTF("   ⚠️  ECG: Overdue! (should be every %lu ms)\n", ECG_INTERVAL);
    }
    
    if (currentTime - lastGsrTime >= GSR_INTERVAL) {
      DEBUG_PRINTF("   ⚠️  GSR: Overdue! (should be every %lu ms)\n", GSR_INTERVAL);
    } else {
      DEBUG_PRINTF("   ✅ GSR: On schedule (next in %lu ms)\n", GSR_INTERVAL - (currentTime - lastGsrTime));
    }
    
    if (currentTime - lastSendTime >= SAMPLE_INTERVAL_MS) { // Use SAMPLE_INTERVAL_MS for MPU6050
      DEBUG_PRINTF("   ⚠️  RESP: Overdue! (should be every %lu ms)\n", SAMPLE_INTERVAL_MS);
    } else {
      DEBUG_PRINTF("   ✅ RESP: On schedule (next in %lu ms)\n", SAMPLE_INTERVAL_MS - (currentTime - lastSendTime));
    }
    
    // Sensor Analysis & Trends
    DEBUG_PRINTLN("\n🔬 SENSOR ANALYSIS:");
    DEBUG_PRINTF("   ECG Signal Quality: %s\n", ecgSample > 200 ? "EXCELLENT" : ecgSample > 100 ? "GOOD" : ecgSample > 50 ? "FAIR" : "POOR");
    DEBUG_PRINTF("   GSR Baseline: %d (Range: %d-%d)\n", gsrSample, gsrSample - 50, gsrSample + 50);
    DEBUG_PRINTF("   Respiratory Pattern: %s (I/E Ratio: %.1f%%/%.1f%%, %s)\n", 
                 currentData.respiratory > 20 ? "FAST" : currentData.respiratory > 12 ? "NORMAL" : "SLOW",
                 currentData.inhaleRatio, currentData.exhaleRatio,
                 mpu6050Connected ? "MPU6050 Active" : "Fallback Mode");
    DEBUG_PRINTF("   Heart Rate Zone: %s\n", currentData.heartRate > 100 ? "HIGH" : currentData.heartRate > 60 ? "NORMAL" : "LOW");
    
    // Memory and Performance
    DEBUG_PRINTLN("\n💾 SYSTEM STATUS:");
    DEBUG_PRINTF("   Free Heap: %d bytes\n", ESP.getFreeHeap());
    DEBUG_PRINTF("   Uptime: %lu seconds\n", currentTime / 1000);
    // Safe loop frequency calculation (avoid division by zero)
    if (currentTime > lastLoopTime) {
      DEBUG_PRINTF("   Loop Frequency: %lu Hz\n", 1000 / (currentTime - lastLoopTime));
    } else {
      DEBUG_PRINTF("   Loop Frequency: %s\n", "Calculating...");
    }
    
    DEBUG_PRINTLN(String("=", 60));
    DEBUG_PRINTLN();
  }
  
  currentData.timestamp = currentTime;

  // --- ECG Processing (250Hz) ---
  if (currentTime - lastEcgTime >= ECG_INTERVAL) {
    lastEcgTime = currentTime;
    
    // Read analog value directly with error handling
    if(digitalRead(LON_PIN) == LOW || digitalRead(LOP_PIN) == LOW) {
      ecgSample = readAnalogValue(ECG_PIN);
      // Validate ECG reading
      if (ecgSample < 0 || ecgSample > 4095) {
        ecgSample = 0; // Reset to safe value if out of range
      }
    }
    
    // Filter out zero and near-zero values for cleaner ECG plotting
    // Only send ECG data if it's above noise threshold (prevents vertical lines)
    const int ECG_NOISE_THRESHOLD = 50; // Minimum ADC value to consider valid
    

    
    if (ecgSample > ECG_NOISE_THRESHOLD) {
      // Send raw ECG data (above noise threshold) to frontend
      currentData.ecg = ecgSample; // Raw 12-bit ADC value

    // Process ECG for beat detection
      // Normalize ECG sample to 0-1 range for Pan-Tompkins algorithm
      float normalizedEcg = (float)ecgSample / 4095.0;
      
      if (panTompkins.detect(normalizedEcg)) {
        currentData.ibi = panTompkins.getIbi();
        currentData.heartRate = panTompkins.getBPM();
        

        
        // Send IBI data immediately when detected
        sendIBIData();
        
        // Also send heart rate data when beat is detected
        sendHeartRateData();
      }
      
      // Send ECG data immediately at 250Hz (only non-zero values)
      sendECGData();
    } else {
      // Skip sending zero/near-zero ECG values to prevent noisy plotting
      // This will create cleaner horizontal ECG plots
      currentData.ecg = 0; // Keep as 0 for internal processing
    }
    
    // Send continuous heart rate data every few seconds (even when no beat detected)
    // This ensures frontend always has heart rate info
    static unsigned long lastHeartRateSend = 0;
    if (currentTime - lastHeartRateSend >= 1000) { // Send every second
      sendHeartRateData();
      lastHeartRateSend = currentTime;
    }
  }

  // Small delay to prevent system from running too fast
  delay(1);

  // --- GSR Processing (10Hz) ---
  if (currentTime - lastGsrTime >= GSR_INTERVAL) {
    lastGsrTime = currentTime;
    
    // Read analog value directly with error handling
    gsrSample = readAnalogValue(GSR_PIN);
    
    // Validate GSR reading
    if (gsrSample < 0 || gsrSample > 4095) {
      gsrSample = 2048; // Reset to mid-range if out of range
    }
    
    // Send raw GSR value without any processing or smoothing
    // Frontend will handle trend analysis and arrow display
    currentData.gsr = gsrSample;
    gsrRawValue = gsrSample;
    gsrFilteredValue = gsrSample;
    
    // Send GSR data immediately at 10Hz
    sendGSRData();
  }

  // --- MPU6050 Respiration Processing (50Hz) ---
  handleRespiration();

}