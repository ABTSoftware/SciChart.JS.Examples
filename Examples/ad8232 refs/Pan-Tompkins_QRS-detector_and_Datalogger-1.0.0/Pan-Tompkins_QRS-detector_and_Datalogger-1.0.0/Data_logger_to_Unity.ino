/* © Script written by Tim Möller
 * Humboldt Universität zu Berlin
 * Berlin School of Mind and Brain Berlin
 * 
 * This script records data from the AD8232 shield and plots the data.
 * Preprocessing and detect of the QRS compley is realized through the Pan-Tompkins algorithm
 * (Pan, J., & Tompkins, W. J. (1985). A real-time QRS detection algorithm. IEEE Trans. Biomed. 
 * Eng, 32(3), 230-236.).
 *  * This script also saves the Date, the Timestamp, a Timer that counts the passed time and a 
 *  counter for the number of recorded data-points.
 *  
 * Some of the code contains element from available, open access, existing scripts:
 * https://github.com/adafruit/Adafruit_SSD1306
 * https://github.com/blakeMilner/real_time_QRS_detection
 * https://github.com/dxinteractive/ResponsiveAnalogRead
 * SD card read/write (Arduino example sketches) created Nov 2010 by David A. Mellis modified 9 Apr 2012 by Tom Igoe
 * This example code is in the public domain.
 * SD Card test created  28 Mar 2011 by Limor Fried modified 9 Apr 2012 by Tom Igoe
 * This example code is in the public domain.
 * 
 * Last modified: 20.11.2019
 */
 int h = 0;
const String Filename = "Tim.txt"; // Give the Outputfile a name how it will be displayed on the SD Card
float Tweakfactor = 1.0; // That is the original heartbeat
//float Tweakfactor = 0.7; // Used for playing the tones 30% faster than the actual heartbeat
//float Tweakfactor = 1.3; // Used for playing the tones 30% slower than the actual heartbeat
 
const int heartPin = A1;
#include <ResponsiveAnalogRead.h>
#include <SPI.h>
#include <SD.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#define OLED_RESET 4 // not used / nicht genutzt bei diesem Display
#define M       5
#define N       30
#define winSize     400   // this value can be changed (e.g. to 250) which effects the sensitivity of the QRS-detection
#define HP_CONSTANT   ((float) 1 / (float) M)
#define MAX_BPM     100
#define RAND_RES 100000000

ResponsiveAnalogRead analog(heartPin, true);
//Adafruit_SSD1306 display(OLED_RESET);
//Adafruit_SSD1306 oled(128, 64);  // create our screen object setting resolution to 128x64


File myFile; 
int saving_interval = 0; //create a variable that counts samples. When an aspired number of samples is gathered, the Arduino will save the data to the .txt file to save computational power
int saving_treshold = 300; //if this treshold is reached, the arduino saves the gathered data to the output file
int cprTimeRead_1 = 0;
int cprTimeRead_2 = 0;
int timeCPR = 0;
bool screenChanged = true;   // initially we have a new screen,  by definition 
float interval;
unsigned long currentMillis = millis();
unsigned long previousMillis = 0;
float difference = 0;
unsigned long i = 0;
unsigned long Tonelength = 20;
const int ECG_PIN =   0;       // the number of the ECG pin (analog)
int x=0;
int j=0;
int lastj=0;
int lasty=0;
int LastTime=0;
int ThisTime;
bool BPMTiming=false;
bool BeatComplete=false;
int BPM=0;
int next_ecg_pt =0;
float CPRSUM;
int QRS = 0;
float bpm = 0;
int tmp = 0;

