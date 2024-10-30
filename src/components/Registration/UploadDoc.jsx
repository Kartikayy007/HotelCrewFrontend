import React, { useState } from 'react';

function UploadDoc() {
  const [dragActive, setDragActive] = useState(false);
  
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
    // havve to handle the files lofic here
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center">
      <div className="flex justify-center items-center gap-9 ml-[5.1rem]">
        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[550]">Upload Documents</h1>
          </div>

          <div 
            className={`w-[623px] h-[200px] border-2 border-solid rounded-lg flex flex-col items-center justify-center cursor-pointer
              ${dragActive ? 'border-[#5663AC] bg-[#F8F9FF]' : 'border-[#BDBDBD] bg-[#F5F5F5]'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <p className="text-gray-600 mb-2">Drag Documents from computer or upload from drive</p>
              <img className='relative left-[43%] mb-5' src="src/assets/docupload.svg"/>
              <button 
                type="button"
                className="bg-[#5663AC] text-white px-6 py-2 rounded-lg hover:bg-[#4B579D] transition-colors"
              >
                Upload
              </button>
            </div>
          </div>

          <button className="h-9 w-28 bg-[#5663AC] font-Montserrat font-[700] rounded-lg text-white relative top-10 ml-[32rem]">
            <span>Next </span>
            <span>➔</span>
          </button>
        </form>

        <div>
          <div className="w-[515px] relative left-[35%] h-screen bg-white shadow-2xl border-none rounded-lg">
            <div className="flex gap-5 text-2xl">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div
                  key={num}
                  className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                    num === 6 ? 'border-[#5C69F8] text-black' : 'text-black bg-white'
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
              />
              <h2 className="text-[24px] font-[450] font-Montserrat">Upload Documents</h2>
              <p className="text-gray-600 font-sans font-[300] text-center">
                Fill out the form on the left.
                <br />
                <span className="font-sans font-[300]">You can always edit the data in the</span>
                <br />
                <span className="font-sans font-[300]">setting menu.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadDoc;