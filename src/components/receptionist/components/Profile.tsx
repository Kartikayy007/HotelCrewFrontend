import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectUserProfile, 
  selectUserProfileLoading,
  fetchUserProfile,
  updateUserProfile 
} from '../../../redux/slices/userProfileSlice';
import LoadingAnimation from '../../common/LoadingAnimation';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserProfileLoading);

  const [profileImage, setProfileImage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setUserName(profile.user_name || '');
      setProfileImage(profile.user_profile || '');
    }
  }, [profile]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = event.target.files?.[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          setIsDirty(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setIsDirty(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('user_name', userName);
      
      if (selectedFile) {
        formData.append('user_profile', selectedFile);
      }

      const token = localStorage.getItem('token'); 
      const response = await axios.put(
        'https://hotelcrew-1.onrender.com/api/edit/user_profile/',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data) {
        setIsDirty(false);
        setSelectedFile(null);
        setAlert({
          open: true,
          message: 'Profile updated successfully',
          severity: 'success'
        });
        // Update profile in redux store
        dispatch(fetchUserProfile());
      }
    } catch (error) {
      setAlert({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12">Settings</h1>

      <div className="bg-white rounded-2xl shadow-lg w-[95%] sm:w-[90%] md:w-[85%] lg:mx-12 mx-auto">
        <section className="lg:h-[85vh] h-full p-2 mr-4 font-Montserrat">
          <div className="lg:mt-1 mt-2 ml-4 mr-2 pt-2 pb-1 pr-7 pl-7 rounded-lg">
            <div className="lg:flex-row flex-col flex w-full lg:items-start items-center lg:justify-evenly h-[85vh]">
              <div
                className="relative mt-4 w-32 h-32 lg:w-60 lg:h-60 lg:top-14 rounded-full border border-gray-400 cursor-pointer"
                style={{padding: "6.18px"}}
                onClick={() => document.getElementById("imageUpload")?.click()}
              >
                <img
                  src={profileImage || "/default-profile.png"}
                  alt="profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <img
                  src="/tabler_edit.svg"
                  alt="edit"
                  className="absolute bottom-3 right-8 lg:w-10 lg:h-10 w-7 h-7 cursor-pointer z-10"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{display: "none"}}
                  id="imageUpload"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                )}
              </div>
              
              <div className="relative w-full lg:w-auto pl-4 lg:pl-8 mt-4">
                <h2 className="text-[#000000] text-xl mt-5 font-semibold">
                  Personal Details
                </h2>

                <form onSubmit={handleSubmit} className="lg:mt-10 mt-8 flex flex-col gap-6 lg:gap-10">
                  <div className="flex lg:flex-row flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="userName" className="font-semibold text-sm">
                        User Name
                      </label>
                      <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={handleNameChange}
                        className="border border-gray-400 rounded-[4px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex lg:justify-end justify-center">
                    <button
                      type="submit"
                      disabled={!isDirty || loading}
                      className={`mt-2 mb-6 w-[195px] rounded-2xl text-white font-semibold p-1 
                        ${!isDirty || loading ? 'bg-gray-400' : 'bg-[#3F4870] hover:bg-[#2d355c]'} 
                        transition-colors`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <LoadingAnimation size={20} color="#ffffff" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setAlert(prev => ({ ...prev, open: false }))}
          severity={alert.severity}
          variant="contained"
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </section>
  );
}

export default Profile;