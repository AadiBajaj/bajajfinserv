from flask import Flask, Response
import cv2
import threading

# Import your exercise tracking scripts
import bicep
import pushup
import squat
import shoulderpress

app = Flask(__name__)

# Function to generate video frames
def generate_frames(exercise_function):
    cap = cv2.VideoCapture(0)  # Use webcam (Change to video path if needed)

    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            frame = exercise_function(frame)  # Process frame using exercise function
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

# Route for Bicep Curls
@app.route('/bicep')
def video_feed_bicep_curls():
    return Response(generate_frames(bicep.track_bicep_curls),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Route for Push-ups
@app.route('/pushup')
def video_feed_pushups():
    return Response(generate_frames(pushup.track_pushups),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Route for Squats
@app.route('/squat')
def video_feed_squats():
    return Response(generate_frames(squat.track_squats),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Route for Shoulder Press
@app.route('/shoulderpress')
def video_feed_shoulder():
    return Response(generate_frames(shoulderpress.track_shoulder_press),  
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Run Flask application
if __name__ == '__main__':
    app.run(debug=True)
