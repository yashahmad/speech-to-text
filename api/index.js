const OpenAI = require("openai");
require("dotenv").config();
const fs = require("fs");
const express = require("express")
const app = express();
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.set('port', (process.env.PORT || 8081));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Set up storage config for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with storage config
const upload = multer({ storage: storage });

// Create 'uploads' dir if not existing
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// api health check
app.get("/api/ping", (req, res) => {
    res.send("pong");
})

// openai transcription endpoint
app.post("/api/transcribe",  upload.single('file'), async (req, res) => {
    if (!req.file){
        return res.status(400).send('No file uploaded.');
    }
    const file = req.file;
    console.log("File", req.file);
    try{
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(file.path),
            model: "whisper-1",
        });
        console.log("Transcription text", transcription.text);
        return res.send(transcription);
    }catch(err){
        res.status(500).send("Error occurred while transcribing")
    }
})

app.listen(app.get('port'), () => {
    console.log(`Server is 🚀🚀🚀🚀 at ${app.get('port')}`)
});