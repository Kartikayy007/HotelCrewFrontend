import React, { useState, useRef } from 'react';

function UploadDoc({ onSubmit, onBack, updateFormData, initialData }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState(initialData || []);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const inputFiles = Array.from(e.target.files);
    handleFiles(inputFiles);
  };

  const handleFiles = (fileList) => {
    const excelFiles = fileList.filter(file => file.name.endsWith('.xls') || file.name.endsWith('.xlsx'));
    setFiles(excelFiles);
    updateFormData(excelFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    updateFormData(newFiles);
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-9 lg:ml-[5.1rem] mx-auto">
      <div className="flex lg:hidden font-medium gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 5 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Mobile Content Block */}
        <div className="lg:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-8">
          <img
            src="src/assets/documentupload.svg"
            alt="Hotel Icon"
            className="h-[96] mb-4 text-[#5663AC]"
          />
          <h2 className="text-[24px] font-[500] font-Montserrat ">
            Upload Documents
          </h2>
          <p className="font-sans font-[400] text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
        </div>
        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[600] lg:block hidden">Upload Documents</h1>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileInput}
            multiple 
            accept=".xls,.xlsx"
            className="hidden" 
          />

          <div 
            className={`w-[380px] lg:w-[623px] h-[227px] lg:h-[192px] border-1 border-solid rounded-lg flex flex-col items-center justify-center cursor-pointer
              ${dragActive ? 'border-[#5663AC] bg-[#F8F9FF]' : 'border-[#BDBDBD] bg-[#EFEFEF]'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <p className="text-gray-600 mb-2">Drag Documents from computer or upload from drive</p>
              <img className='relative left-[43%] mb-5' src="src/assets/docupload.svg" alt="Upload Icon"/>
              <button 
                type="button"
                onClick={triggerFileInput}
                className="bg-[#5663AC] text-white px-6 py-2 rounded-lg hover:bg-[#4B579D] transition-colors"
              >
                Upload
              </button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4 fixed">
              <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
              <ul className="list-disc pl-5">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {file.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className='relative top-[7rem]'>   
            <div className="flex justify-between">
              <button type="button" onClick={onBack} className="h-9 w-[7rem] bg-gray-400 font-Montserrat font-[700] rounded-lg text-white">
                <span>Back </span>
              </button>
              <button onClick={handleSubmitClick} className="h-9 w-[7rem] bg-[#5663AC] font-Montserrat font-[700] rounded-lg text-white">
                <span>Submit </span>
                <span>➔</span>
              </button>
            </div>
          </div> 
        </form>

        <div>
          <div className="lg:block hidden w-[515px] font-medium relative left-[26%] h-screen bg-white shadow-2xl border-none rounded-lg overflow-hidden">
            <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 6 ? 'border-[#5C69F8] text-black' : 'text-black bg-white border-none'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>

            <img className="relative top-36 left-[43.7%]" src="src/assets/Line.svg" alt="" />
            <img className="relative top-[80%] left-[43.7%]" src="src/assets/Line.svg" alt="" />

            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <img
                src="src/assets/documentupload.svg"
                className="h-24 mb-4 text-[#5663AC]"
                alt="Document Upload Icon"
              />
              <h2 className="text-[24px] font-[500] font-Montserrat">Upload Documents</h2>
              <p className="font-sans text-[16px] font-[400] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[400]">You can always edit the data in the</span>
                <br />
                <span className="font-sans font-[400]">setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadDoc;