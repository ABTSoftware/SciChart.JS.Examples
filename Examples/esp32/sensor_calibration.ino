/*
 * ESP32 Sensor Calibration & Raw Data Logger
 * 
 * This file is designed to:
 * 1. Output raw ADC values from all sensors
 * 2. Analyze breathing patterns from HW-484 sound sensor
 * 3. Calibrate breath detection thresholds
 * 4. Understand sensor baseline values and ranges
 * 
 * Upload this file to your ESP32 and open Serial Monitor at 115200 baud
 * Copy-paste the output for analysis
 */

// --- Hardware Pin Configuration ---
const int ECG_PIN = 32;    // GPIO32 - AD8232 ECG sensor
const int GSR_PIN = 33;    // GPIO33 - GSR (Galvanic Skin Response) sensor  
const int RESP_PIN = 27;   // GPIO27 - HW-484 sound sensor for breathing

// --- Calibration Constants ---
const int CALIBRATION_DURATION = 30000; // 30 seconds for baseline calibration
const int BREATH_ANALYSIS_DURATION = 60000; // 60 seconds for breath pattern analysis
const int SAMPLE_INTERVAL = 10; // 10ms = 100Hz sampling rate

// --- Sensor Data Buffers ---
const int BUFFER_SIZE = 1000; // Store 1000 samples for analysis
int ecgBuffer[BUFFER_SIZE];
int gsrBuffer[BUFFER_SIZE];
int respBuffer[BUFFER_SIZE];
int bufferIndex = 0;

// --- Timing Variables ---
unsigned long startTime = 0;
unsigned long lastSampleTime = 0;
unsigned long calibrationStartTime = 0;
unsigned long breathAnalysisStartTime = 0;

// --- Calibration State ---
enum CalibrationState {
  BASELINE_CALIBRATION,
  BREATH_ANALYSIS,
  CONTINUOUS_MONITORING
};
CalibrationState currentState = BASELINE_CALIBRATION;

// --- Statistical Variables ---
int ecgMin = 4095, ecgMax = 0, ecgBaseline = 0;
int gsrMin = 4095, gsrMax = 0, gsrBaseline = 0;
int respMin = 4095, respMax = 0, respBaseline = 0;

// --- Breath Detection Variables ---
int breathInThreshold = 0;
int breathOutThreshold = 0;
int breathInCount = 0;
int breathOutCount = 0;
unsigned long lastBreathTime = 0;
const int MIN_BREATH_INTERVAL = 1000; // 1 second minimum between breaths

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Configure ADC pins
  analogReadResolution(12); // Set ADC resolution to 12 bits (0-4095)
  
  // Set attenuation for better voltage range
  analogSetAttenuation(ADC_ATTEN_DB_11); // 0-3.3V range
  
  Serial.println("\n" + String("=").repeat(60));
  Serial.println("🔬 ESP32 SENSOR CALIBRATION & RAW DATA LOGGER");
  Serial.println("=" + String("=").repeat(59));
  Serial.println();
  
  Serial.println("📋 CALIBRATION INSTRUCTIONS:");
  Serial.println("1. Ensure all sensors are properly connected");
  Serial.println("2. Keep subject still during baseline calibration (30s)");
  Serial.println("3. Perform breathing exercises during breath analysis (60s)");
  Serial.println("4. Monitor continuous data for real-time analysis");
  Serial.println();
  
  Serial.println("🔌 SENSOR CONNECTIONS:");
  Serial.println("   ECG (AD8232): GPIO32");
  Serial.println("   GSR: GPIO33");
  Serial.println("   RESP (HW-484): GPIO27");
  Serial.println();
  
  Serial.println("⏱️  CALIBRATION PHASES:");
  Serial.println("   Phase 1: Baseline Calibration (30s) - Stay still");
  Serial.println("   Phase 2: Breath Analysis (60s) - Breathe normally");
  Serial.println("   Phase 3: Continuous Monitoring - Real-time data");
  Serial.println();
  
  Serial.println("🚀 Starting calibration in 5 seconds...");
  Serial.println("   Please ensure subject is ready and sensors are connected");
  Serial.println();
  
  for (int i = 5; i > 0; i--) {
    Serial.printf("   %d...\n", i);
    delay(1000);
  }
  
  Serial.println("🎯 STARTING BASELINE CALIBRATION");
  Serial.println("   Please remain STILL for the next 30 seconds");
  Serial.println();
  
  startTime = millis();
  calibrationStartTime = millis();
  currentState = BASELINE_CALIBRATION;
  
  // Initialize buffers
  for (int i = 0; i < BUFFER_SIZE; i++) {
    ecgBuffer[i] = 0;
    gsrBuffer[i] = 0;
    respBuffer[i] = 0;
  }
}

