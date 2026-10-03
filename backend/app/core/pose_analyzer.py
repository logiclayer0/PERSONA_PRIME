import mediapipe as mp
import numpy as np
import time


class PoseAnalyzer:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.mp_face = mp.solutions.face_mesh
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.face_mesh = self.mp_face.FaceMesh(
            static_image_mode=False,
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        )
        self.events = []
        self.slot_start = time.time()
        self.slot_data = {
            "good_frames": 0,
            "bad_frames": 0,
            "distracted_frames": 0,
            "poor_eye_contact": 0
        }

    def _angle(self, a, b, c):
        a, b, c = np.array(a), np.array(b), np.array(c)
        rad = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(rad * 180.0 / np.pi)
        return 360 - angle if angle > 180 else angle

    def analyze_frame(self, frame_rgb):
        pose_res = self.pose.process(frame_rgb)
        face_res = self.face_mesh.process(frame_rgb)
        ts = time.strftime("%H:%M:%S")

        if not pose_res.pose_landmarks:
            self.slot_data["distracted_frames"] += 1
            self.events.append({
                "timestamp": ts,
                "type": "distraction",
                "message": "No person detected"
            })
            return {
                "posture": "No Person",
                "focus": "Distracted",
                "eye_contact": "Unknown",
                "gesture": "Unknown",
                "events": self.events[-15:],
                "metrics": {"reasons": ["No Person"]}
            }

        lm = pose_res.pose_landmarks.landmark
        ls = [lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
              lm[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        rs = [lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
              lm[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        le = [lm[self.mp_pose.PoseLandmark.LEFT_EAR.value].x,
              lm[self.mp_pose.PoseLandmark.LEFT_EAR.value].y]
        nose = [lm[self.mp_pose.PoseLandmark.NOSE.value].x,
                lm[self.mp_pose.PoseLandmark.NOSE.value].y]

        neck_angle = self._angle(le, ls, rs)
        shoulder_width = abs(ls[0] - rs[0])
        mid_shoulder_y = (ls[1] + rs[1]) / 2
        vertical_drop = mid_shoulder_y - nose[1]

        reasons = []
        if vertical_drop < 0.12:
            reasons.append("Spine Slouch")
        if neck_angle < 50:
            reasons.append("Neck Tilt")
        if shoulder_width > 0.55:
            reasons.append("Leaning Too Close")

        eye_contact = "Good"
        if face_res.multi_face_landmarks:
            fl = face_res.multi_face_landmarks[0].landmark
            avg_iris_y = (fl[468].y + fl[473].y) / 2
            if abs(avg_iris_y - fl[1].y) > 0.08:
                eye_contact = "Poor"
                self.slot_data["poor_eye_contact"] += 1
                self.events.append({
                    "timestamp": ts,
                    "type": "eye_contact",
                    "message": "Looking away"
                })

        if reasons:
            posture = f"Bad ({', '.join(reasons)})"
            self.slot_data["bad_frames"] += 1
            self.events.append({
                "timestamp": ts,
                "type": "posture",
                "message": f"Bad posture: {', '.join(reasons)}"
            })
        else:
            posture = "Good"
            self.slot_data["good_frames"] += 1

        return {
            "posture": posture,
            "focus": "Focused" if eye_contact != "Poor" else "Distracted",
            "eye_contact": eye_contact,
            "gesture": "Unknown",
            "events": self.events[-15:],
            "metrics": {
                "vertical_drop": round(vertical_drop, 2),
                "neck_angle": round(neck_angle, 1),
                "reasons": reasons
            }
        }
