/*
 * ESP32 WebSocket Test Server with Mock Data
 * ==========================================
 * 
 * PURPOSE: Test your main frontend UI components with realistic mock data
 * - Sends same JSON format as real sensors
 * - Tests ECG plot, heart rate cards, GSR display, respiratory metrics
 * - Verifies frontend data updates and real-time responsiveness
 * 
 * USAGE: 
 * 1. Flash this to ESP32
 * 2. Open your main frontend app
 * 3. Connect to ESP32 WebSocket (ws://[ESP32_IP]:81)
 * 4. Watch all UI components update with mock data
 * 
 * EXPECTED RESULTS:
 * - ECG plot shows smooth sine wave
 * - Heart rate card shows 60-100 BPM
 * - GSR card shows 1-20 values
 * - Respiratory card shows breathing pattern
 * - All cards update in real-time
 */

#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// --- WiFi Credentials ---
const char* ssid = "Airtel_301";
const char* password = "Wifi@2025";

// Create a WebSocketsServer on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Mock data generation variables
unsigned long mockStartTime = 0;
int mockHeartRate = 72;
int mockRespRate = 16;
int mockGSR = 8;
int mockECG = 2000;
int mockIBI = 833; // 60 BPM = 1000ms, 72 BPM ≈ 833ms

// Sweeping test variables for wide range testing
bool sweepingMode = true; // Enable sweeping for testing
unsigned long sweepStartTime = 0;
int sweepDirection = 1; // 1 = increasing, -1 = decreasing
const int SWEEP_DURATION = 30000; // 30 seconds per direction

// Data transmission timing
unsigned long lastEcgTime = 0;
unsigned long lastGsrTime = 0;
unsigned long lastRespTime = 0;
unsigned long lastHeartRateTime = 0;
unsigned long lastStatusTime = 0;

// Intervals for different data types
const unsigned long ECG_INTERVAL = 4;      // 4ms = 250Hz
const unsigned long GSR_INTERVAL = 100;    // 100ms = 10Hz
const unsigned long RESP_INTERVAL = 10;    // 10ms = 100Hz
const unsigned long HEART_RATE_INTERVAL = 1000; // 1 second
const unsigned long STATUS_INTERVAL = 5000;     // 5 seconds

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("🔌 WebSocket client #%u disconnected\n", num);
      break;
    case WStype_CONNECTED: {
      Serial.printf("🔌 WebSocket client #%u connected from %s\n", num, webSocket.remoteIP(num).toString().c_str());
      // Send a welcome message to confirm connection
      String welcomeMsg = "{\"type\":\"connection\",\"status\":\"connected\",\"message\":\"ESP32 WebSocket Test Server Ready\"}";
      webSocket.sendTXT(num, welcomeMsg);
      
      // Send immediate test data to verify frontend is working
      Serial.println("🚀 Sending immediate test data to verify frontend connection...");
      delay(100); // Small delay to ensure connection is stable
      
      // Send connection status message to set wsConnected = true
      String connectionMsg = "{\"type\":\"connection\",\"status\":\"connected\",\"message\":\"ESP32 Test Server Ready\"}";
      webSocket.sendTXT(num, connectionMsg);
      Serial.println("🔌 Sent connection status message");
      
      // Send one sample of each data type
      sendMockECGData();
      delay(50);
      sendMockGSRData();
      delay(50);
      sendMockRespiratoryData();
      delay(50);
      sendMockHeartRateData();
      
      Serial.println("✅ Initial test data sent to frontend");
      break;
    }
    case WStype_TEXT:
      // Log received messages
      Serial.printf("📨 WebSocket client #%u sent: %s\n", num, payload);
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

// Generate realistic mock ECG data (sine wave with noise + sweeping)
int generateMockECG() {
  // Create a realistic ECG-like waveform
  float time = (millis() - mockStartTime) / 1000.0; // Time in seconds
  float frequency = 1.2; // 72 BPM = 1.2 Hz
  
  // Base sine wave for heart rhythm
  float baseSignal = sin(2 * PI * frequency * time) * 800;
  
  // Add some noise for realism
  int noise = random(-50, 50);
  
  // Add sweeping component for testing wide ranges
  int sweepValue = 0;
  if (sweepingMode) {
    unsigned long sweepTime = millis() - sweepStartTime;
    if (sweepTime > SWEEP_DURATION) {
      sweepDirection *= -1; // Reverse direction
      sweepStartTime = millis();
    }
    
    // Sweep across full ECG range (800-3500)
    float sweepProgress = (float)(sweepTime % SWEEP_DURATION) / SWEEP_DURATION;
    if (sweepDirection == 1) {
      sweepValue = 800 + (int)(sweepProgress * 2700); // 800 to 3500
    } else {
      sweepValue = 3500 - (int)(sweepProgress * 2700); // 3500 to 800
    }
  }
  
  // Combine base signal with sweeping value
  int ecgValue = (int)(baseSignal + sweepValue + noise);
  if (ecgValue < 800) ecgValue = 800;
  if (ecgValue > 3500) ecgValue = 3500;
  
  // Store the current ECG value for status updates
  mockECG = ecgValue;
  
  return ecgValue;
}

