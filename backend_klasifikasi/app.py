from flask import Flask, request, jsonify
from flask_cors import CORS 
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

models = {
    "1": tf.keras.models.load_model("models/model1.h5"),
    "2": tf.keras.models.load_model("models/model2.h5"),
    "3": tf.keras.models.load_model("models/model3.h5"),
}

classes = [
    'cables', 'case', 'cpu', 'gpu', 'hdd', 'headset', 'keyboard',
    'microphone', 'monitor', 'motherboard', 'mouse', 'ram',
    'speakers', 'webcam'
]
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'Image file is required'}), 400

    data = request.form or request.json
    model_id = str(data.get('model_id'))

    if model_id not in models:
        return jsonify({'error': 'Invalid model_id. Choose 1, 2, or 3'}), 400

    image = request.files['image'].read()
    input_array = preprocess_image(image)

    model = models[model_id]
    prediction = model.predict(input_array)
    class_index = int(np.argmax(prediction))
    confidence = float(np.max(prediction))

    return jsonify({
        'model_id': model_id,
        'class_index': class_index,
        'class_name': classes[class_index],
        'confidence': confidence
    })

if __name__ == '__main__':
    app.run(debug=True)
