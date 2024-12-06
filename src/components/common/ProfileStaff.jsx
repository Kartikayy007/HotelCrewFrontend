import React, {useEffect, useState} from "react";
import {Skeleton, Snackbar, Alert, Slide} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
// import InfoIcon from "@mui/icons-material/Info";
import {
  getStaffProfile,
  updateStaffProfile,
  selectStaffProfileLoading,
  selectStaffProfileError,
  selectStaffProfileSuccessMessage,
} from "../../redux/slices/StaffProfileSlice";
import {Pencil} from "lucide-react";
import LoadingAnimation from "../common/LoadingAnimation";
import imageCompression from 'browser-image-compression';

export const selectStaffProfile = (state) => state.staffProfile?.user || null;

const inputStyles = {
  editing: `
      border-2 border-blue-400 
      bg-blue-50/30
      shadow-sm
      animate-pulse-border
      focus:ring-2 
      focus:ring-blue-200
      focus:border-blue-500
    `,
  default: `
      border border-gray-300
      bg-white
    `,
};

// Add utility function for image hashing
const getImageHash = async (imageData) => {
  const response = await fetch(imageData);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      // Create simple hash from base64 string
      const hash = base64.split(',')[1].substring(0, 32);
      resolve(hash);
    };
    reader.readAsDataURL(blob);
  });
};

const SProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectStaffProfile);
  const loading = useSelector(selectStaffProfileLoading);
  const error = useSelector(selectStaffProfileError);
  const updatemsg = useSelector(selectStaffProfileSuccessMessage);

  const [isEditing, setIsEditing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [image, setImage] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    department: "",
    email: "",
    role: "",
    shift: "",
    user_profile: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false); // Add new state

  useEffect(() => {
    if (error) {
      if (!navigator.onLine) {
        setSnackbarMessage(
          "No internet connection. Please check your network."
        );
      } else if (error?.status === 429) {
        setSnackbarMessage("Too many requests. Please try again later.");
      } else {
        setSnackbarMessage(error.message || "An unexpected error occurred.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [error]);

  // Update profile data when it loads
  useEffect(() => {
    if (profile) {
      setFormData({
        user_name: profile.user_name || "",
        department: profile.department || "",
        email: profile.email || "",
        role: profile.role || "",
        shift: profile.shift || "",
        user_profile: profile.user_profile || "",
      });
      setImage(profile.user_profile || "");
    }
  }, [profile]);

  console.log("profile", profile);

  // Handle successful updates
  useEffect(() => {
    if (updatemsg) {
      setSnackbarMessage(updatemsg);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [updatemsg]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  useEffect(() => {
    dispatch(getStaffProfile());
  }, [dispatch]);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        user_name: profile.user_name || "",
        department: profile.department || "",
        email: profile.email || "",
        role: profile.role || "",
        shift: profile.shift || "",
        user_profile: profile.user_profile || "",
      });
    }
  }, [profile]);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      setSnackbarMessage("Image size should be less than 1MB");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setImageLoading(true); // Start loading

    try {
      // Get current image hash
      const currentHash = await getImageHash(image);

      // Get new image hash
      const newHash = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result;
          const hash = base64.split(',')[1].substring(0, 32);
          resolve(hash);
        };
        reader.readAsDataURL(file);
      });

      // Compare hashes
      if (currentHash === newHash) {
        setImageLoading(false);
        setSnackbarMessage("This image is already your profile picture");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      // Compress image if needed
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setSelectedFile(compressedFile);
        setIsDirty(true);
        setImageLoading(false); // Stop loading
      };
      reader.readAsDataURL(compressedFile);

    } catch (error) {
      setImageLoading(false); // Stop loading on error
      setSnackbarMessage("Error processing image");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDirty) return;

    try {
      const formDataToSend = new FormData();

      // Add image if changed
      if (selectedFile) {
        formDataToSend.append('user_profile', selectedFile, selectedFile.name);
      }

      // Add username if changed
      if (formData.user_name !== profile.user_name) {
        formDataToSend.append('user_name', formData.user_name);
      }

      await dispatch(updateStaffProfile(formDataToSend)).unwrap();
      
      // Update displayed image on success
      if (tempImage) {
        setImage(tempImage);
      }

      dispatch(getStaffProfile());
      
      setSelectedFile(null);
      setTempImage(null);
      setIsDirty(false);
      setIsEditing(false);
      
      setSnackbarMessage("Profile updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      const errorMessage = error.errors?.user_profile?.[0] || 
                          error.message || 
                          "Failed to update profile";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Add error handling effect
  useEffect(() => {
    if (error) {
      setSnackbarMessage(error.message || "Failed to load profile");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [error]);

  return (
    <>
      <section className="h-screen py-2 mr-1 px-0 font-Montserrat">
        <h2 className="text-[#252941] text-3xl my-3 lg:my-6 pl-12 ml-5 font-semibold">
            Profile
        </h2>
        <div className="bg-white z-10 w-[95%] lg:ml-7 h-auto xl:mt-1 mt-2 mx-4 pt-2 pb-1 px-7 rounded-lg shadow">
            {loading ? (
    <div className="xl:flex-row flex-col flex w-full xl:items-start items-center xl:justify-evenly">
        {/* Left side - Profile Image Skeleton */}
        <div className="relative mt-4 mb-4 md:mb-10 w-48 h-48 lg:w-[320px] lg:h-[320px] lg:top-14 rounded-full border border-gray-400">
            <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
            <div className="absolute bottom-3 right-8 lg:w-10 lg:h-10 w-7 h-7 bg-gray-200 animate-pulse rounded-full" />
        </div>

        {/* Right side - Form Content Skeleton */}
        <div className="relative w-full lg:w-auto px-3 xl:px-8 mt-4">
            {/* Personal Details Header */}
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mt-5 mb-8" />

            <div className="lg:mt-10 mt-8 flex flex-col gap-6 lg:gap-10">
                {/* Username Field */}
                <div className="flex lg:w-[550px] flex-col gap-2">
                    <div className="h-7 w-24 bg-gray-200 animate-pulse rounded" />
                    <div className="h-12 w-full bg-gray-200 animate-pulse rounded-[4px]" />
                </div>

                {/* Department Field */}
                <div className="flex flex-col gap-2">
                    <div className="h-7 w-28 bg-gray-200 animate-pulse rounded" />
                    <div className="h-12 w-full bg-gray-200 animate-pulse rounded-[4px]" />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                    <div className="h-7 w-20 bg-gray-200 animate-pulse rounded" />
                    <div className="h-12 w-full bg-gray-200 animate-pulse rounded-[4px]" />
                </div>

                {/* Shift Field */}
                <div className="flex flex-col gap-2">
                    <div className="h-7 w-16 bg-gray-200 animate-pulse rounded" />
                    <div className="h-12 w-full bg-gray-200 animate-pulse rounded-[4px]" />
                </div>

                {/* Save Button Skeleton */}
                <div className="flex lg:justify-end justify-center">
                    <div className="xl:mt-10 xl:mb-10 mb-5 w-[195px] h-10 bg-gray-200 animate-pulse rounded-2xl" />
                </div>
            </div>
        </div>
    </div>
) : (
                // Your existing content
                <div className="xl:flex-row flex-col flex w-full xl:items-start items-center xl:justify-evenly">
                    <div
              className="relative mt-4 mb-4 md:mb-10 w-48 h-48 lg:w-[320px] lg:h-[320px] lg:top-14 rounded-full border border-gray-400 cursor-pointer "
              style={{padding: "6.18px"}}
            >
              <img
                src={tempImage || image}
                alt="profile"
                className="w-full h-full rounded-full object-cover"
              />
              {imageLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <LoadingAnimation size={60} color="#ffffff" />
                </div>
              )}
              <img
                src="/tabler_edit.svg"
                alt="edit"
                onClick={() => document.getElementById("imageUpload").click()}
                className="absolute bottom-3 right-8  lg:w-10 lg:h-10 w-7 h-7 cursor-pointer z-10"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{display: "none"}}
                id="imageUpload"
              />
            </div>
            <div className="relative w-full lg:w-auto  px-3 xl:px-8 mt-4">
              <h2 className="text-[#000000] text-2xl mt-5 font-semibold">
                Personal Details
              </h2>

              <form
                className="lg:mt-10 mt-8 flex flex-col gap-6 lg:gap-10"
                onSubmit={handleSubmit}
              >
                <div className="flex lg:w-[550px] flex-col gap-2 relative">
                  <label
                    htmlFor="user_name"
                    className="font-semibold text-lg flex items-center gap-2"
                  >
                    Username
                    {isEditing && (
                      <span className="text-xs font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full animate-fade-in">
                        Editing
                      </span>
                    )}
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="user_name"
                      name="user_name"
                      className={`
                                                rounded-[4px] w-full px-2 py-2 text-lg
                                                transition-all duration-200 ease-in-out
                                                ${
                                                  isEditing
                                                    ? inputStyles.editing
                                                    : inputStyles.default
                                                }
                                            `}
                      value={formData.user_name}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className={`
                                                absolute right-3 top-1/2 transform -translate-y-1/2
                                                p-1.5 rounded-full
                                                transition-all duration-200
                                                ${
                                                  isEditing
                                                    ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                                }
                                            `}
                      title={isEditing ? "Cancel editing" : "Edit username"}
                    >
                      <Pencil
                        size={16}
                        className={isEditing ? "animate-bounce-once" : ""}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="department" className="font-semibold text-lg">
                    {formData.department?.toLowerCase() === "manager"
                      ? "Role"
                      : "Department"}
                  </label>

                  <input
                    type="text"
                    id="department"
                    value={formData.department}
                    readOnly
                    className="border border-gray-300 text-gray-600 rounded-[4px] px-2  text-lg focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-semibold text-lg">
                    E-mail
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={formData.email}
                    readOnly
                    className="border border-gray-300 text-gray-600 rounded-[4px]  text-lg px-2 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="shift" className="font-semibold text-lg">
                    Shift
                  </label>
                  <input
                    type="text"
                    id="shift"
                    value={formData.shift}
                    readOnly
                    className="border border-gray-300 text-gray-600 rounded-[4px]  text-lg px-2 focus:outline-none"
                  />
                </div>

                <div className="flex lg:justify-end justify-center">
                  <button
                    type="submit"
                    className={`xl:mt-10 xl:mb-10 mb-5 w-[195px] rounded-2xl text-lg text-white font-semibold py-2 
                                            ${
                                              isDirty
                                                ? "bg-[#3F4870]"
                                                : "bg-gray-400"
                                            }`}
                    disabled={!isDirty}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
                </div>
            )}
        </div>
    </section>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ 
            minWidth: '250px',
            '& .MuiAlert-icon': {
              marginRight: '12px'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SProfile;