// pre-recorded ECG, for testing
int s_ecg_idx = 0;
const int S_ECG_SIZE = 226;
const float s_ecg[S_ECG_SIZE] = {1.5984,1.5992,1.5974,1.5996,1.5978,1.5985,1.5992,1.5973,1.5998,1.5976,1.5986,1.5992,1.5972,1.6,1.5973,1.5989,1.5991,1.5969,1.6006,1.5964,1.6,1.5979,1.5994,1.6617,1.7483,1.823,1.8942,1.9581,2.0167,2.0637,2.1034,2.1309,2.1481,2.1679,2.1739,2.1702,2.1543,2.1243,2.0889,2.037,1.982,1.9118,1.8305,1.7532,1.6585,1.6013,1.5979,1.5981,1.5996,1.5972,1.5992,1.599,1.5966,1.6015,1.5952,1.6008,1.5984,1.5953,1.606,1.5841,1.6796,1.9584,2.2559,2.5424,2.835,3.1262,3.4167,3.7061,4.0018,4.2846,4.5852,4.8688,5.1586,5.4686,5.4698,5.1579,4.8687,4.586,4.2833,4.0031,3.7055,3.4164,3.1274,2.8333,2.544,2.2554,1.9572,1.6836,1.5617,1.5143,1.4221,1.3538,1.2791,1.1951,1.1326,1.0407,0.99412,1.0445,1.1262,1.2017,1.2744,1.3545,1.4265,1.5044,1.5787,1.6006,1.5979,1.5988,1.5982,1.5989,1.5982,1.5986,1.5987,1.5983,1.5984,1.5992,1.5965,1.6082,1.6726,1.7553,1.826,1.903,1.9731,2.0407,2.1079,2.166,2.2251,2.2754,2.3215,2.3637,2.396,2.4268,2.4473,2.4627,2.4725,2.4721,2.4692,2.4557,2.4374,2.4131,2.3797,2.3441,2.2988,2.2506,2.1969,2.1365,2.0757,2.0068,1.9384,1.8652,1.7899,1.7157,1.6346,1.5962,1.5997,1.5979,1.5986,1.5989,1.5978,1.5995,1.5976,1.5991,1.5984,1.5981,1.5993,1.5976,1.5993,1.5982,1.5982,1.5993,1.5975,1.5994,1.5981,1.5983,1.5995,1.5967,1.6049,1.6248,1.647,1.664,1.6763,1.6851,1.6851,1.6816,1.6712,1.655,1.6376,1.613,1.599,1.5985,1.5982,1.5989,1.5982,1.5986,1.5987,1.598,1.5991,1.598,1.5987,1.5987,1.598,1.5992,1.5979,1.5988,1.5986,1.598,1.5992,1.5979,1.5988,1.5986,1.598,1.5992,1.5978,1.5989,1.5985,1.5981,1.5992,1.5978,1.599,1.5985,1.5981,1.5992,1.5977,1.599,1.5984,1.5981};

// timing variables
unsigned long previousMicros  = 0;        // will store last time LED was updated
unsigned long foundTimeMicros = 0;        // time at which last QRS was found
unsigned long old_foundTimeMicros = 0;        // time at which QRS before last was found
unsigned long currentMicros   = 0;        // current time

// interval at which to take samples and iterate algorithm (microseconds)
const long PERIOD = 1000000 / winSize;

#define BPM_BUFFER_SIZE 5
unsigned long bpm_buff[BPM_BUFFER_SIZE] = {0};
int bpm_buff_WR_idx = 0;
int bpm_buff_RD_idx = 0;

// set up variables using the SD utility library functions:
Sd2Card card;
SdVolume volume;
SdFile root;
const int chipSelect = 53;


void setup() {
pinMode(53, OUTPUT); // change this to 53 on a mega  // don't follow this!!
//digitalWrite(53, HIGH); // Add this line
// For Display setup
    // initialize with the I2C addr 0x3C / mit I2C-Adresse 0x3c initialisieren
//  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  
  Serial.begin(115200);
    #ifdef SERIAL_USB
    while (!Serial); // wait for Leonardo enumeration, others continue immediately
  #endif

    Serial.print("Initializing SD card...");

  if (!card.init(SPI_HALF_SPEED, chipSelect)) {
    Serial.println("initialization failed. Things to check:");
    Serial.println("* is a card inserted?");
    Serial.println("* is your wiring correct?");
    Serial.println("* did you change the chipSelect pin to match your shield or module?");
    while (1);
  } else {
    Serial.println("Wiring is correct and a card is present.");
  }
  
  if (!SD.begin(53)) {
    Serial.println("initialization failed!");
    while (1);
  }
  Serial.println("initialization done.");

myFile = SD.open(Filename, FILE_WRITE); //Name here the name for the data logger output
if (myFile)
      {
        Serial.println("File created successfully.");
        return 1;
      } else
      {
        Serial.println("Error while creating file.");
        return 0;
      }
      
      //define 5 columns named "Date", "Time", "Timer", "Counter", "Raw_data", and "QRS_detected"
    // Serial.println("LABEL,Date,Time,Timer,Counter,Raw_data,QRS_detected");
  myFile.println("LABEL,Date,Time,Timer,Counter,Raw_data,QRS_detected");
  myFile.close();
  myFile = SD.open(Filename, FILE_WRITE);
}

