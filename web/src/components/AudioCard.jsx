import { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import Transcript from './Transcript';

const AudioCard = () => {
    const [record, setRecord] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const startRecording = () => setRecord(true);
    const stopRecording = () => setRecord(false);

    const onStop = (recordedBlob) => {
        console.log("Recorded Blob: ", recordedBlob);
        setAudioBlob(recordedBlob.blob);
    }

    const sendToApi = async () => {
        if (!audioBlob) {
            alert("No audio recorded to send.");
            return;
        }
        setUploadStatus("Uploading...");
        const formData = new FormData();
        const file = new File([audioBlob], "recorded-audio.webm", { type: audioBlob.type });

        formData.append("file", file);

        const api = import.meta.env.VITE_BACKEND_API;
        console.log("API", api);
        try {
            const response = await fetch(`${api}/transcribe`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setUploadStatus(`Upload successful! Transcript: ${result.text}`);
        } catch (err) {
            console.error("Error uploading audio: ", err);
            setUploadStatus("Upload failed");
        }
    }

    return (
        <>
            <div className="hidden lg:block md:block relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[700px] w-[360px] shadow-xl">
                <div className="rounded-[2rem] overflow-hidden w-[330px] h-[672px] bg-white dark:bg-gray-800">
                    <div className="flex flex-col justify-center items-center p-4">
                        <h4 className='mb-4 font-extrabold'>Speech to Text</h4>
                        <img src="/speech-to-text.png" width={100} />
                        <AudioRecorder record={record} startRecording={startRecording} stopRecording={stopRecording} onStop={onStop} sendToApi={sendToApi} />
                    </div>
                    <Transcript uploadStatus={uploadStatus} />
                </div>
            </div>
            <div className="lg:hidden md:hidden relative mx-auto">
                <div className="flex flex-col justify-center items-center p-4">
                    <h4 className='mb-4 font-extrabold'>Speech to Text</h4>
                    <img src="/speech-to-text.png" width={100} />
                    <AudioRecorder record={record} startRecording={startRecording} stopRecording={stopRecording} onStop={onStop} sendToApi={sendToApi} />
                </div>
                <Transcript uploadStatus={uploadStatus} />
            </div>
        </>
    )
}

export default AudioCard;