import cv2
import mediapipe as mp
import numpy as np

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.6, min_tracking_confidence=0.6)
mp_drawing = mp.solutions.drawing_utils

press_count = 0
stage = None

def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba, bc = a - b, c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

def track_shoulder_press(frame):
    global press_count, stage  # Keep track across frames

    frame = cv2.resize(frame, (640, 480))  # Resize for performance
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    if results.pose_landmarks:
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        landmarks = results.pose_landmarks.landmark

        # Get key points
        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
        left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
        right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

        # Compute angles
        left_press_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
        right_press_angle = calculate_angle(right_shoulder, right_elbow, right_wrist)
        avg_press_angle = (left_press_angle + right_press_angle) / 2

        # Wrist height filtering - Ensures hands go **above shoulders**
        left_wrist_above = left_wrist[1] < left_shoulder[1]
        right_wrist_above = right_wrist[1] < right_shoulder[1]
        hands_raised = left_wrist_above and right_wrist_above  

        # Shoulder press detection logic
        if hands_raised and avg_press_angle > 165 and stage != "up":
            stage = "up"
        if avg_press_angle < 90 and stage == "up":  # Ensures full range of motion
            stage = "down"
            press_count += 1

        # Display feedback
        cv2.putText(image, f'Shoulder Press: {press_count}', (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(image, f'Angle: {int(avg_press_angle)}', (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
        cv2.putText(image, f'Position: {stage}', (30, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

    return image  # Return processed frame
