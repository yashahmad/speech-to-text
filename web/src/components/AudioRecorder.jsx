import React, { useState } from "react";
import { ReactMic } from "react-mic";

const AudioRecorder = () => {
  const [record, setRecord] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const startRecording = () => setRecord(true);
  const stopRecording = () => setRecord(false);

  const onStop = (recordedBlob) => {
    console.log("Recorded Blob: ", recordedBlob);
    setAudioBlob(recordedBlob.blob);
  };

  const sendToApi = async () => {
    if (!audioBlob) {
      alert("No audio recorded to send.");
      return;
    }
  
    setUploadStatus("Uploading...");
  
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
  
    try {
      const response = await fetch("http://localhost:5000/whisper", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      setUploadStatus(`Upload successful! Transcript: ${result.transcript}`);
    } catch (err) {
      console.error("Error uploading audio:", err);
      setUploadStatus("Upload failed.");
    }
  };
  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.micButton,
          backgroundColor: record ? "red" : "lightgray",
          boxShadow: record ? "0 0 20px red" : "0 0 5px gray",
        }}
        onClick={record ? stopRecording : startRecording}
      >
        🎙️
      </div>

      <ReactMic
        record={record}
        onStop={onStop}
        mimeType="audio/webm"
        strokeColor="#ffffff"
        backgroundColor="#8C3ED1"
      />

      {/* Send to API Button */}
      <button style={styles.sendButton} onClick={sendToApi}>
        Send to API
      </button>

      {/* Upload Status */}
      {uploadStatus && <p style={styles.status}>{uploadStatus}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    gap: "20px",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: "1.5rem",
    textAlign: "center",
  },
  micButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    fontSize: "50px",
    cursor: "pointer",
    transition: "background-color 0.3s, box-shadow 0.3s",
  },
  sendButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
    maxWidth: "200px",
  },
  status: {
    fontSize: "14px",
    color: "#333",
  },
};

export default AudioRecorder;
