#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include "PanTompkins.h"

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
const int GSR_PIN = 33;  // GPIO33 - ADC1_CH5 - Better analog input, more stable  
const int RESP_PIN = 27; // GPIO27 - ADC2_CH7 - Alternative to problematic GPIO34

// Note: GPIO32 and GPIO33 are more reliable for analog sensors than GPIO36/39
// GPIO27 is also more stable than GPIO34 for analog input

// Sensor data variables
int ecgSample = 0;
int gsrSample = 0;
int respSample = 0;

// Debug values for status reporting
int gsrRawValue = 0; // Store raw ADC value for status report
int gsrFilteredValue = 0; // Store filtered value for status report

// Timing variables for proper sampling
unsigned long lastEcgTime = 0;
unsigned long lastGsrTime = 0;
unsigned long lastRespTime = 0;
unsigned long lastSendTime = 0; // Global send timing variable
const unsigned long ECG_INTERVAL = 4; // 4ms = ~250Hz for ECG
const unsigned long GSR_INTERVAL = 100; // 100ms = 10Hz for GSR
const unsigned long RESP_INTERVAL = 10; // 10ms = 100Hz for respiratory

// Data smoothing for GSR and Respiratory (reduced window size)
const int SMOOTH_WINDOW = 3; // Reduced from 5 to save memory
int gsrBuffer[SMOOTH_WINDOW] = {0};
int respBuffer[SMOOTH_WINDOW] = {0};
int gsrIndex = 0;
int respIndex = 0;

// HW-484 Respiratory Rate Detection Variables
const int RESP_BUFFER_SIZE = 50; // Buffer for breath pattern analysis
int respRawBuffer[RESP_BUFFER_SIZE] = {0};
int respBufferIndex = 0;
unsigned long lastBreathTime = 0;
int breathCount = 0;
int currentRespRate = 16; // Default respiratory rate
bool breathDetected = false;
const int BREATH_THRESHOLD = 100; // ADC threshold for breath detection
const int MIN_BREATH_INTERVAL = 2000; // Minimum 2 seconds between breaths

// Sensor connection status (always true since we don't check)
bool ecgSensorConnected = true;
bool gsrSensorConnected = true;
bool respSensorConnected = true;

// Unified data structure for all sensor readings (optimized)
struct SensorData {
  float ecg;
  float gsr;
  float respiratory;
  int heartRate;
  int ibi;
  unsigned long timestamp;
};

SensorData currentData;

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

// HW-484 Respiratory Rate Detection Function
// Based on sound level variations for breath in/out detection
int calculateRespiratoryRate(int rawValue, unsigned long timestamp) {
  // Store raw value in circular buffer for pattern analysis
  respRawBuffer[respBufferIndex] = rawValue;
  respBufferIndex = (respBufferIndex + 1) % RESP_BUFFER_SIZE;
  
  // Calculate baseline (average of recent values)
  int baseline = 0;
  for (int i = 0; i < RESP_BUFFER_SIZE; i++) {
    baseline += respRawBuffer[i];
  }
  baseline /= RESP_BUFFER_SIZE;
  
  // Detect breath based on significant deviation from baseline
  int deviation = abs(rawValue - baseline);
  
  if (deviation > BREATH_THRESHOLD && !breathDetected) {
    // Check if enough time has passed since last breath
    if (timestamp - lastBreathTime > MIN_BREATH_INTERVAL) {
      breathDetected = true;
      lastBreathTime = timestamp;
      breathCount++;
      
      // Calculate respiratory rate based on recent breath intervals
      if (breathCount > 1) {
        // Simple moving average of recent breath intervals
        static unsigned long breathIntervals[5] = {0};
        static int intervalIndex = 0;
        
        breathIntervals[intervalIndex] = timestamp - lastBreathTime;
        intervalIndex = (intervalIndex + 1) % 5;
        
        // Calculate average interval and convert to breaths/min
        unsigned long avgInterval = 0;
        int validIntervals = 0;
        for (int i = 0; i < 5; i++) {
          if (breathIntervals[i] > 0) {
            avgInterval += breathIntervals[i];
            validIntervals++;
          }
        }
        
        if (validIntervals > 0) {
          avgInterval /= validIntervals;
          currentRespRate = 60000 / avgInterval; // Convert ms to breaths/min
          
          // Ensure respiratory rate is within realistic range (8-30 breaths/min)
          if (currentRespRate < 8) currentRespRate = 8;
          if (currentRespRate > 30) currentRespRate = 30;
        }
      }
      
      DEBUG_PRINTF("🫁 Breath detected! Count: %d, Rate: %d breaths/min\n", breathCount, currentRespRate);
    }
  } else if (deviation <= BREATH_THRESHOLD) {
    breathDetected = false;
  }
  
  return currentRespRate;
}

