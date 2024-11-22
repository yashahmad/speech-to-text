const Transcript = ({ uploadStatus }) => {
    return (
        <div className='text-sm h-64 overflow-auto overflow-scroll no-scrollbar p-4 mb-4'>
            <p>
                {uploadStatus && uploadStatus}
            </p>
        </div>
    )
}

export default Transcript;