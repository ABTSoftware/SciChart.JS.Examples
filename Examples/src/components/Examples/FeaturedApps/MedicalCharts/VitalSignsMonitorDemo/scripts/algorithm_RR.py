import os
import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv("FIREBASE_CREDENTIALS")
db_url = os.getenv("FIREBASE_DB_URL")

if not firebase_admin._apps and cred_path and db_url:  # only initialize once if credentials are available
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred, {
            "databaseURL": db_url
        })
    except Exception as e:
        print(f"Warning: Firebase initialization failed: {e}")
        print("Continuing without Firebase integration...")

def get_latest_respiratory_rate():
    if not firebase_admin._apps:
        return None
    
    try:
        ref = db.reference("processed_sensor_logs")
        logs = ref.get()

        if not logs:
            return None

        # Get the most recent log by timestamp
        latest_log = max(logs.values(), key=lambda x: x.get("timestamp", 0))
        return latest_log.get("respiratoryRate")
    except Exception as e:
        print(f"Warning: Failed to fetch respiratory rate from Firebase: {e}")
        return None

print("Latest RR:", get_latest_respiratory_rate())


class RRAdaptation:
    def __init__(self, initial_rr=20):
        self.initial_rr = initial_rr
        self.current_rr = initial_rr
        self.stage = 1
        self.target_stage1 = 0.4 * (self.initial_rr - 10) + 10
        self.target_stage2 = 0.4 * (self.target_stage1 - 2) + 8
        self.done = False

    def update(self, emotion=None):
        """
        Call this repeatedly to update the RR value based on the flowchart.
        Optional: pass emotion='stressed' to handle setbacks.
        """
        if self.done:
            return self.current_rr

        # Stage 1
        if self.stage == 1:
            step = -1
            if emotion == 'stressed':
                step = 1  # setback
            self.current_rr += step

            if self.current_rr <= self.target_stage1:
                self.stage = 2

        # Stage 2
        elif self.stage == 2:
            step = -0.5
            if emotion == 'stressed':
                step = 0.5  # setback
            self.current_rr += step

            if self.current_rr <= self.target_stage2:
                self.done = True  # RR reached resonance rate

        return self.current_rr
    def reset(self):
        self.current_rr = self.initial_rr
        self.stage = 1

        


    def is_done(self):
        return self.done


# == This the algorithm for making the respiration rate ==

# def get_resonance_rr(initial_rr=20, emotion=None):
#     rr = initial_rr

#     # Stage 1 target
#     stage1_target = 0.4 * (rr - 10) + 10

#     # Stage 1 loop: decrease by 1
#     while rr > stage1_target:
#         rr -= 1
#         if emotion == "stressed":
#             rr += 1  # Go back if stressed
#         if abs(rr - stage1_target) < 0.01:
#             break

#     # Stage 2 target
#     stage2_target = 0.4 * (0.4 * (initial_rr - 10) + 10) + 8

#     # Stage 2 loop: decrease by 0.5
#     while rr > stage2_target:
#         rr -= 0.5
#         if emotion == "stressed":
#             rr += 0.5  # Go back if stressed
#         if abs(rr - stage2_target) < 0.01:
#             break

#     return round(rr, 1)

# rr_adaptation.py