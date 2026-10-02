import mediapipe as mp
import math


class GestureAnalyzer:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.last_landmarks = None
        self.movement_history = []
        self.gesture_history = []
        self.nervous_signals = 0

    def _dist(self, p1, p2):
        return math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2)

    def _is_finger_extended(self, lm, tip, pip):
        return lm[tip].y < lm[pip].y

    def _classify_gesture(self, lm, hand_label):
        thumb_ext = self._is_finger_extended(lm, 4, 3)
        index_ext = self._is_finger_extended(lm, 8, 6)
        middle_ext = self._is_finger_extended(lm, 12, 10)
        ring_ext = self._is_finger_extended(lm, 16, 14)
        pinky_ext = self._is_finger_extended(lm, 20, 18)

        extended = [thumb_ext, index_ext, middle_ext, ring_ext, pinky_ext]
        count = sum(extended)

        if count == 0:
            return "fist"
        if count == 5:
            return "open_palm"
        if index_ext and not middle_ext and not ring_ext and not pinky_ext:
            return "pointing"
        if index_ext and middle_ext and not ring_ext and not pinky_ext:
            return "peace"
        if thumb_ext and not index_ext and not middle_ext and not ring_ext and not pinky_ext:
            return "thumbs_up"
        if count == 4 and not thumb_ext:
            return "four"
        if count == 3:
            return "three"
        return "other"

    def analyze(self, frame_rgb):
        result = self.hands.process(frame_rgb)

        if not result.multi_hand_landmarks:
            self.last_landmarks = None
            return {
                "hand_count": 0,
                "gesture": "idle",
                "gestures": [],
                "movement": 0.0,
                "nervous": False,
                "status": "idle"
            }

        gestures = []
        landmarks_list = []

        for i, hand in enumerate(result.multi_hand_landmarks):
            lm = hand.landmark
            landmarks_list.append(lm)

            label = "Right"
            if result.multi_handedness and i < len(result.multi_handedness):
                label = result.multi_handedness[i].classification[0].label

            gesture_type = self._classify_gesture(lm, label)
            gestures.append({
                "hand": label,
                "gesture": gesture_type
            })

        movement = 0.0
        if self.last_landmarks and landmarks_list:
            for i, lm in enumerate(landmarks_list):
                if i < len(self.last_landmarks):
                    prev_lm = self.last_landmarks[i]
                    wrist_curr = lm[0]
                    wrist_prev = prev_lm[0]
                    movement += self._dist(wrist_curr, wrist_prev)

        self.last_landmarks = landmarks_list

        self.movement_history.append(movement)
        if len(self.movement_history) > 30:
            self.movement_history.pop(0)

        avg_movement = sum(self.movement_history) / len(self.movement_history) if self.movement_history else 0

        nervous = False
        if avg_movement > 0.15 and len(landmarks_list) >= 1:
            nervous = True
            self.nervous_signals += 1

        active_gestures = [g["gesture"] for g in gestures if g["gesture"] not in ["fist", "idle", "other"]]
        primary = active_gestures[0] if active_gestures else (gestures[0]["gesture"] if gestures else "idle")

        self.gesture_history.append(primary)
        if len(self.gesture_history) > 60:
            self.gesture_history.pop(0)

        status = "active" if len(gestures) > 0 else "idle"

        return {
            "hand_count": len(gestures),
            "gesture": primary,
            "gestures": gestures,
            "movement": round(avg_movement, 3),
            "nervous": nervous,
            "status": status
        }

    def get_summary(self):
        if not self.gesture_history:
            return {
                "total_frames": 0,
                "dominant_gesture": "none",
                "gesture_variety": 0,
                "nervous_signals": 0,
                "activity_score": 0
            }

        from collections import Counter
        counts = Counter(self.gesture_history)
        dominant = counts.most_common(1)[0][0]
        variety = len(set(self.gesture_history) - {"idle", "fist"})

        active_frames = sum(1 for g in self.gesture_history if g not in ["idle", "fist"])
        activity_score = round((active_frames / len(self.gesture_history)) * 100, 1)

        return {
            "total_frames": len(self.gesture_history),
            "dominant_gesture": dominant,
            "gesture_variety": variety,
            "nervous_signals": self.nervous_signals,
            "activity_score": activity_score
        }

    def reset(self):
        self.last_landmarks = None
        self.movement_history = []
        self.gesture_history = []
        self.nervous_signals = 0