void loop() {
  unsigned long currentTime = millis();
  
  // Sample sensors at regular intervals
  if (currentTime - lastSampleTime >= SAMPLE_INTERVAL) {
    lastSampleTime = currentTime;
    
    // Read raw sensor values
    int ecgRaw = analogRead(ECG_PIN);
    int gsrRaw = analogRead(GSR_PIN);
    int respRaw = analogRead(RESP_PIN);
    
    // Store in circular buffer
    ecgBuffer[bufferIndex] = ecgRaw;
    gsrBuffer[bufferIndex] = gsrRaw;
    respBuffer[bufferIndex] = respRaw;
    bufferIndex = (bufferIndex + 1) % BUFFER_SIZE;
    
    // Update min/max values
    updateMinMax(ecgRaw, gsrRaw, respRaw);
    
    // Process based on current state
    switch (currentState) {
      case BASELINE_CALIBRATION:
        handleBaselineCalibration(currentTime);
        break;
      case BREATH_ANALYSIS:
        handleBreathAnalysis(currentTime, respRaw);
        break;
      case CONTINUOUS_MONITORING:
        handleContinuousMonitoring(currentTime, ecgRaw, gsrRaw, respRaw);
        break;
    }
  }
}

void updateMinMax(int ecgRaw, int gsrRaw, int respRaw) {
  // ECG min/max
  if (ecgRaw < ecgMin) ecgMin = ecgRaw;
  if (ecgRaw > ecgMax) ecgMax = ecgRaw;
  
  // GSR min/max
  if (gsrRaw < gsrMin) gsrMin = gsrRaw;
  if (gsrRaw > gsrMax) gsrMax = gsrRaw;
  
  // Respiratory min/max
  if (respRaw < respMin) respMin = respRaw;
  if (respRaw > respMax) respMax = respRaw;
}

void handleBaselineCalibration(unsigned long currentTime) {
  unsigned long elapsed = currentTime - calibrationStartTime;
  unsigned long remaining = CALIBRATION_DURATION - elapsed;
  
  // Print progress every 5 seconds
  if (elapsed % 5000 < SAMPLE_INTERVAL) {
    Serial.printf("⏳ Baseline Calibration: %lu seconds remaining\n", remaining / 1000);
  }
  
  // Check if baseline calibration is complete
  if (elapsed >= CALIBRATION_DURATION) {
    completeBaselineCalibration();
  }
}

