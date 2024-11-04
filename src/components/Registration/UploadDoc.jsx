import React, { useState, useRef, useEffect } from 'react';
import doc from '../../assets/documentupload.svg';
import lineIcon from '../../assets/Line.svg';
import docupload from '../../assets/docupload.svg';
import exampleSheet from '../../assets/example.pdf';

function UploadDoc({ onSubmit, onBack, updateFormData, initialData }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData?.staff_excel_sheet) {
      setFiles([initialData.staff_excel_sheet]);
    }
  }, [initialData]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateExcelFile = (file) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    console.log('Validating file:', file);
    console.log('File type:', file.type);
    console.log('File name:', file.name);
    
    if (!validTypes.includes(file.type) && 
        !file.name.endsWith('.xls') && 
        !file.name.endsWith('.xlsx')) {
      setErrorMessage('Please upload only Excel files (.xls or .xlsx)');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      setErrorMessage('File size must be less than 5MB');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleFiles = (fileList) => {
    const excelFiles = Array.from(fileList).filter(file => 
      file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );
    
    if (excelFiles.length > 0) {
      const selectedFile = excelFiles[0];
      
      console.log('Selected file:', selectedFile);
      console.log('File type:', selectedFile.type);
      console.log('File size:', selectedFile.size);
      
      if (validateExcelFile(selectedFile)) {
        console.log('File validation passed');
        setFiles([selectedFile]);
        updateFormData({ staff_excel_sheet: selectedFile });
      }
    } else {
      setErrorMessage('Please upload only Excel files (.xls or .xlsx)');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setErrorMessage('');
    updateFormData({ staff_excel_sheet: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMessage('Please upload a staff Excel sheet before submitting');
      return;
    }
    updateFormData({ staff_excel_sheet: files[0] });
    onSubmit();
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-24 lg:ml-[5.1rem] mx-auto">
        <div className="flex lg:hidden font-medium gap-3 mb-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 6 ? "border-[#5C69F8] text-black" : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="lg:hidden w-full flex flex-col items-center space-y-4 mb-8 mt-8">
          <img
            src={doc}
            alt="Hotel Icon"
            className="h-[96] mb-4 text-[#5663AC]"
          />
          <h2 className="text-[24px] font-[500] font-Montserrat">
            Upload Staff Excel Sheet
          </h2>
          <p className="font-sans font-[400] text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
          <a href={exampleSheet} download="example.pdf" className="text-blue-500 underline">
            Here's an example of an Excel sheet
          </a>
        </div>

        <form className="space-y-7">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-[600] lg:block hidden">Upload Staff Excel Sheet</h1>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".xls,.xlsx"
            className="hidden" 
          />

          <div 
            className={`w-[380px] lg:w-[623px] h-[227px] lg:h-[192px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer
              ${dragActive ? 'border-[#5663AC] bg-[#F8F9FF]' : 'border-[#BDBDBD] bg-[#EFEFEF]'}
              ${errorMessage ? 'border-red-500' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                {dragActive 
                  ? 'Drop your file here' 
                  : 'Drag Excel file from computer or click to upload'}
              </p>
              <img className='relative left-[43%] mb-5' src={docupload} alt="Upload Icon"/>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                className="bg-[#5663AC] text-white px-6 py-2 rounded-lg hover:bg-[#4B579D] transition-colors"
              >
                Select File
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">
              {errorMessage}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Selected File:</h3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <span className="truncate">{files[0].name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className='relative top-[3rem]'>   
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={onBack} 
                className="h-9 w-[7rem] bg-gray-400 hover:bg-gray-500 font-Montserrat font-[700] rounded-lg text-white transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleSubmitClick}
                className="h-9 w-[7rem] bg-[#5663AC] hover:bg-[#4B579D] font-Montserrat font-[700] rounded-lg text-white transition-colors"
              >
                Submit ➔
              </button>
            </div>
          </div> 
        </form>

        <div className="lg:block hidden w-[515px] font-medium relative left-[11%] h-screen bg-white shadow-2xl border-none rounded-lg overflow-hidden">
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

          <img className="relative top-36 left-[43.7%]" src={lineIcon} alt="" />
          <img className="relative top-[80%] left-[43.7%]" src={lineIcon} alt="" />

          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <img
              src={doc}
              className="h-24 mb-4 text-[#5663AC]"
              alt="Document Upload Icon"
            />
            <h2 className="text-[24px] font-[500] font-Montserrat">Upload Documents</h2>
            <p className="font-sans text-[16px] font-[400] text-center">
              Fill out the form on the left.
              <br />
              You can always edit the data in the
              <br />
              settings menu.
            </p>
            <a href={exampleSheet} download="example.pdf" className="text-blue-500 underline">
              Here's an example of an Excel sheet
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadDoc;