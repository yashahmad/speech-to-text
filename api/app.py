from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from tempfile import NamedTemporaryFile
import whisper
import torch

# Check if NVIDIA GPU is available
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Load the Whisper model
model = whisper.load_model("base", device=DEVICE)

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "Whisper API is running!"

@app.route('/whisper', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        abort(400, 'No file part')

    file = request.files['file']
    if file.filename == '':
        abort(400, 'No selected file')

    # Create a temporary file to save the uploaded audio
    with NamedTemporaryFile(delete=True) as temp:
        file.save(temp.name)
        result = model.transcribe(temp.name)
        return jsonify({'transcript': result['text']})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)