void completeBaselineCalibration() {
  Serial.println("\n" + String("=").repeat(60));
  Serial.println("✅ BASELINE CALIBRATION COMPLETE");
  Serial.println("=" + String("=").repeat(59));
  
  // Calculate baselines from collected data
  calculateBaselines();
  
  // Print baseline results
  Serial.println("\n📊 BASELINE CALIBRATION RESULTS:");
  Serial.println("   ECG Sensor (AD8232):");
  Serial.printf("     Range: %d - %d (Span: %d)\n", ecgMin, ecgMax, ecgMax - ecgMin);
  Serial.printf("     Baseline: %d\n", ecgBaseline);
  Serial.printf("     Noise Level: ±%d\n", (ecgMax - ecgMin) / 2);
  
  Serial.println("\n   GSR Sensor:");
  Serial.printf("     Range: %d - %d (Span: %d)\n", gsrMin, gsrMax, gsrMax - gsrMin);
  Serial.printf("     Baseline: %d\n", gsrBaseline);
  Serial.printf("     Noise Level: ±%d\n", (gsrMax - gsrMin) / 2);
  
  Serial.println("\n   Respiratory Sensor (HW-484):");
  Serial.printf("     Range: %d - %d (Span: %d)\n", respMin, respMax, respMax - respMin);
  Serial.printf("     Baseline: %d\n", respBaseline);
  Serial.printf("     Noise Level: ±%d\n", (respMax - respMin) / 2);
  
  Serial.println("\n🎯 RECOMMENDED THRESHOLDS:");
  Serial.printf("   Breath Detection Threshold: %d\n", (respMax - respMin) / 4);
  Serial.printf("   GSR Change Threshold: %d\n", (gsrMax - gsrMin) / 8);
  Serial.printf("   ECG Peak Threshold: %d\n", (ecgMax - ecgMin) / 3);
  
  Serial.println("\n🫁 Starting Breath Analysis Phase");
  Serial.println("   Please breathe NORMALLY for the next 60 seconds");
  Serial.println("   Focus on steady, regular breathing patterns");
  Serial.println();
  
  // Reset for breath analysis
  breathAnalysisStartTime = millis();
  currentState = BREATH_ANALYSIS;
  
  // Reset breath counters
  breathInCount = 0;
  breathOutCount = 0;
  lastBreathTime = 0;
}

void calculateBaselines() {
  // Calculate median values as baselines (more robust than mean)
  ecgBaseline = calculateMedian(ecgBuffer, BUFFER_SIZE);
  gsrBaseline = calculateMedian(gsrBuffer, BUFFER_SIZE);
  respBaseline = calculateMedian(respBuffer, BUFFER_SIZE);
}

int calculateMedian(int* buffer, int size) {
  // Create a copy for sorting
  int tempBuffer[size];
  for (int i = 0; i < size; i++) {
    tempBuffer[i] = buffer[i];
  }
  
  // Simple bubble sort (for small arrays)
  for (int i = 0; i < size - 1; i++) {
    for (int j = 0; j < size - i - 1; j++) {
      if (tempBuffer[j] > tempBuffer[j + 1]) {
        int temp = tempBuffer[j];
        tempBuffer[j] = tempBuffer[j + 1];
        tempBuffer[j + 1] = temp;
      }
    }
  }
  
  // Return median
  return tempBuffer[size / 2];
}

void handleBreathAnalysis(unsigned long currentTime, int respRaw) {
  unsigned long elapsed = currentTime - breathAnalysisStartTime;
  unsigned long remaining = BREATH_ANALYSIS_DURATION - elapsed;
  
  // Print progress every 10 seconds
  if (elapsed % 10000 < SAMPLE_INTERVAL) {
    Serial.printf("⏳ Breath Analysis: %lu seconds remaining\n", remaining / 1000);
  }
  
  // Analyze breathing pattern
  analyzeBreathingPattern(respRaw, currentTime);
  
  // Check if breath analysis is complete
  if (elapsed >= BREATH_ANALYSIS_DURATION) {
    completeBreathAnalysis();
  }
}

void analyzeBreathingPattern(int respRaw, unsigned long currentTime) {
  // Calculate deviation from baseline
  int deviation = respRaw - respBaseline;
  int absDeviation = abs(deviation);
  
  // Dynamic threshold based on baseline noise
  int breathThreshold = (respMax - respMin) / 4;
  
  // Detect breath in/out based on deviation direction and magnitude
  if (absDeviation > breathThreshold && (currentTime - lastBreathTime) > MIN_BREATH_INTERVAL) {
    if (deviation > 0) {
      // Positive deviation = breath in (sound level increases)
      breathInCount++;
      Serial.printf("🫁 BREATH IN detected! Raw: %d, Deviation: +%d\n", respRaw, deviation);
    } else {
      // Negative deviation = breath out (sound level decreases)
      breathOutCount++;
      Serial.printf("🫁 BREATH OUT detected! Raw: %d, Deviation: %d\n", respRaw, deviation);
    }
    lastBreathTime = currentTime;
  }
}