// Generate realistic mock GSR data (with sweeping for testing)
int generateMockGSR() {
  // Add sweeping component for testing wide ranges
  int sweepValue = 0;
  if (sweepingMode) {
    unsigned long sweepTime = millis() - sweepStartTime;
    float sweepProgress = (float)(sweepTime % SWEEP_DURATION) / SWEEP_DURATION;
    
    if (sweepDirection == 1) {
      sweepValue = (int)(sweepProgress * 18); // 0 to 18
    } else {
      sweepValue = 18 - (int)(sweepProgress * 18); // 18 to 0
    }
  }
  
  // GSR should sweep from 2 to 20 µS for clear testing
  int baseGSR = 2 + sweepValue; // Start at 2, sweep to 20
  int variation = random(-1, 2); // Small variation
  int gsrValue = baseGSR + variation;
  
  // Ensure values stay within reasonable range (1-20)
  if (gsrValue < 1) gsrValue = 1;
  if (gsrValue > 20) gsrValue = 20;
  
  return gsrValue;
}

// Generate realistic mock respiratory data (with sweeping for testing)
int generateMockRespiratory() {
  // Add sweeping component for testing wide ranges
  int sweepValue = 0;
  if (sweepingMode) {
    unsigned long sweepTime = millis() - sweepStartTime;
    float sweepProgress = (float)(sweepTime % SWEEP_DURATION) / SWEEP_DURATION;
    
    if (sweepDirection == 1) {
      sweepValue = (int)(sweepProgress * 8); // 0 to 8 breaths/min
    } else {
      sweepValue = 8 - (int)(sweepProgress * 8); // 8 to 0 breaths/min
    }
  }
  
  // Base respiratory rate should be 12-20 breaths/min
  int baseRespRate = 12 + sweepValue; // Start at 12, sweep to 20
  
  // Add some realistic variation
  int variation = random(-1, 2);
  int respRate = baseRespRate + variation;
  
  // Ensure respiratory rate stays within reasonable range (12-20)
  if (respRate < 12) respRate = 12;
  if (respRate > 20) respRate = 20;
  
  return respRate; // Return breaths per minute, not raw ADC value
}

// Generate realistic mock heart rate and IBI (with sweeping for testing)
void generateMockHeartRate() {
  // Add sweeping component for testing wide ranges
  int sweepValue = 0;
  if (sweepingMode) {
    unsigned long sweepTime = millis() - sweepStartTime;
    float sweepProgress = (float)(sweepTime % SWEEP_DURATION) / SWEEP_DURATION;
    
    if (sweepDirection == 1) {
      sweepValue = (int)(sweepProgress * 40); // 0 to 40
    } else {
      sweepValue = 40 - (int)(sweepProgress * 40); // 40 to 0
    }
  }
  
  // Heart rate should sweep from 65 to 100 BPM for clear testing
  int variation = random(-2, 3);
  mockHeartRate = 65 + sweepValue + variation; // Start at 65, sweep to 100
  
  // Ensure heart rate stays within reasonable range (60-100)
  if (mockHeartRate < 60) mockHeartRate = 60;
  if (mockHeartRate > 100) mockHeartRate = 100;
  
  // Calculate IBI from heart rate (IBI = 60000 / BPM)
  mockIBI = 60000 / mockHeartRate;
  
  // Add some realistic variation to IBI
  int ibiVariation = random(-20, 21);
  mockIBI += ibiVariation;
  
  // Ensure IBI stays within reasonable range (400-1200ms)
  if (mockIBI < 400) mockIBI = 400;
  if (mockIBI > 1200) mockIBI = 1200;
}