void loop() {    
 QRS = 1;
Serial.println(QRS);
delay(1000);
  currentMicros = micros();

  // iterate if it's time for a new data point (according to PERIOD)
  //if (currentMicros - previousMicros >= PERIOD) {
    // save the last time you blinked the LED
    previousMicros = currentMicros;
   
    boolean QRS_detected = false;
      int next_ecg_pt = analogRead(heartPin);

//myFile = SD.open(Filename, FILE_WRITE);
if(myFile){
//Serial.print("DATA,DATE,TIME,TIMER,");
//Serial.print(i++); Serial.print(",");
//Serial.print(next_ecg_pt); Serial.print(","); 
//Serial.println(QRS); 
myFile.print(i++);
myFile.print(",");
myFile.print(next_ecg_pt);
myFile.print(",");
myFile.println(QRS);
//Serial.print(h++);
//Serial.println("Writing to test.txt...");
saving_interval++;
// myFile.close();

if (saving_interval > saving_treshold){
 saving_interval = 0;
  myFile.flush();
  myFile.close();
myFile = SD.open(Filename, FILE_WRITE);
}





//delay(1); // Choose your delay having in mind your ReadTimeout in Unity3D
}
//else{
//      // if the file isn't open, pop up an error:
//      Serial.println("error opening datalog.txt");
//      delay(10);
      //myFile.close();
 //     myFile = SD.open(Filename, FILE_WRITE);
      

//}

      // give next data point to algorithm
      QRS_detected = detect(next_ecg_pt);

        if(QRS_detected == false) {
        QRS = 0;

      }
            
     // else if(QRS_detected == true){
    //    foundTimeMicros = micros();
   //     QRS = 1;
   //     Serial.println(QRS);
        //sendData("QRS");
       //Serial.println(h++);

        cprTimeRead_2 = cprTimeRead_1;
        cprTimeRead_1 = millis();
        CPRSUM = cprTimeRead_1-cprTimeRead_2;
        interval = CPRSUM*Tweakfactor;
        BPM = 60000/(cprTimeRead_1-cprTimeRead_2);
    //  }
/*
  // Set up the paramters for the display           
  display.clearDisplay();
  
  // set text color / Textfarbe setzen
  display.setTextColor(WHITE);
  // set text size / Textgroesse setzen
  display.setTextSize(1);
  // set text cursor position / Textstartposition einstellen
  display.setCursor(1,0);
  // show text / Text anzeigen
  display.println("BPM");
  display.setCursor(34,15);
  display.println(BPM);
  display.display();
*/


     if(difference > interval){  
     //tone(2, 1000, Tonelength); // Im Hauptteil wird nun mit dem Befehl "tone ( x , y )" ein Ton abgegeben.
     previousMillis = millis();   
  }
  
difference = millis() - previousMillis;


}



/* Portion pertaining to Pan-Tompkins QRS detection */


// circular buffer for input ecg signal
// we need to keep a history of M + 1 samples for HP filter
float ecg_buff[M + 1] = {0};
int ecg_buff_WR_idx = 0;
int ecg_buff_RD_idx = 0;

// circular buffer for input ecg signal
// we need to keep a history of N+1 samples for LP filter
float hp_buff[N + 1] = {0};
int hp_buff_WR_idx = 0;
int hp_buff_RD_idx = 0;

// LP filter outputs a single point for every input point
// This goes straight to adaptive filtering for eval
float next_eval_pt = 0;

// running sums for HP and LP filters, values shifted in FILO
float hp_sum = 0;
float lp_sum = 0;

