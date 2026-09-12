"""
================================================================================
REAL-TIME FACIAL EXPRESSION DETECTOR VIA WEBCAM
================================================================================
This script opens your live camera/webcam, detects face(s) in each video frame
using OpenCV Haar Cascades, crops and resizes the face to 48x48 grayscale, and
predicts the facial expression in real-time using the trained CNN model.

Press 'q' or 'ESC' to exit the camera feed window.

Dependencies:
  pip install opencv-python tensorflow numpy
================================================================================
"""

import os
import sys
import time
import json
import numpy as np

# Suppress TensorFlow verbosity
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

try:
    import cv2
except ImportError:
    print("Error: OpenCV is required. Please install via:")
    print("       pip install opencv-python")
    sys.exit(1)

try:
    import tensorflow as tf
except ImportError:
    print("Error: TensorFlow is required. Please install via:")
    print("       pip install tensorflow")
    sys.exit(1)

# Default Emotion Categories
EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

# Color mapping for HUD bounding boxes (BGR format for OpenCV)
EMOTION_COLORS = {
    'angry': (0, 0, 255),       # Red
    'disgust': (0, 140, 255),   # Orange
    'fear': (128, 0, 128),      # Purple
    'happy': (0, 255, 0),       # Bright Green
    'neutral': (255, 255, 255), # White
    'sad': (255, 0, 0),         # Blue
    'surprise': (0, 255, 255)   # Yellow
}

def load_emotion_labels(label_file='emotion_labels.json'):
    """Loads emotion label dictionary if available, else falls back to default list."""
    if os.path.exists(label_file):
        try:
            with open(label_file, 'r') as f:
                mapping = json.load(f)
                labels = [mapping[str(i)] for i in range(len(mapping))]
                print(f"[✓] Loaded label mapping from '{label_file}': {labels}")
                return labels
        except Exception as e:
            print(f"[!] Warning loading '{label_file}': {e}. Using default labels.")
    return EMOTION_LABELS

def get_face_cascade():
    """Locates and loads OpenCV Haar Cascade for Frontal Face Detection."""
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    if not os.path.exists(cascade_path):
        cascade_path = 'haarcascade_frontalface_default.xml'
    
    face_cascade = cv2.CascadeClassifier(cascade_path)
    if face_cascade.empty():
        print(f"Error: Could not load Haar Cascade from {cascade_path}")
        sys.exit(1)
    return face_cascade

def load_trained_model(model_path='facial_expression_model.h5'):
    """Loads trained TensorFlow/Keras model or creates a fallback model for immediate testing."""
    if os.path.exists(model_path):
        print(f"[+] Loading trained model from '{model_path}'...")
        try:
            model = tf.keras.models.load_model(model_path)
            print("[✓] Model loaded successfully!")
            return model
        except Exception as e:
            print(f"[!] Error loading model file: {e}")

    print(f"\n[!] Model file '{model_path}' not found!")
    print("[!] Run 'python train_expression_model.py' first to train on your dataset.")
    print("[+] Initializing a temporary un-trained CNN model so you can test camera live feed right now...\n")
    
    from train_expression_model import build_model
    model = build_model(input_shape=(48, 48, 1), num_classes=len(EMOTION_LABELS))
    return model

def run_realtime_detection(model_path='facial_expression_model.h5', camera_idx=0):
    """
    Main Real-time Facial Expression Detection Loop.
    """
    labels = load_emotion_labels()
    face_cascade = get_face_cascade()
    model = load_trained_model(model_path)

    print(f"\n[+] Opening Webcam (Camera Index: {camera_idx})...")
    cap = cv2.VideoCapture(camera_idx)

    if not cap.isOpened():
        print(f"Error: Could not open camera at index {camera_idx}. Check webcam connection or camera permissions.")
        sys.exit(1)

    print("\n" + "="*65)
    print(" REAL-TIME EXPRESSION DETECTOR ACTIVE")
    print(" - Press 'q' or 'ESC' on the camera window to quit.")
    print("="*65 + "\n")

    prev_time = time.time()

    while True:
        ret, frame = cap.read()
        if not ret or frame is None:
            print("Warning: Unable to read frame from webcam.")
            break

        # Flip horizontally for natural mirror selfie view
        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in frame
        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(60, 60),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        for (x, y, w, h) in faces:
            # Crop face Region of Interest (ROI)
            face_roi_gray = gray[y:y+h, x:x+w]
            
            # Pre-process face image for model input (48x48 grayscale, normalized [0, 1])
            resized = cv2.resize(face_roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
            normalized = resized.astype('float32') / 255.0
            tensor = np.expand_dims(normalized, axis=-1)  # (48, 48, 1)
            tensor = np.expand_dims(tensor, axis=0)       # (1, 48, 48, 1)

            # Predict emotion probabilities
            preds = model.predict(tensor, verbose=0)[0]
            emotion_idx = np.argmax(preds)
            confidence = preds[emotion_idx] * 100
            emotion_name = labels[emotion_idx] if emotion_idx < len(labels) else 'Unknown'

            color = EMOTION_COLORS.get(emotion_name.lower(), (0, 245, 255))

            # Draw bounding box around face
            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            
            # Draw sleek label background banner
            label_text = f"{emotion_name.upper()} ({confidence:.1f}%)"
            (text_w, text_h), baseline = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.75, 2)
            cv2.rectangle(frame, (x, y - text_h - 12), (x + text_w + 10, y), color, -1)
            
            # Draw white label text
            cv2.putText(frame, label_text, (x + 5, y - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 0, 0), 2, cv2.LINE_AA)

            # Optional: Display confidence bars for top 3 emotions near the box
            sorted_indices = np.argsort(preds)[::-1][:3]
            bar_y = y + h + 20
            for idx in sorted_indices:
                name = labels[idx].capitalize()
                prob = preds[idx]
                bar_text = f"{name}: {prob*100:.0f}%"
                bar_len = int(prob * 100)
                
                # Draw small probability bar
                cv2.rectangle(frame, (x, bar_y), (x + bar_len, bar_y + 12), color, -1)
                cv2.rectangle(frame, (x, bar_y), (x + 100, bar_y + 12), (200, 200, 200), 1)
                cv2.putText(frame, bar_text, (x + 108, bar_y + 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
                bar_y += 18

        # Calculate FPS
        curr_time = time.time()
        fps = 1.0 / (curr_time - prev_time + 1e-6)
        prev_time = curr_time

        # Draw HUD info overlay
        cv2.putText(frame, f"FPS: {int(fps)} | Faces: {len(faces)}", (15, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.putText(frame, "Press 'q' or 'ESC' to Exit", (15, frame.shape[0] - 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 250), 1, cv2.LINE_AA)

        # Show live output window
        cv2.imshow("Real-Time Facial Expression Detector", frame)

        # Keyboard controls (Press 'q' or ESC key to quit)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            print("\n[+] Exiting camera feed...")
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    model_file = 'facial_expression_model.h5'
    if len(sys.argv) > 1:
        model_file = sys.argv[1]
        
    run_realtime_detection(model_file)
