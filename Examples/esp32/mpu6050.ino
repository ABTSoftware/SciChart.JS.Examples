#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

// --- REFINED SETTINGS ---
const float NOISE_THRESHOLD_POSITIVE = 0.05;
const float NOISE_THRESHOLD_NEGATIVE = -0.05;

// --- FIX 1: Relaxed the exhale end threshold to be more sensitive ---
// This allows the gentle, tail-end of an exhale to be counted properly.
const float EXHALE_END_THRESHOLD = 0.02; 

#define GYRO_AXIS_TO_USE g.gyro.y 

// --- Algorithm Constants ---
const int SAMPLE_RATE_HZ = 50; 
const unsigned long SAMPLE_INTERVAL_MS = 1000 / SAMPLE_RATE_HZ;

#define MOVING_AVG_WINDOW_SIZE 8 
float gyroHistory[MOVING_AVG_WINDOW_SIZE];
int historyIndex = 0;

// --- FIX 2: Expanded the buffer for a more stable BPM calculation ---
#define BREATH_HISTORY_SIZE 15
unsigned long breathTimestamps[BREATH_HISTORY_SIZE];
int breathIndex = 0;
int breathCount = 0;

enum BreathState { IDLE, INHALING, EXHALING };
BreathState currentState = IDLE;

unsigned long inhaleStartTime = 0;
unsigned long exhaleStartTime = 0;
unsigned long lastSampleTime = 0;

float breathsPerMinute = 0.0;
float inhaleRatio = 0.0;
float exhaleRatio = 0.0;

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) { delay(10); }
  }
  Serial.println("MPU6050 Found! Final adjustments applied.");

  mpu.setGyroRange(MPU6050_RANGE_250_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  for (int i = 0; i < MOVING_AVG_WINDOW_SIZE; i++) gyroHistory[i] = 0.0;
  for (int i = 0; i < BREATH_HISTORY_SIZE; i++) breathTimestamps[i] = 0;
  
  Serial.println("Place sensor on chest. Starting measurement in 5 seconds...");
  delay(5000);
}

void loop() {
  unsigned long currentTime = millis();

  if (currentTime - lastSampleTime >= SAMPLE_INTERVAL_MS) {
    lastSampleTime = currentTime;

    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    float rawGyroValue = GYRO_AXIS_TO_USE;

    float smoothedGyroValue = 0.0;
    gyroHistory[historyIndex] = rawGyroValue;
    historyIndex = (historyIndex + 1) % MOVING_AVG_WINDOW_SIZE;
    for (int i = 0; i < MOVING_AVG_WINDOW_SIZE; i++) {
      smoothedGyroValue += gyroHistory[i];
    }
    smoothedGyroValue /= MOVING_AVG_WINDOW_SIZE;

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
        // Using the new, more relaxed threshold to end the cycle.
        if (smoothedGyroValue < EXHALE_END_THRESHOLD) { 
          // --- A FULL BREATH CYCLE IS COMPLETE ---
          
          breathTimestamps[breathIndex] = currentTime;
          breathIndex = (breathIndex + 1) % BREATH_HISTORY_SIZE;
          if (breathCount < BREATH_HISTORY_SIZE) breathCount++;
          
          unsigned long inhaleDurationMs = exhaleStartTime - inhaleStartTime;
          unsigned long exhaleDurationMs = currentTime - exhaleStartTime;
          unsigned long totalDurationMs = inhaleDurationMs + exhaleDurationMs;

          if (totalDurationMs > 500 && totalDurationMs < 15000) {
            inhaleRatio = (float)inhaleDurationMs / totalDurationMs * 100.0;
            exhaleRatio = (float)exhaleDurationMs / totalDurationMs * 100.0;

            if (breathCount > 1) {
              int oldestIndex = (breathCount == BREATH_HISTORY_SIZE) ? breathIndex : 0;
              unsigned long timeSpan = breathTimestamps[(breathIndex - 1 + BREATH_HISTORY_SIZE) % BREATH_HISTORY_SIZE] - breathTimestamps[oldestIndex];
              int breathsInSpan = (breathCount == BREATH_HISTORY_SIZE) ? (BREATH_HISTORY_SIZE - 1) : (breathCount - 1);

              if (timeSpan > 0) {
                breathsPerMinute = (float)breathsInSpan / timeSpan * 60000.0;
              }
            }
          }
          currentState = IDLE;
        }
        break;
    }

    Serial.printf("BPM: %.2f | I/E: %.1f/%.1f | State: %d | Smoothed: %.2f\n", 
                  breathsPerMinute, inhaleRatio, exhaleRatio, currentState, smoothedGyroValue);
  }
}