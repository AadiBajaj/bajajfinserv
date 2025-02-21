import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)
mp_drawing = mp.solutions.drawing_utils

# Function to calculate angles
def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba, bc = a - b, c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

# Bicep Curl Tracking
curl_count = 0
stage = None

def track_bicep_curls(frame):
    global curl_count, stage

    frame = cv2.resize(frame, (640, 480))
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    if results.pose_landmarks:
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        landmarks = results.pose_landmarks.landmark

        # Extract keypoints
        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
        right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

        # Calculate angles
        left_curl_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
        right_curl_angle = calculate_angle(right_shoulder, right_elbow, right_wrist)
        avg_curl_angle = (left_curl_angle + right_curl_angle) / 2

        # Check movement stage
        left_wrist_below_elbow = left_wrist[1] > left_elbow[1]
        right_wrist_below_elbow = right_wrist[1] > right_elbow[1]
        arms_fully_extended = avg_curl_angle > 165 and left_wrist_below_elbow and right_wrist_below_elbow
        arms_fully_contracted = avg_curl_angle < 45

        if arms_fully_extended and stage != "down":
            stage = "down"
        if arms_fully_contracted and stage == "down":
            stage = "up"
            curl_count += 1

        # Display Information
        cv2.putText(image, f'Bicep Curls: {curl_count}', (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(image, f'Angle: {int(avg_curl_angle)}', (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
        cv2.putText(image, f'Stage: {stage}', (30, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    return image
