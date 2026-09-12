"""
================================================================================
FACIAL EXPRESSION RECOGNITION - MODEL TRAINING SCRIPT
================================================================================
Based on Kaggle Facial Expression Recognition Dataset (FER-2013).
Images: 48x48 grayscale face images belonging to 7 expression categories:
  0: angry
  1: disgust
  2: fear
  3: happy
  4: neutral
  5: sad
  6: surprise

This script defines, trains, and saves a Convolutional Neural Network (CNN)
model for emotion classification.

Usage:
  python train_expression_model.py [--dataset_dir ./dataset] [--epochs 30]
================================================================================
"""

import os
import sys
import json
import argparse
import numpy as np

# Suppress TensorFlow log noise
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Dense, Dropout, Flatten, BatchNormalization
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
except ImportError:
    print("Error: TensorFlow/Keras is required. Please install via:")
    print("       pip install tensorflow numpy matplotlib pillow")
    sys.exit(1)

# Default Emotion Categories (Alphabetical order as loaded by Keras ImageDataGenerator)
EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']
IMG_SIZE = 48
NUM_CLASSES = len(EMOTION_LABELS)

def build_model(input_shape=(IMG_SIZE, IMG_SIZE, 1), num_classes=NUM_CLASSES):
    """
    Builds a robust Convolutional Neural Network (CNN) for 48x48 facial expression detection.
    """
    model = Sequential([
        Input(shape=input_shape),
        # Block 1
        Conv2D(32, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        Conv2D(64, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),

        # Block 2
        Conv2D(128, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        Conv2D(128, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),

        # Block 3
        Conv2D(256, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        Conv2D(256, (3, 3), padding='same', activation='relu'),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.3),

        # Fully Connected Block
        Flatten(),
        Dense(512, activation='relu'),
        BatchNormalization(),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])

    optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def create_synthetic_demo_dataset(target_dir):
    """
    Generates a small dummy dataset in target_dir if real dataset is not found,
    allowing instant testing of the pipeline.
    """
    print(f"\n[+] Real dataset not found in '{target_dir}'.")
    print("[+] Creating dummy sample dataset for pipeline demonstration...")
    
    from PIL import Image
    train_dir = os.path.join(target_dir, 'train')
    val_dir = os.path.join(target_dir, 'validation')
    
    for category in EMOTION_LABELS:
        os.makedirs(os.path.join(train_dir, category), exist_ok=True)
        os.makedirs(os.path.join(val_dir, category), exist_ok=True)
        
        # Generate 10 dummy grayscale images per class
        for i in range(10):
            dummy_pixels = np.random.randint(0, 256, (IMG_SIZE, IMG_SIZE), dtype=np.uint8)
            img = Image.fromarray(dummy_pixels, mode='L')
            img.save(os.path.join(train_dir, category, f"sample_{i}.jpg"))
            
        for i in range(3):
            dummy_pixels = np.random.randint(0, 256, (IMG_SIZE, IMG_SIZE), dtype=np.uint8)
            img = Image.fromarray(dummy_pixels, mode='L')
            img.save(os.path.join(val_dir, category, f"sample_val_{i}.jpg"))

    print("[✓] Sample demo dataset created successfully.\n")

def train(dataset_dir, epochs=30, batch_size=64, model_out='facial_expression_model.h5'):
    """
    Train the Facial Expression CNN Model using Data Augmentation and Keras DataGenerators.
    """
    train_dir = os.path.join(dataset_dir, 'train')
    val_dir = os.path.join(dataset_dir, 'validation')

    # Automatically resolve validation directory variant ('validation', 'val', or 'test')
    for val_name in ['validation', 'val', 'test']:
        possible_val = os.path.join(dataset_dir, val_name)
        if os.path.exists(possible_val):
            val_dir = possible_val
            break

    # If dataset path doesn't exist, create demo dataset
    if not os.path.exists(train_dir):
        if os.path.exists(dataset_dir) and any(os.path.isdir(os.path.join(dataset_dir, c)) for c in EMOTION_LABELS):
            train_dir = dataset_dir
            val_dir = dataset_dir
        else:
            create_synthetic_demo_dataset(dataset_dir)
            train_dir = os.path.join(dataset_dir, 'train')
            val_dir = os.path.join(dataset_dir, 'validation')

    # Data Augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1.0/255.0,
        rotation_range=15,
        width_shift_range=0.15,
        height_shift_range=0.15,
        shear_range=0.15,
        zoom_range=0.15,
        horizontal_flip=True,
        fill_mode='nearest'
    )

    val_datagen = ImageDataGenerator(rescale=1.0/255.0)

    print(f"[+] Loading training images from: {train_dir}")
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=batch_size,
        color_mode='grayscale',
        class_mode='categorical',
        shuffle=True
    )

    print(f"[+] Loading validation images from: {val_dir}")
    val_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=batch_size,
        color_mode='grayscale',
        class_mode='categorical',
        shuffle=False
    )

    # Save class indices mapping safely
    class_indices = train_generator.class_indices
    if not class_indices:
        num_classes = NUM_CLASSES
        print(f"[!] Warning: No class subdirectories found in '{train_dir}'. Defaulting to {NUM_CLASSES} classes.")
    else:
        num_classes = len(class_indices)
        labels_mapping = {v: k for k, v in class_indices.items()}
        label_file = os.path.join(os.path.dirname(model_out) or '.', 'emotion_labels.json')
        with open(label_file, 'w') as f:
            json.dump(labels_mapping, f, indent=2)
        print(f"[✓] Saved label mapping to '{label_file}': {class_indices}")

    # Build CNN Architecture
    print("\n[+] Building CNN Architecture...")
    model = build_model(input_shape=(IMG_SIZE, IMG_SIZE, 1), num_classes=num_classes)
    model.summary()

    # Callbacks
    callbacks = [
        ModelCheckpoint(model_out, monitor='val_accuracy', save_best_only=True, verbose=1),
        EarlyStopping(monitor='val_loss', patience=8, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, verbose=1)
    ]

    print(f"\n[+] Starting model training for {epochs} epochs...")
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=val_generator,
        callbacks=callbacks
    )

    # Save final model
    model.save(model_out)
    print(f"\n[✓] Model successfully trained & saved to '{model_out}'!")
    return model

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Train Facial Expression Detection Model")
    parser.add_argument('--dataset_dir', type=str, default='./images', help="Path to FER dataset directory containing train/ and validation/ subdirectories")
    parser.add_argument('--epochs', type=int, default=25, help="Number of training epochs")
    parser.add_argument('--batch_size', type=int, default=64, help="Batch size")
    parser.add_argument('--output', type=str, default='facial_expression_model.h5', help="Output model path")
    args = parser.parse_args()

    train(args.dataset_dir, epochs=args.epochs, batch_size=args.batch_size, model_out=args.output)
