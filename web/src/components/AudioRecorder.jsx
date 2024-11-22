import { ReactMic } from "react-mic";
import { Mic, MicOff } from "lucide-react";

const AudioRecorder = ({ record, startRecording, stopRecording, onStop, sendToApi }) => {
  return (
    <>
      <h5 className="my-4">Press the mic to record</h5>
      <div className=''>
        <ReactMic record={record} onStop={onStop} mimeType="audio/webm" className='w-full mb-4' />
      </div>
      {record ? <MicOff size={32} className='bg-blue-700 text-white p-2 rounded-full shadow-lg hover:shadow-indigo-500' onClick={stopRecording} />
        : <Mic size={32} className='bg-blue-700 text-white p-2 rounded-full shadow-lg hover:shadow-indigo-500' onClick={startRecording} />
      }
      <button className='bg-gray-800 text-white px-2 py-1 rounded-lg my-4 hover:shadow-lg' onClick={sendToApi}>Convert to Text</button>
    </>
  )
}

export default AudioRecorder;