// Send mock ECG data
void sendMockECGData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "ecg";
  jsonDoc["value"] = mockECG;
  jsonDoc["ecg"] = mockECG; // Frontend expects this field
  jsonDoc["timestamp"] = millis();
  jsonDoc["sensorConnected"] = true;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize ECG JSON data");
    return;
  }
  
  sendData(jsonString);
  
  // Debug: Log what we're sending
  Serial.printf("📊 Sent ECG: %d (value: %d, ecg: %d)\n", mockECG, mockECG, mockECG);
}

// Send mock GSR data
void sendMockGSRData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "gsr";
  jsonDoc["value"] = mockGSR;
  jsonDoc["gsr"] = mockGSR; // Frontend expects this field
  jsonDoc["timestamp"] = millis();
  jsonDoc["sensorConnected"] = true;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize GSR JSON data");
    return;
  }
  
  sendData(jsonString);
  
  // Debug: Log what we're sending
  Serial.printf("📊 Sent GSR: %d (value: %d, gsr: %d)\n", mockGSR, mockGSR, mockGSR);
}

// Send mock respiratory data
void sendMockRespiratoryData() {
  StaticJsonDocument<256> jsonDoc;
  
  int respValue = generateMockRespiratory(); // Generate once to avoid double generation
  
  jsonDoc["type"] = "respiratory";
  jsonDoc["value"] = respValue;
  jsonDoc["respiratory"] = respValue; // Frontend expects this field
  jsonDoc["timestamp"] = millis();
  jsonDoc["sensorConnected"] = true;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize respiratory JSON data");
    return;
  }
  
  sendData(jsonString);
  
  // Debug: Log what we're sending
  Serial.printf("📊 Sent Respiratory: %d (value: %d, respiratory: %d)\n", respValue, respValue, respValue);
}

// Send mock heart rate data
void sendMockHeartRateData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "heartrate";
  jsonDoc["bpm"] = mockHeartRate;
  jsonDoc["ibi"] = mockIBI;
  jsonDoc["hrv"] = mockIBI; // Also include HRV for consistency
  jsonDoc["timestamp"] = millis();
  jsonDoc["sensorConnected"] = true;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize heart rate JSON data");
    return;
  }
  
  sendData(jsonString);
  
  // Debug: Log what we're sending
  Serial.printf("📊 Sent Heart Rate: %d BPM, IBI: %d ms (bpm: %d, hrv: %d)\n", mockHeartRate, mockIBI, mockHeartRate, mockIBI);
}

// Send mock IBI data
void sendMockIBIData() {
  StaticJsonDocument<256> jsonDoc;
  
  jsonDoc["type"] = "ibi";
  jsonDoc["value"] = mockIBI;
  jsonDoc["hrv"] = mockIBI; // Frontend expects this field
  jsonDoc["bpm"] = mockHeartRate; // Frontend expects bpm, not hr
  jsonDoc["timestamp"] = millis();
  jsonDoc["sensorConnected"] = true;
  
  String jsonString;
  if (serializeJson(jsonDoc, jsonString) == 0) {
    Serial.println("ERROR: Failed to serialize IBI JSON data");
    return;
  }
  
  sendData(jsonString);
  
  // Debug: Log what we're sending
  Serial.printf("📊 Sent IBI: %d ms, HR: %d BPM (hrv: %d, bpm: %d)\n", mockIBI, mockHeartRate, mockIBI, mockHeartRate);
}

