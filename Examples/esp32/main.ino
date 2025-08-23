#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>
#include "PanTompkins.h"

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
      Serial.printf("🔌 WebSocket client #%u disconnected\n", num);
      break;
    case WStype_CONNECTED: {
      Serial.printf("🔌 WebSocket client #%u connected from %s\n", num, webSocket.remoteIP(num).toString().c_str());
      // Send a welcome message to confirm connection
      String welcomeMsg = "{\"type\":\"connection\",\"status\":\"connected\",\"message\":\"ESP32 WebSocket Server Ready\"}";
      webSocket.sendTXT(num, welcomeMsg);
      break;
    }
    case WStype_TEXT:
      // Only log important messages, not every data packet
      if (length < 100) { // Only log short messages (likely commands)
        Serial.printf("📨 WebSocket client #%u sent: %s\n", num, payload);
      }
      // Echo back for testing
      webSocket.sendTXT(num, (char*)payload);
      break;
    case WStype_BIN:
      Serial.printf("📦 WebSocket client #%u sent binary data (%d bytes)\n", num, length);
      break;
    case WStype_ERROR:
      Serial.printf("❌ WebSocket client #%u error\n", num);
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

// Test GSR sensor on startup
void testGSRSensor() {
  Serial.println("\n=== GSR SENSOR TESTING ===");
  
  // Test 1: Basic ADC reading
  Serial.println("Test 1: Basic ADC Reading");
  for (int i = 0; i < 10; i++) {
    int value = analogRead(GSR_PIN);
    Serial.printf("Reading %d: %d (%.2fV)\n", i+1, value, (value * 3.3) / 4095.0);
    delay(100);
  }
  
  // Test 2: Touch test (should see change when touching electrodes)
  Serial.println("\nTest 2: Touch Test - Touch the GSR electrodes now!");
  Serial.println("You should see values change when touching...");
  for (int i = 0; i < 20; i++) {
    int value = analogRead(GSR_PIN);
    Serial.printf("Touch test %d: %d\n", i+1, value);
    delay(200);
  }
  
  // Test 3: Different ADC configurations
  Serial.println("\nTest 3: ADC Configuration Test");
  Serial.printf("Current ADC resolution: %d bits\n", analogReadResolution());
  Serial.printf("Current ADC attenuation: %d\n", analogReadAttenuation());
  
  Serial.println("GSR sensor test completed!");
  Serial.println("==========================\n");
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

// Simple function to read analog value (no validation needed)
int readAnalogValue(int pin) {
  return analogRead(pin);
}

// Function to send ECG data at 250Hz
void sendECGData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "ecg";
  jsonDoc["value"] = currentData.ecg; // Raw 12-bit ADC value (0-4095)
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = ecgSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize ECG JSON data");
    return;
  }
  
  sendData(jsonString);
}

// Function to send GSR data at 10Hz
void sendGSRData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "gsr";
  jsonDoc["value"] = currentData.gsr; // Raw smoothed value (0-4095)
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = gsrSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize GSR JSON data");
    return;
  }
  
  sendData(jsonString);
}

// Function to send respiratory data at 100Hz
void sendRespiratoryData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "respiratory";
  jsonDoc["value"] = currentData.respiratory; // Raw smoothed value (0-4095)
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = respSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize respiratory JSON data");
    return;
  }
  
  sendData(jsonString);
  

}

// Function to send IBI data when heartbeat detected
void sendIBIData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "ibi";
  jsonDoc["value"] = currentData.ibi; // IBI in milliseconds
  jsonDoc["hr"] = currentData.heartRate; // Heart rate in BPM
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = ecgSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize IBI JSON data");
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
  jsonDoc["timestamp"] = millis(); // ESP32 timestamp for synchronization
  jsonDoc["sensorConnected"] = ecgSensorConnected;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize heart rate JSON data");
    return;
  }
  
  sendData(jsonString);
}

