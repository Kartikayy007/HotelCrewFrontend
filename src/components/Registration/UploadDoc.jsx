import React, {useState, useRef, useEffect} from "react";
import doc from "/documentupload.svg";
import lineIcon from "/Line.svg";
import docupload from "/docupload.svg";
import exampleSheet from "/example.pdf";
import LoadingAnimation from "../common/LoadingAnimation";

function UploadDoc({onSubmit, onBack, updateFormData, initialData}) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

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
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".xlsx")
    ) {
      setErrorMessage("Please upload only Excel files (.xls or .xlsx)");
      return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("File size must be less than 5MB");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleFiles = (fileList) => {
    const excelFiles = Array.from(fileList).filter(
      (file) => file.name.endsWith(".xls") || file.name.endsWith(".xlsx")
    );

    if (excelFiles.length > 0) {
      const selectedFile = excelFiles[0];

      if (validateExcelFile(selectedFile)) {
        setFiles([selectedFile]);
        updateFormData({staff_excel_sheet: selectedFile});
      }
    } else {
      setErrorMessage("Please upload only Excel files (.xls or .xlsx)");
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
    setErrorMessage("");
    updateFormData({staff_excel_sheet: null});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMessage("Please upload a staff Excel sheet");
      return;
    }
    setIsLoading(true);
    updateFormData({staff_excel_sheet: files[0]});
    await onSubmit();
    setIsLoading(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="min-h-screen bg-[#FFFFFF] flex items-center overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-0 xl:ml-[5.1rem] m-auto p-0 xl:p-0 xl:gap-52">
        <div className="flex xl:hidden bg-white font-medium gap-3 mb-4 fixed top-6">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                num === 6
                  ? "border-[#5C69F8] text-black"
                  : "text-black bg-white border-none"
              }`}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="xl:hidden w-full flex flex-col items-center space-y-4 mt-8">
          <img
            src={doc}
            alt="Hotel Icon"
            className="h-24 mb-4 text-[#5663AC]"
          />
          <h2 className="text-[32px] text-center font-medium font-Montserrat">
            Upload Staff Excel Sheet
          </h2>
          <p className="font-sans font-normal text-center">
            Fill out the form below.
            <br />
            You can always edit the data in the
            <br />
            settings menu.
          </p>
          <a
            href={exampleSheet}
            download="example.pdf"
            className="text-blue-500 underline"
          >
            Here's an example of an Excel sheet
          </a>
        </div>

        <form className="space-y-2 xl:w-full max-w-[330px]">
          <div className="flex justify-between items-center">
            <h1 className="text-[32px] font-semibold hidden xl:block xl:text-left">
              Upload Staff Excel Sheet
            </h1>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".xls,.xlsx"
            className="hidden"
          />

          <div
            className={`w-[330px] xl:w-[623px] h-[227px] xl:h-[192px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer
              ${
                dragActive
                  ? "border-[#5663AC] bg-[#F8F9FF]"
                  : "border-[#BDBDBD] bg-[#EFEFEF]"
              }
              ${errorMessage ? "border-[#99182C]" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                {dragActive
                  ? "Drop your file here"
                  : "Drag Excel file from computer or click to upload"}
              </p>
              <img
                className="relative left-[43%] mb-5"
                src={docupload}
                alt="Upload Icon"
              />
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
          <div className="h-1 xl:text-left text-center ">
            {errorMessage && (
              <div className="text-[#99182C] text-sm ">{errorMessage}</div>
            )}
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Selected File:</h3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <span className="truncate">{files[0].name}</span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="ml-4 text-[#99182C] hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="px-1 xl:px-0 xl:left-auto xl:right-auto xl:fixed xl:top-[80vh]">
            <div className="flex justify-between xl:w-[42rem]">
              <button
                type="button"
                onClick={onBack}
                className="h-9 w-[7rem] bg-gray-400 hover:bg-gray-500 font-Montserrat font-[700] rounded-lg text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmitClick}
                disabled={isLoading}
                className="h-9 w-28 bg-[#5663AC] font-Montserrat font-bold rounded-lg text-white xl:fixed xl:left-[41.2vw] flex items-center justify-center"
              >
                {isLoading ? (
                  <LoadingAnimation size={24} color="#FFFFFF" />
                ) : (
                  "Submit ➔"
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="hidden xl:block xl:w-[512px] font-medium fixed top-0 right-0 xl:h-[100vh] bg-white shadow-2xl border-none rounded-lg">
          <div className="flex gap-5 text-[32px]">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className={`top-20 left-20 relative w-12 h-12 flex items-center justify-center rounded-full border-solid border-[3.5px] ${
                  num === 6
                    ? "border-[#5C69F8] text-black"
                    : "text-black bg-white border-none"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          <img className="relative top-36 left-[43.7%]" src={lineIcon} alt="" />
          <img
            className="relative top-[80%] left-[43.7%]"
            src={lineIcon}
            alt=""
          />

          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <img
              src={doc}
              className="h-24 mb-4 text-[#5663AC]"
              alt="Document Upload Icon"
            />
            <h2 className="text-[24px] font-[450] font-Montserrat">
              Upload Documents
            </h2>
            <p className="font-sans text-[16px] font-[400] text-center">
              Fill out the form on the left.
              <br />
              You can always edit the data in the
              <br />
              settings menu.
            </p>
            <div>
              <a
                href="/Unique_Dummy_Staff_Data.pdf"
                download="Unique_Dummy_Staff_Data.pdf"
                className="text-blue-500 underline"
                onClick={(e) => {
                  if (
                    !e.currentTarget.href.includes(
                      "Unique_Dummy_Staff_Data.pdf"
                    )
                  ) {
                    e.preventDefault();
                    console.error("PDF file not found");
                  }
                }}
              >
                Here's an example of an Excel sheet
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadDoc;