// working variables for adaptive thresholding
float treshold = 0;
boolean triggered = false;
int trig_time = 0;
float win_max = 0;
int win_idx = 0;

// numebr of starting iterations, used determine when moving windows are filled
int number_iter = 0;

boolean detect(float new_ecg_pt) {
        // copy new point into circular buffer, increment index
  ecg_buff[ecg_buff_WR_idx++] = new_ecg_pt;  
  ecg_buff_WR_idx %= (M+1);
 
 
  /* High pass filtering */
  if(number_iter < M){
    // first fill buffer with enough points for HP filter
    hp_sum += ecg_buff[ecg_buff_RD_idx];
    hp_buff[hp_buff_WR_idx] = 0;
  }
  else{
    hp_sum += ecg_buff[ecg_buff_RD_idx];
    
    tmp = ecg_buff_RD_idx - M;
    if(tmp < 0) tmp += M + 1;
    
    hp_sum -= ecg_buff[tmp];
    
    float y1 = 0;
    float y2 = 0;
    
    tmp = (ecg_buff_RD_idx - ((M+1)/2));
    if(tmp < 0) tmp += M + 1;
    
    y2 = ecg_buff[tmp];
    
    y1 = HP_CONSTANT * hp_sum;
    
    hp_buff[hp_buff_WR_idx] = y2 - y1;
  }
  
  // done reading ECG buffer, increment position
  ecg_buff_RD_idx++;
  ecg_buff_RD_idx %= (M+1);
  
  // done writing to HP buffer, increment position
  hp_buff_WR_idx++;
  hp_buff_WR_idx %= (N+1);
  

  /* Low pass filtering */
  
  // shift in new sample from high pass filter
  lp_sum += hp_buff[hp_buff_RD_idx] * hp_buff[hp_buff_RD_idx];
  
  if(number_iter < N){
    // first fill buffer with enough points for LP filter
    next_eval_pt = 0;
    
  }
  else{
    // shift out oldest data point
    tmp = hp_buff_RD_idx - N;
    if(tmp < 0) tmp += (N+1);
    
    lp_sum -= hp_buff[tmp] * hp_buff[tmp];
    
    next_eval_pt = lp_sum;
  }
  
  // done reading HP buffer, increment position
  hp_buff_RD_idx++;
  hp_buff_RD_idx %= (N+1);
  

  /* Adapative thresholding beat detection */
  // set initial threshold        
  if(number_iter < winSize) {
    if(next_eval_pt > treshold) {
      treshold = next_eval_pt;
    }

                number_iter++;
  }
  
  // check if detection hold off period has passed
  if(triggered == true){
    trig_time++;
    
    if(trig_time >= 100){
      triggered = false;
      trig_time = 0;
    }
  }
  
  // find if we have a new max
  if(next_eval_pt > win_max) win_max = next_eval_pt;
  
  // find if we are above adaptive threshold
  if(next_eval_pt > treshold && !triggered) {
    triggered = true;
    return true;
  }
        // else we'll finish the function before returning FALSE,
        // to potentially change threshold
          
  // adjust adaptive threshold using max of signal found 
  // in previous window            
  if(win_idx++ >= winSize){
    // weighting factor for determining the contribution of
    // the current peak value to the threshold adjustment
    float gamma = 0.4;
    
    // forgetting factor - 
    // rate at which we forget old observations
                // choose a random value between 0.01 and 0.1 for this, 
    float alpha = 0.1 + ( ((float) random(0, RAND_RES) / (float) (RAND_RES)) * ((0.1 - 0.01)));
    
                // compute new threshold
    treshold = alpha * gamma * win_max + (1 - alpha) * treshold;
    
    // reset current window index
    win_idx = 0;
    win_max = -10000000;
  }
      
        // return false if we didn't detect a new QRS
  return false;
    
    
}

void sendData(String data){

 #ifdef SERIAL_USB
   Serial.println(QRS); // need a end-line because wrmlh.csharp use readLine method to receive data
   //serialPort.ReadTimeout = 1;
   //delay(1); // Choose your delay having in mind your ReadTimeout in Unity3D
#endif
}
