#ifndef PAN_TOMPKINS_H
#define PAN_TOMPKINS_H

class PanTompkins {
public:
    // Constructor: Initializes all variables
    PanTompkins() {
        // Initialize all variables to their default states as seen in the original code
        for (int i = 0; i < M + 1; i++) ecg_buff[i] = 0;
        ecg_buff_WR_idx = 0;
        ecg_buff_RD_idx = 0;
        hp_sum = 0;

        for (int i = 0; i < N + 1; i++) hp_buff[i] = 0;
        hp_buff_WR_idx = 0;
        hp_buff_RD_idx = 0;
        lp_sum = 0;
        
        next_eval_pt = 0;
        number_iter = 0;
        treshold = 0; // Using original spelling
        triggered = false;
        trig_time = 0;
        win_max = -10000000.0;
        win_idx = 0;

        BPM = 0;
        ibi = 0;
        cprTimeRead_1 = 0;
        cprTimeRead_2 = 0;
    }

    // Renamed to detect() to match original source code
    bool detect(int new_ecg_pt) {
        // --- High pass filtering ---
        // Buffer overflow protection
        if (ecg_buff_WR_idx >= M + 1) {
            ecg_buff_WR_idx = 0; // Reset to prevent overflow
        }
        ecg_buff[ecg_buff_WR_idx++] = new_ecg_pt;
        ecg_buff_WR_idx %= (M + 1);

        if (number_iter < M) {
            hp_sum += ecg_buff[ecg_buff_RD_idx];
            hp_buff[hp_buff_WR_idx] = 0;
        } else {
            hp_sum += ecg_buff[ecg_buff_RD_idx];
            int tmp = ecg_buff_RD_idx - M;
            if (tmp < 0) tmp += M + 1;
            hp_sum -= ecg_buff[tmp];
            
            float y1 = HP_CONSTANT * hp_sum;
            int tmp_y2 = (ecg_buff_RD_idx - ((M + 1) / 2));
            if (tmp_y2 < 0) tmp_y2 += M + 1;
            float y2 = ecg_buff[tmp_y2];
            hp_buff[hp_buff_WR_idx] = y2 - y1;
        }
        ecg_buff_RD_idx = (ecg_buff_RD_idx + 1) % (M + 1);
        // Buffer overflow protection for hp_buff
        if (hp_buff_WR_idx >= N + 1) {
            hp_buff_WR_idx = 0;
        }
        hp_buff_WR_idx = (hp_buff_WR_idx + 1) % (N + 1);
        
        // --- Low pass filtering (Moving Window Integration) ---
        lp_sum += hp_buff[hp_buff_RD_idx] * hp_buff[hp_buff_RD_idx];
        if (number_iter < N) {
            next_eval_pt = 0;
        } else {
            int tmp = hp_buff_RD_idx - N;
            if (tmp < 0) tmp += (N + 1);
            lp_sum -= hp_buff[tmp] * hp_buff[tmp];
            next_eval_pt = lp_sum;
        }
        hp_buff_RD_idx = (hp_buff_RD_idx + 1) % (N + 1);

        // --- Adapative thresholding beat detection ---
        bool QRS_detected = false;

        if (number_iter < winSize) {
            if (next_eval_pt > treshold) {
                treshold = next_eval_pt;
            }
        }

        if (triggered) {
            trig_time++;
            if (trig_time >= 100) { // ~200ms hold-off @ 250Hz sampling
                triggered = false;
                trig_time = 0;
            }
        }

        if (next_eval_pt > win_max) {
            win_max = next_eval_pt;
        }

        if (next_eval_pt > treshold && !triggered) {
            // --- BEAT DETECTED ---
            cprTimeRead_2 = cprTimeRead_1;
            cprTimeRead_1 = millis();
            if (cprTimeRead_2 != 0) { // Avoid calculation on first beat
                this->ibi = cprTimeRead_1 - cprTimeRead_2;
                // Division by zero protection
                if (this->ibi > 0) {
                    this->BPM = 60000 / ibi;
                } else {
                    this->BPM = 0; // Invalid IBI
                }
            }
            triggered = true;
            QRS_detected = true;
        }
        
        if (++win_idx >= winSize) {
            float gamma = 0.4;
            float alpha = 0.1 + (((float)random(1001) / 10000.0)); // Range 0.1 to 0.2
            treshold = alpha * gamma * win_max + (1 - alpha) * treshold;
            win_idx = 0;
            win_max = -10000000.0;
        }
        
        number_iter++;
        return QRS_detected;
    }

    // Getter for Inter-Beat Interval in milliseconds
    int getIbi() {
        return this->ibi;
    }

    // Getter for Heart Rate in beats per minute, renamed to match original
    int getBPM() {
        return this->BPM;
    }

private:
    // --- Constants from original source ---
    static const int M = 5;
    static const int N = 30;
    static const int winSize = 100; // Adjusted for ~250Hz
    constexpr static const float HP_CONSTANT = (float)1 / (float)M;

    // --- All variable names now match the original source code ---
    float ecg_buff[M + 1];
    int ecg_buff_WR_idx;
    int ecg_buff_RD_idx;
    float hp_buff[N + 1];
    int hp_buff_WR_idx;
    int hp_buff_RD_idx;
    float hp_sum;
    float lp_sum;
    float next_eval_pt;

    unsigned int number_iter;
    float treshold; // Original typo retained for consistency
    bool triggered;
    int trig_time;
    float win_max;
    int win_idx;

    int BPM;
    int ibi;
    unsigned long cprTimeRead_1;
    unsigned long cprTimeRead_2;
};

#endif // PAN_TOMPKINS_H