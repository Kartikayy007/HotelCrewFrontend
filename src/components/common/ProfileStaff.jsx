import React, { useEffect, useState } from 'react'
import { Skeleton, Snackbar, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
// import InfoIcon from "@mui/icons-material/Info";
import { getStaffProfile, updateStaffProfile, selectStaffProfile, selectStaffProfileLoading, selectStaffProfileError, selectStaffProfileSuccessMessage } from '../../redux/slices/StaffProfileSlice';

const SProfile = () => {
    const dispatch = useDispatch();
    const profile = useSelector(selectStaffProfile);
    const loading = useSelector(selectStaffProfileLoading);
    const error = useSelector(selectStaffProfileError);
    const updatemsg = useSelector(selectStaffProfileSuccessMessage);

    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [image, setImage] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        user_profile: ''
    });

    useEffect(() => {
        if (error) {
            if (!navigator.onLine) {
                setSnackbarMessage('No internet connection. Please check your network.');
            } else if (error?.status === 429) {
                setSnackbarMessage('Too many requests. Please try again later.');
            } else {
                setSnackbarMessage(error.message || 'An unexpected error occurred.');
            }
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    }, [error]);

    // Update profile data when it loads
    useEffect(() => {
        if (profile) {
            setUsername(profile.user_name || '');
            setImage(profile.user_profile || '');
        }
    }, [profile]);

    // Handle successful updates
    useEffect(() => {
        if (updatemsg) {
            setSnackbarMessage(updatemsg);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
    }, [updatemsg]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const blobToFile = async (blobUrl, filename) => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
    };

    useEffect(() => {
        dispatch(getStaffProfile());
    }, [dispatch]);

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                user_name: profile.user_name || '',
                user_profile: profile.user_profile || ''
            });
        }
    }, [profile]);

    // Handle image upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    user_profile: reader.result
                }));
                setIsDirty(true);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isDirty) return;

        try {
            await dispatch(updateStaffProfile(formData)).unwrap();
            setIsDirty(false);
            setSnackbarMessage('Profile updated successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(error.message || 'Failed to update profile');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    if (loading) {
        return (
            <section className="h-screen py-2 mr-1 px-0 font-Montserrat">
                <h2 className="text-[#252941] text-3xl my-3 lg:my-6 pl-12 ml-5 font-semibold">Profile</h2>
                <div className="bg-white z-10 w-[95%] lg:ml-7 h-auto xl:mt-1 mt-2 mx-4 pt-2 pb-1 px-7 rounded-lg shadow">
                    <Skeleton variant="rectangular" width="100%" height="85%" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 p-4">
                Error loading profile: {error.message || 'Failed to load profile'}
            </div>
        );
    }

    return (
        <section className=" h-screen py-2 mr-1 px-0 font-Montserrat">

            <h2 className="text-[#252941] text-3xl  my-3 lg:my-6 pl-12 ml-5 font-semibold">Profile</h2>

            {loading ? (
                <Skeleton variant="rectangular" width="100%" height="85%" sx={{ backgroundColor: 'white', margin: "16px", paddingRight: "16px" }} />
            ) : (
                <div className="bg-white z-10 w-[95%] lg:ml-7 h-auto xl:mt-1 mt-2  mx-4 pt-2 pb-1 px-7 rounded-lg shadow">

                    <div className=" xl:flex-row flex-col  flex  w-full  xl:items-start items-center xl:justify-evenly ">
                        <div
                            className="relative mt-4 mb-4 md:mb-10 w-48 h-48 lg:w-[320px] lg:h-[320px] lg:top-14 rounded-full border border-gray-400 cursor-pointer "
                            style={{ padding: "6.18px" }}
                        >

                            <img
                                src={image}
                                alt="profile"
                                className="w-full h-full rounded-full object-cover"

                            />
                            <img src="/tabler_edit.svg"
                                alt="edit"
                                onClick={() => document.getElementById("imageUpload").click()}
                                className="absolute bottom-3 right-8  lg:w-10 lg:h-10 w-7 h-7 cursor-pointer z-10"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                                id="imageUpload"
                            />

                        </div>
                        <div className='relative w-full lg:w-auto  px-3 xl:px-8 mt-4'>
                            <h2 className="text-[#000000] text-2xl mt-5 font-semibold">Personal Details</h2>

                            <form className='lg:mt-10 mt-8 flex flex-col gap-6 lg:gap-10' onSubmit={handleSubmit}>

                                <div className='flex lg:w-[550px] flex-col gap-2'>
                                    <label htmlFor="firstName" className='font-semibold text-lg'>Username</label>
                                    <div className="flex items-center justify-between gap-2">
                                        < input type="text"
                                            id='firstNameseeonly'
                                            className='border border-gray-300 text-gray-600 rounded-[4px] w-full px-2 text-lg focus:outline-none'
                                            value={profile?.user_name}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="lastName" className="font-semibold text-lg">
                                        {profile?.department?.toLowerCase() === "manager" ? "Role" : "Department"}
                                    </label>

                                    <input type="text"
                                        id='department'
                                        value={profile?.department || ''}
                                        readOnly
                                        className='border border-gray-300 text-gray-600 rounded-[4px] px-2  text-lg focus:outline-none' />
                                </div>



                                <div className='flex flex-col gap-2'>
                                    <label htmlFor="email" className='font-semibold text-lg'>E-mail</label>
                                    <input type="text"
                                        id='email'
                                        value={profile?.email || ''}
                                        readOnly
                                        className='border border-gray-300 text-gray-600 rounded-[4px]  text-lg px-2 focus:outline-none' />
                                </div>

                                <div className='flex lg:justify-end justify-center'>

                                    <button
                                        type='submit'
                                        className='xl:mt-10 xl:mb-10 mb-5 w-[195px] rounded-2xl text-lg text-white font-semibold  py-2 bg-[#3F4870] disabled:bg-gray-400'
                                        disabled={!isDirty}
                                    >
                                        save
                                    </button>

                                </div>

                            </form>
                        </div>
                    </div>


                </div>
            )};
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    variant="filled"
                    sx={{
                        width: '100%',
                        '& .MuiAlert-filledSuccess': {
                            backgroundColor: '#4CAF50'
                        }
                    }}
                >
                </Alert>
            </Snackbar>
        </section>
    );
};

export default SProfile;