import cv2
import mediapipe as mp
import numpy as np
import time
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_detection_confidence=0.7, min_tracking_confidence=0.7)
mp_drawing = mp.solutions.drawing_utils

def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba, bc = a - b, c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

def generate_frames(session_duration):
    cap = cv2.VideoCapture(0)
    cap.set(3, 640)
    cap.set(4, 480)

    curl_count = 0
    stage = None
    start_time = time.time()

    while True:
        elapsed_time = time.time() - start_time
        if elapsed_time >= session_duration:
            print("Workout session completed!")
            break

        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.resize(frame, (640, 480))
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            landmarks = results.pose_landmarks.landmark

            left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
            left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]

            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            right_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
            right_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]

            left_curl_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
            right_curl_angle = calculate_angle(right_shoulder, right_elbow, right_wrist)
            avg_curl_angle = (left_curl_angle + right_curl_angle) / 2

            if avg_curl_angle > 165:
                stage = "down"
            if avg_curl_angle < 45 and stage == "down":
                stage = "up"
                curl_count += 1

            time_display = f"Time: {int(elapsed_time // 60):02}:{int(elapsed_time % 60):02}"
            cv2.putText(image, f'Bicep Curls: {curl_count}', (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            cv2.putText(image, f'Angle: {int(avg_curl_angle)}', (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
            cv2.putText(image, time_display, (30, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        time.sleep(0.03)

    cap.release()

@app.route('/bicep')
def video_feed():
    try:
        duration = int(request.args.get('time', 30))  # Default to 30 seconds if not provided
    except ValueError:
        duration = 30
    return Response(generate_frames(duration), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    import uvicorn
    session_duration = int(input("Enter workout duration in seconds: "))  # Ask duration at the start
    uvicorn.run(app, host="0.0.0.0", port=8000)