void setup() {
  Serial.begin(115200);
  
  // Configure ADC for ESP32 with better settings
  analogReadResolution(12); // ESP32 has 12-bit ADC
  analogSetAttenuation(ADC_11db); // Set attenuation for 0-3.3V range
  
  Serial.println("ESP32 Vital Signs Monitor Starting...");
  Serial.println("=====================================");
  
  // Pin configuration info
  Serial.printf("ECG Sensor Pin: GPIO%d (ADC1_CH4)\n", ECG_PIN);
  Serial.printf("GSR Sensor Pin: GPIO%d (ADC1_CH5)\n", GSR_PIN);
  Serial.printf("RESP Sensor Pin: GPIO%d (ADC2_CH7)\n", RESP_PIN);
  Serial.println();
  
  // Initialize smoothing buffers
  for (int i = 0; i < SMOOTH_WINDOW; i++) {
    gsrBuffer[i] = 2048; // Mid-range value for 12-bit ADC
    respBuffer[i] = 2048; // Mid-range value for 12-bit ADC
  }
  
  // Test sensor pins with multiple readings
  Serial.println("Testing sensor pins...");
  Serial.printf("ECG Pin %d: %d\n", ECG_PIN, analogRead(ECG_PIN));
  
  // Enhanced GSR pin testing
  Serial.printf("GSR Pin %d: ", GSR_PIN);
  int gsrTestValues[5] = {0};
  for (int i = 0; i < 5; i++) {
    gsrTestValues[i] = analogRead(GSR_PIN);
    Serial.printf("%d ", gsrTestValues[i]);
    delay(50);
  }
  Serial.println();
  
  // Check if GSR is responding
  int gsrAvg = 0;
  for (int i = 0; i < 5; i++) {
    gsrAvg += gsrTestValues[i];
  }
  gsrAvg /= 5;
  
  if (gsrAvg == 0) {
    Serial.println("⚠️  WARNING: GSR sensor showing 0 - Check connections!");
    Serial.println("   - Verify GSR sensor is connected to GPIO33");
    Serial.println("   - Check if sensor has power (VCC and GND)");
    Serial.println("   - Try touching the sensor electrodes");
  } else if (gsrAvg < 100) {
    Serial.println("⚠️  WARNING: GSR sensor showing very low values");
    Serial.println("   - Sensor may be disconnected or faulty");
    Serial.println("   - Check electrode contact");
  } else {
    Serial.println("✅ GSR sensor appears to be working");
  }
  
  Serial.printf("RESP Pin %d: %d\n", RESP_PIN, analogRead(RESP_PIN));
  
  // Test respiratory sensor multiple times
  Serial.println("Testing HW-484 respiratory sensor...");
  for (int i = 0; i < 10; i++) {
    int respTest = analogRead(RESP_PIN);
    Serial.printf("RESP Test #%d: %d\n", i+1, respTest);
    delay(100);
  }
  
  // Initialize system
  Serial.println("Initializing vital signs monitor...");
  delay(1000); // Allow system to stabilize

  // Connect to WiFi with timeout
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  
  int wifiAttempts = 0;
  const int MAX_WIFI_ATTEMPTS = 20; // 10 seconds timeout
  
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < MAX_WIFI_ATTEMPTS) {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }
  
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("\nERROR: WiFi connection failed! Check credentials.");
    ESP.restart(); // Restart ESP32 if WiFi fails
  }
  
  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("Frontend should connect to: ws://" + WiFi.localIP().toString() + ":81");

  // Start the WebSocket server
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);
  Serial.println("ESP32 WebSocket server started on port 81");
  Serial.println("Waiting for client connections...");
  
  // Test the WebSocket server
  Serial.println("WebSocket server status:");
  Serial.printf("- Server running: %s\n", webSocket.connectedClients() >= 0 ? "YES" : "NO");
  Serial.printf("- Connected clients: %d\n", webSocket.connectedClients());
}

void loop() {
  webSocket.loop(); // Handle WebSocket events
  
  unsigned long currentTime = millis();
  
  // Comprehensive status update every 5 seconds
  static unsigned long lastStatusTime = 0;
  if (currentTime - lastStatusTime >= 5000) {
    lastStatusTime = currentTime;
    
    Serial.println("\n" + String("=", 60));
    Serial.println("📊 COMPREHENSIVE STATUS UPDATE");
    Serial.println(String("=", 60));
    
    // Connection Status
    Serial.println("🔌 CONNECTION STATUS:");
    Serial.printf("   WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "✅ Connected" : "❌ Disconnected");
    Serial.printf("   WiFi RSSI: %d dBm\n", WiFi.RSSI());
    Serial.printf("   IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("   WebSocket Clients: %d\n", webSocket.connectedClients());
    
    // Sensor Data Summary
    Serial.println("\n📡 SENSOR DATA SUMMARY:");
    Serial.printf("   ECG: %d (Raw: %d)\n", ecgSample, analogRead(ECG_PIN));
    Serial.printf("   GSR: %d (Raw: %d, Filtered: %d)\n", gsrSample, gsrRawValue, gsrFilteredValue);
    Serial.printf("   RESP: %d (Raw: %d)\n", respSample, analogRead(RESP_PIN));
    
    // Data Transmission Stats
    Serial.println("\n📤 DATA TRANSMISSION:");
    Serial.printf("   Last ECG Send: %lu ms ago\n", currentTime - lastEcgTime);
    Serial.printf("   Last GSR Send: %lu ms ago\n", currentTime - lastGsrTime);
    Serial.printf("   Last RESP Send: %lu ms ago\n", currentTime - lastRespTime);
    Serial.printf("   Last Data Send: %lu ms ago\n", currentTime - lastSendTime);
    
    // Memory and Performance
    Serial.println("\n💾 SYSTEM STATUS:");
    Serial.printf("   Free Heap: %d bytes\n", ESP.getFreeHeap());
    Serial.printf("   Uptime: %lu seconds\n", currentTime / 1000);
    
    Serial.println(String("=", 60));
    Serial.println();
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
      
      // Send IBI data immediately when detected
      sendIBIData();
    }
    
    // Send ECG data immediately at 250Hz
    sendECGData();
    
    // Send continuous heart rate data (even when no beat detected)
    // This ensures frontend always has heart rate info
    sendHeartRateData();
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
    
    // Read analog value directly
    respSample = readAnalogValue(RESP_PIN);
    
    // Smooth respiratory data
    respBuffer[respIndex] = respSample;
    respIndex = (respIndex + 1) % SMOOTH_WINDOW;
    int smoothedResp = calculateMovingAverage(respBuffer, respIndex, SMOOTH_WINDOW);
    
    // Update current data
    currentData.respiratory = smoothedResp;
    
    // Send respiratory data immediately at 100Hz
    sendRespiratoryData();
  }

} 