void completeBreathAnalysis() {
  Serial.println("\n" + String("=").repeat(60));
  Serial.println("✅ BREATH ANALYSIS COMPLETE");
  Serial.println("=" + String("=").repeat(59));
  
  Serial.println("\n📊 BREATHING PATTERN ANALYSIS:");
  Serial.printf("   Total Breaths Detected: %d\n", breathInCount + breathOutCount);
  Serial.printf("   Breaths In: %d\n", breathInCount);
  Serial.printf("   Breaths Out: %d\n", breathOutCount);
  
  if (breathInCount > 0 && breathOutCount > 0) {
    float avgBreathInterval = (float)BREATH_ANALYSIS_DURATION / (breathInCount + breathOutCount);
    float respiratoryRate = 60000.0 / avgBreathInterval; // breaths per minute
    
    Serial.printf("   Average Breath Interval: %.1f ms\n", avgBreathInterval);
    Serial.printf("   Calculated Respiratory Rate: %.1f breaths/min\n", respiratoryRate);
    
    Serial.println("\n🎯 BREATH DETECTION CALIBRATION:");
    Serial.printf("   Current Threshold: %d\n", (respMax - respMin) / 4);
    Serial.printf("   Recommended Range: %d - %d\n", (respMax - respMin) / 6, (respMax - respMin) / 3);
    
    if (respiratoryRate < 8 || respiratoryRate > 30) {
      Serial.println("   ⚠️  Respiratory rate outside normal range (8-30 breaths/min)");
      Serial.println("   Consider adjusting sensor placement or sensitivity");
    }
  }
  
  Serial.println("\n🔄 Starting Continuous Monitoring Mode");
  Serial.println("   Real-time sensor data will now be displayed");
  Serial.println("   Press Ctrl+C to stop monitoring");
  Serial.println();
  
  currentState = CONTINUOUS_MONITORING;
}

void handleContinuousMonitoring(unsigned long currentTime, int ecgRaw, int gsrRaw, int respRaw) {
  // Calculate deviations from baseline
  int ecgDeviation = ecgRaw - ecgBaseline;
  int gsrDeviation = gsrRaw - gsrBaseline;
  int respDeviation = respRaw - respBaseline;
  
  // Print formatted data every 100ms (10Hz display rate)
  static unsigned long lastDisplayTime = 0;
  if (currentTime - lastDisplayTime >= 100) {
    lastDisplayTime = currentTime;
    
    // Format: Timestamp, ECG_Raw, ECG_Dev, GSR_Raw, GSR_Dev, RESP_Raw, RESP_Dev
    Serial.printf("DATA: %lu, %d, %+d, %d, %+d, %d, %+d\n", 
                  currentTime, 
                  ecgRaw, ecgDeviation,
                  gsrRaw, gsrDeviation,
                  respRaw, respDeviation);
  }
  
  // Real-time breath detection
  int breathThreshold = (respMax - respMin) / 4;
  if (abs(respDeviation) > breathThreshold && (currentTime - lastBreathTime) > MIN_BREATH_INTERVAL) {
    if (respDeviation > 0) {
      Serial.printf("🫁 LIVE: Breath IN - Raw: %d, Dev: +%d\n", respRaw, respDeviation);
    } else {
      Serial.printf("🫁 LIVE: Breath OUT - Raw: %d, Dev: %d\n", respRaw, respDeviation);
    }
    lastBreathTime = currentTime;
  }
}

// Utility function to print sensor status
void printSensorStatus() {
  Serial.println("\n📡 SENSOR STATUS:");
  Serial.printf("   ECG (GPIO32): %d\n", analogRead(ECG_PIN));
  Serial.printf("   GSR (GPIO33): %d\n", analogRead(GSR_PIN));
  Serial.printf("   RESP (GPIO27): %d\n", analogRead(RESP_PIN));
  Serial.println();
}