void setup() {
  Serial.begin(115200);
  
  Serial.println("ESP32 WebSocket Test Server Starting...");
  Serial.println("=====================================");
  Serial.println("This is a TEST SERVER with MOCK DATA");
  Serial.println("No real sensors connected - testing frontend communication only");
  Serial.println();
  
  // Initialize mock data timing
  mockStartTime = millis();
  sweepStartTime = millis(); // Initialize sweep timing
  
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
  Serial.println("ESP32 WebSocket test server started on port 81");
  Serial.println("Waiting for client connections...");
  Serial.println();
  
  // Display test data format
  Serial.println("📊 MOCK DATA FORMAT:");
  Serial.println("   ECG: 250Hz, values 800-3500 (realistic waveform)");
  Serial.println("   GSR: 10Hz, values 1-20 (stable with small variations)");
  Serial.println("   Respiratory: 100Hz, values 800-2500 (breathing pattern)");
  Serial.println("   Heart Rate: 1Hz, values 60-100 BPM");
  Serial.println("   IBI: Variable, calculated from heart rate");
  Serial.println();
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
    lastRespTime = 0;
    lastHeartRateTime = 0;
    lastStatusTime = 0;
    mockStartTime = millis();
  }
  lastLoopTime = currentTime;
  
  // --- Mock ECG Data (250Hz) ---
  if (currentTime - lastEcgTime >= ECG_INTERVAL) {
    lastEcgTime = currentTime;
    
    // Generate realistic ECG waveform
    mockECG = generateMockECG();
    
    // Send ECG data
    sendMockECGData();
  }

  // --- Mock GSR Data (10Hz) ---
  if (currentTime - lastGsrTime >= GSR_INTERVAL) {
    lastGsrTime = currentTime;
    
    // Generate realistic GSR data
    mockGSR = generateMockGSR();
    
    // Send GSR data
    sendMockGSRData();
  }

  // --- Mock Respiratory Data (100Hz) ---
  if (currentTime - lastRespTime >= RESP_INTERVAL) {
    lastRespTime = currentTime;
    
    // Generate realistic respiratory data
    int respValue = generateMockRespiratory();
    
    // Send respiratory data
    sendMockRespiratoryData();
  }

  // --- Mock Heart Rate Data (1Hz) ---
  if (currentTime - lastHeartRateTime >= HEART_RATE_INTERVAL) {
    lastHeartRateTime = currentTime;
    
    // Generate realistic heart rate and IBI
    generateMockHeartRate();
    
    // Send heart rate data
    sendMockHeartRateData();
    
    // Also send IBI data
    sendMockIBIData();
  }
  
  // --- Status Update (5 seconds) ---
  if (currentTime - lastStatusTime >= STATUS_INTERVAL) {
    lastStatusTime = currentTime;
    
    // Send connection status to keep frontend connected
    if (webSocket.connectedClients() > 0) {
      String statusMsg = "{\"type\":\"connection\",\"status\":\"connected\",\"message\":\"ESP32 Test Server Active\"}";
      webSocket.broadcastTXT(statusMsg);
    }
    
    Serial.println("\n" + String("=", 60));
    Serial.println("📊 MOCK DATA STATUS UPDATE");
    Serial.println(String("=", 60));
    
    // Connection Status
    Serial.println("🔌 CONNECTION STATUS:");
    Serial.printf("   WiFi Status: %s\n", WiFi.status() == WL_CONNECTED ? "✅ Connected" : "❌ Disconnected");
    Serial.printf("   WiFi RSSI: %d dBm\n", WiFi.RSSI());
    Serial.printf("   IP Address: %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("   WebSocket Clients: %d\n", webSocket.connectedClients());
    
    // Mock Data Summary
    Serial.println("\n📡 MOCK DATA SUMMARY:");
    Serial.printf("   ECG: %d (250Hz) - Sweeping: %s\n", mockECG, sweepingMode ? "ENABLED" : "DISABLED");
    Serial.printf("   GSR: %d (10Hz) - Sweeping: %s\n", mockGSR, sweepingMode ? "ENABLED" : "DISABLED");
    Serial.printf("   Heart Rate: %d BPM (1Hz) - Sweeping: %s\n", mockHeartRate, sweepingMode ? "ENABLED" : "DISABLED");
    Serial.printf("   IBI: %d ms\n", mockIBI);
    
    // Sweeping Status
    if (sweepingMode) {
      unsigned long sweepTime = millis() - sweepStartTime;
      float sweepProgress = (float)(sweepTime % SWEEP_DURATION) / SWEEP_DURATION;
      Serial.printf("   Sweep Direction: %s (%.1f%% complete)\n", 
                   sweepDirection == 1 ? "INCREASING" : "DECREASING", 
                   sweepProgress * 100);
    }
    
    // Data Transmission Stats
    Serial.println("\n📤 DATA TRANSMISSION:");
    Serial.printf("   Last ECG Send: %lu ms ago\n", currentTime - lastEcgTime);
    Serial.printf("   Last GSR Send: %lu ms ago\n", currentTime - lastGsrTime);
    Serial.printf("   Last RESP Send: %lu ms ago\n", currentTime - lastRespTime);
    Serial.printf("   Last Heart Rate Send: %lu ms ago\n", currentTime - lastHeartRateTime);
    
    // System Status
    Serial.println("\n💾 SYSTEM STATUS:");
    Serial.printf("   Free Heap: %d bytes\n", ESP.getFreeHeap());
    Serial.printf("   Uptime: %lu seconds\n", currentTime / 1000);
    Serial.printf("   Mock Data Running: %lu seconds\n", (currentTime - mockStartTime) / 1000);
    
    Serial.println(String("=", 60));
    Serial.println();
  }
}