// Simple function to read analog value (no validation needed)
int readAnalogValue(int pin) {
  return analogRead(pin);
}

// Function to send ECG data at 250Hz
void sendECGData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "ecg";
  jsonDoc["value"] = currentData.ecg; // Raw 12-bit ADC value (0-4095)
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
  jsonDoc["value"] = currentData.gsr; // Raw smoothed value (0-4095)
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

// Function to send respiratory data at 100Hz
void sendRespiratoryData() {
  StaticJsonDocument<256> jsonDoc;
  
  // currentData.respiratory now contains the calculated respiratory rate from HW-484
  // No need for conversion - it's already in breaths/min
  int respRate = currentData.respiratory;
  
  jsonDoc["type"] = "respiratory";
  jsonDoc["value"] = respRate; // Respiratory rate in breaths/min
  jsonDoc["respiratory"] = respRate; // Frontend expects this field
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
  jsonDoc["value"] = currentData.ibi; // IBI in milliseconds
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
  
  // Configure ADC for ESP32 with better settings
  analogReadResolution(12); // ESP32 has 12-bit ADC
  analogSetAttenuation(ADC_11db); // Set attenuation for 0-3.3V range
  
  DEBUG_PRINTLN("ESP32 Vital Signs Monitor Starting...");
  DEBUG_PRINTLN("=====================================");
  
  // Pin configuration info
  DEBUG_PRINTF("ECG Sensor Pin: GPIO%d (ADC1_CH4)\n", ECG_PIN);
  DEBUG_PRINTF("GSR Sensor Pin: GPIO%d (ADC1_CH5)\n", GSR_PIN);
  DEBUG_PRINTF("RESP Sensor Pin: GPIO%d (ADC2_CH7) - HW-484 Sound Sensor\n", RESP_PIN);
  DEBUG_PRINTLN();
  
  // Initialize smoothing buffers
  for (int i = 0; i < SMOOTH_WINDOW; i++) {
    gsrBuffer[i] = 2048; // Mid-range value for 12-bit ADC
    respBuffer[i] = 2048; // Mid-range value for 12-bit ADC
  }
  
  // Initialize HW-484 respiratory detection buffer
  for (int i = 0; i < RESP_BUFFER_SIZE; i++) {
    respRawBuffer[i] = 2048; // Mid-range value for 12-bit ADC
  }
  
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
  } else if (gsrAvg < 100) {
    DEBUG_PRINTLN("⚠️  WARNING: GSR sensor showing very low values");
    DEBUG_PRINTLN("   - Sensor may be disconnected or faulty");
    DEBUG_PRINTLN("   - Check electrode contact");
    } else {
    DEBUG_PRINTLN("✅ GSR sensor appears to be working");
  }
  
  DEBUG_PRINTF("RESP Pin %d: %d\n", RESP_PIN, analogRead(RESP_PIN));
  
  // Test HW-484 respiratory sensor multiple times
  DEBUG_PRINTLN("Testing HW-484 respiratory sensor (sound-based breath detection)...");
  for (int i = 0; i < 10; i++) {
    int respTest = analogRead(RESP_PIN);
    DEBUG_PRINTF("RESP Test #%d: %d\n", i+1, respTest);
    delay(100);
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
    ESP.restart(); // Restart ESP32 if WiFi fails
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
    
    // Sensor Data Summary
    DEBUG_PRINTLN("\n📡 SENSOR DATA SUMMARY:");
    DEBUG_PRINTF("   ECG: %d (Raw: %d)\n", ecgSample, analogRead(ECG_PIN));
    DEBUG_PRINTF("   GSR: %d (Raw: %d, Filtered: %d)\n", gsrSample, gsrRawValue, gsrFilteredValue);
    DEBUG_PRINTF("   RESP: %d (Raw: %d)\n", respSample, analogRead(RESP_PIN));
    
    // Data Transmission Stats
    DEBUG_PRINTLN("\n📤 DATA TRANSMISSION:");
    DEBUG_PRINTF("   Last ECG Send: %lu ms ago\n", currentTime - lastEcgTime);
    DEBUG_PRINTF("   Last GSR Send: %lu ms ago\n", currentTime - lastGsrTime);
    DEBUG_PRINTF("   Last RESP Send: %lu ms ago\n", currentTime - lastRespTime);
    DEBUG_PRINTF("   Last Data Send: %lu ms ago\n", currentTime - lastSendTime);
    
    // Memory and Performance
    DEBUG_PRINTLN("\n💾 SYSTEM STATUS:");
    DEBUG_PRINTF("   Free Heap: %d bytes\n", ESP.getFreeHeap());
    DEBUG_PRINTF("   Uptime: %lu seconds\n", currentTime / 1000);
    
    DEBUG_PRINTLN(String("=", 60));
    DEBUG_PRINTLN();
  }
  
  // Handle millis() overflow (occurs every ~49 days)
  static unsigned long lastLoopTime = 0;
  if (currentTime < lastLoopTime) {
    // Overflow occurred, reset timing variables
    lastEcgTime = 0;
    lastGsrTime = 0;
    lastRespTime = 0;
    lastSendTime = 0;
  }
  lastLoopTime = currentTime;
  
  currentData.timestamp = currentTime;

  // --- ECG Processing (250Hz) ---
  if (currentTime - lastEcgTime >= ECG_INTERVAL) {
    lastEcgTime = currentTime;
    
    // Read analog value directly
    ecgSample = readAnalogValue(ECG_PIN);
    
    // Send raw ECG data (0-4095) to frontend for proper normalization
    // Frontend will convert to millivolts based on sensor calibration
    currentData.ecg = ecgSample; // Raw 12-bit ADC value
    
    // Process ECG for beat detection
    // Normalize ECG sample to 0-1 range for Pan-Tompkins algorithm
    float normalizedEcg = (float)ecgSample / 4095.0;
    
    if (panTompkins.detect(normalizedEcg)) {
      currentData.ibi = panTompkins.getIbi();
      currentData.heartRate = panTompkins.getBPM();
      
      // Debug: Log heartbeat detection
      DEBUG_PRINTF("💓 Heartbeat detected! BPM: %d, IBI: %d ms\n", currentData.heartRate, currentData.ibi);
      
      // Send IBI data immediately when detected
      sendIBIData();
      
      // Also send heart rate data when beat is detected
      sendHeartRateData();
    }
    
    // Send ECG data immediately at 250Hz
    sendECGData();
    
    // Send continuous heart rate data every few seconds (even when no beat detected)
    // This ensures frontend always has heart rate info
    static unsigned long lastHeartRateSend = 0;
    if (currentTime - lastHeartRateSend >= 1000) { // Send every second
      sendHeartRateData();
      lastHeartRateSend = currentTime;
    }
  }

  // --- GSR Processing (10Hz) ---
  if (currentTime - lastGsrTime >= GSR_INTERVAL) {
    lastGsrTime = currentTime;
    
    // Read analog value directly
    gsrSample = readAnalogValue(GSR_PIN);
    
    // Smooth GSR data
    gsrBuffer[gsrIndex] = gsrSample;
    gsrIndex = (gsrIndex + 1) % SMOOTH_WINDOW;
    int smoothedGsr = calculateMovingAverage(gsrBuffer, gsrIndex, SMOOTH_WINDOW);
    
    // Update current data and debug values
    currentData.gsr = smoothedGsr;
    gsrRawValue = gsrSample;
    gsrFilteredValue = smoothedGsr;
    
    // Send GSR data immediately at 10Hz
    sendGSRData();
  }

  // --- Respiratory Processing (100Hz) ---
  if (currentTime - lastRespTime >= RESP_INTERVAL) {
    lastRespTime = currentTime;
    
    // Read analog value directly from HW-484 sound sensor
    respSample = readAnalogValue(RESP_PIN);
    
    // Use the new breath detection algorithm for HW-484
    int calculatedRespRate = calculateRespiratoryRate(respSample, currentTime);
    
    // Update current data with calculated respiratory rate
    currentData.respiratory = calculatedRespRate;
    
    // Send respiratory data immediately at 100Hz
    sendRespiratoryData();
  }

} 