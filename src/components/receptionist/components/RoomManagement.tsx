import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider, Skeleton } from '@mui/material';
import { fetchCustomers, selectCustomers } from '../../../redux/slices/customerSlice';
import { selectHotelDetails } from '../../../redux/slices/HotelDetailsSlice';
import { checkoutGuest } from '../../../redux/slices/checkoutSlice';

interface Guest {
  id: number;
  profile?: string;
  name?: string;
  contactNumber?: string;
  phone_number?: string;
  email: string;
  room?: string[];
  room_no?: string | number;
  roomType?: string;
  room_type?: string;
  checkIn?: string;
  check_in_time?: string;
  checkOut?: string;
  check_out_time?: string;
  vipStatus?: string;
  status?: string;
}

interface RoomDialogProps {
  rooms: { room: string; type: string }[];
  open: boolean;
  onClose: () => void;
}

const SkeletonRow = () => (
  <tr>
    {[...Array(8)].map((_, index) => (
      <td key={index} className="p-4"><Skeleton variant="text" width={150} /></td>
    ))}
  </tr>
);

const RoomManagement = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const hotelDetails = useSelector(selectHotelDetails);
  const [loading, setLoading] = useState(true);
  
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<{ room: string; type: string }[]>([]);
  const [checkoutConfirm, setCheckoutConfirm] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState(null);

  const [customerType, setCustomerType] = useState('All');
  const [roomType, setRoomType] = useState('All');
  const [stayDuration, setStayDuration] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [roomTypeOptions, setRoomTypeOptions] = useState(['All']);

  useEffect(() => {
    dispatch(fetchCustomers()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (hotelDetails?.room_types) {
      const types = ['All', ...hotelDetails.room_types.map(rt => rt.room_type)];
      setRoomTypeOptions(types);
    }
  }, [hotelDetails]);

  const filterCustomers = (data: Guest[]) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data.filter(guest => {
      const profile = (guest.profile || guest.name || '').toLowerCase();
      const email = (guest.email || '').toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      const matchesSearch = searchQuery === '' || 
        profile.includes(searchLower) || 
        email.includes(searchLower);

      const vipStatus = guest.vipStatus || guest.status || 'REGULAR';
      const matchesCustomerType = customerType === 'All' ? true :
        customerType === 'VIP' ? vipStatus === 'VIP' : vipStatus === 'REGULAR';

      const matchesRoomType = roomType === 'All' ? true : 
        (guest.roomType || guest.room_type) === roomType;

      const checkInDate = new Date(guest.checkIn || guest.check_in_time || Date.now());
      const checkOutDate = guest.checkOut === 'NA' || !guest.checkOut 
        ? new Date() 
        : new Date(guest.checkOut || guest.check_out_time || Date.now());
      
      const stayDays = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      const matchesStayDuration = stayDuration === 'All' ? true :
        (stayDuration === '1-3' && stayDays <= 3) ||
        (stayDuration === '4-7' && stayDays > 3 && stayDays <= 7) ||
        (stayDuration === '8+' && stayDays > 7);

      return matchesSearch && matchesCustomerType && matchesRoomType && matchesStayDuration;
    });
  };

  const FiltersSection = () => (
    <div className="filters flex justify-start md:justify-center mb-5">
      <div className="filter-buttons flex flex-col lg:flex-row gap-2 items-center w-full max-w-7xl">
        <h1 className="text-2xl font-medium space-nowrap text-start lg:block hidden">
          Filters
        </h1>

        <div className="flex-1 w-full mx-8 relative overflow-x-auto">
          <div className="scroll-container flex gap-2 overflow-x-auto hide-scrollbar w-full">
            <select
              className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full"
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
            >
              <option value="All">Customer Type</option>
              <option value="REGULAR">Regular</option>
              <option value="VIP">VIP</option>
            </select>
            <select
              className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              {roomTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'Room Type' : type}
                </option>
              ))}
            </select>
            <select
              className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full"
              value={stayDuration}
              onChange={(e) => setStayDuration(e.target.value)}
            >
              <option value="All">Stay Duration</option>
              <option value="1-3">1-3 Days</option>
              <option value="4-7">4-7 Days</option>
              <option value="8+">8+ Days</option>
            </select>
          </div>
        </div>

        <div className="relative lg:w-2/6 w-full">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#F1F6FC] hover:bg-gray-300 w-full text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC]" />
        </div>
      </div>
    </div>
  );

  const filteredData = filterCustomers(customers);

  const handleRowDoubleClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setOpenDialog(true);
  };

  const handleRoomClick = (rooms: string[], roomType: string) => {
    const roomsWithTypes = rooms.map(room => ({
      room,
      type: roomType
    }));
    setSelectedRooms(roomsWithTypes);
    setOpenRoomDialog(true);
  };

  const handleCheckout = async () => {
    if (selectedGuest?.id) {
      const result = await dispatch(checkoutGuest(selectedGuest.id));
      if (checkoutGuest.fulfilled.match(result)) {
        setCheckoutDetails(result.payload);
        setCheckoutConfirm(true);
      }
    }
  };

  const confirmCheckout = () => {
    console.log('Checking out guest:', selectedGuest);
    setCheckoutConfirm(false);
    setOpenDialog(false);
  };

  const RoomDialog: React.FC<RoomDialogProps> = ({ rooms, open, onClose }) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          borderRadius: '8px'
        }
      }}
    >
      <DialogTitle>All Rooms</DialogTitle>
      <DialogContent>
        <div className="flex flex-wrap gap-3 p-4">
          {rooms.map((room, idx) => (
            <div key={idx} className="bg-gray-200 px-4 py-2 rounded-full">
              <span>Room {room.room}</span>
              <span className="text-gray-600 ml-2">({room.type})</span>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined"
          sx={{
            borderColor: '#252941',
            color: '#252941',
            '&:hover': {
              borderColor: '#4A5899',
              backgroundColor: '#F1F6FC'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
      <div className="w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] 2xl:w-[80vw]">
        <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12 text-[#252941] mb-2">Room Management</h1>

        <FiltersSection />

        <section className="w-full overflow-x-scroll bg-white rounded-lg shadow-lg ">
          <div className="max-h-[calc(100vh-260px)]">
            <table className="w-full rounded-tr-lg overflow-scroll">
              <thead className="sticky top-0 bg-[#252941] shadow-sm z-20">
                <tr className="border-b text-white">
                  <th className="p-4 text-left font-semibold">Profile</th>
                  <th className="p-4 text-center font-semibold">Contact</th>
                  <th className="p-4 text-center font-semibold">Email</th>
                  <th className="p-4 text-center font-semibold">Rooms</th>
                  <th className="p-4 text-center font-semibold">Room Type</th>
                  <th className="p-4 text-center font-semibold">Check In</th>
                  <th className="p-4 text-center font-semibold">Check Out</th>
                  <th className="p-4 text-center font-semibold rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, index) => <SkeletonRow key={index} />)
                ) : filteredData.length > 0 ? (
                  filteredData.map((guest, index) => (
                    <tr
                      key={guest.id}
                      className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-[#DEE8FF]" : "bg-[#E6EEF9]"}`}
                      onDoubleClick={() => handleRowDoubleClick(guest)}
                    >
                      <td className="p-4 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{guest.profile || guest.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">{guest.contactNumber || guest.phone_number || 'N/A'}</td>
                      <td className="p-4 text-center">{guest.email || 'N/A'}</td>
                      <td className="p-4 text-center">
                        {Array.isArray(guest.room) 
                          ? guest.room.join(', ') 
                          : (guest.room_no || 'N/A')}
                      </td>
                      <td className="p-4 text-center">{guest.roomType || guest.room_type || 'N/A'}</td>
                      <td className="p-4 text-center">
                        {formatDateTime(guest.checkIn || guest.check_in_time)}
                      </td>
                      <td className="p-4 text-center">
                        {formatDateTime(guest.checkOut || guest.check_out_time)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          (guest.vipStatus || guest.status) === 'VIP' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {guest.vipStatus || guest.status || 'REGULAR'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center">
                      {loading ? 'Loading...' : 'No results found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Rest of the dialogs remain the same */}
      <RoomDialog
        rooms={selectedRooms}
        open={openRoomDialog}
        onClose={() => setOpenRoomDialog(false)}
      />

      {/* Guest Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '8px'
          }
        }}
      >
        <DialogTitle className="bg-[#252941] text-white">
          Guest Details
        </DialogTitle>
        <DialogContent className="mt-4">
          {selectedGuest && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" className="font-medium">
                  {selectedGuest.profile || selectedGuest.name || 'Unknown'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Contact Number
                </Typography>
                <Typography>
                  {selectedGuest.contactNumber || selectedGuest.phone_number || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography>{selectedGuest.email || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Room Details
                </Typography>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(selectedGuest.room) ? (
                    selectedGuest.room.map((room, idx) => (
                      <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full">
                        Room {room}
                      </span>
                    ))
                  ) : (
                    <span className="bg-gray-200 px-3 py-1 rounded-full">
                      Room {selectedGuest.room_no || 'N/A'}
                    </span>
                  )}
                </div>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Room Type
                </Typography>
                <Typography>
                  {selectedGuest.roomType || selectedGuest.room_type || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Check In
                </Typography>
                <Typography>
                  {formatDateTime(selectedGuest.checkIn || selectedGuest.check_in_time)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Check Out
                </Typography>
                <Typography>
                  {formatDateTime(selectedGuest.checkOut || selectedGuest.check_out_time)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Typography>
                  {selectedGuest.vipStatus || selectedGuest.status || 'Regular'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            sx={{
              borderColor: '#252941',
              color: '#252941',
              '&:hover': {
                borderColor: '#4A5899',
                backgroundColor: '#F1F6FC'
              }
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            sx={{
              backgroundColor: '#252941',
              '&:hover': {
                backgroundColor: '#1A1F35'
              }
            }}
          >
            Check Out
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={checkoutConfirm} onClose={() => setCheckoutConfirm(false)}>
        <DialogTitle>Checkout Summary</DialogTitle>
        <DialogContent>
          {checkoutDetails && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>
                  Customer has been successfully checked out.
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Stay Duration
                </Typography>
                <Typography>
                  {checkoutDetails.stay_duration_days} days
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Final Price
                </Typography>
                <Typography>
                  ${checkoutDetails.final_price}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setCheckoutConfirm(false);
              setOpenDialog(false);
              dispatch(fetchCustomers());  
            }}
            variant="contained"
            sx={{
              backgroundColor: '#252941',
              '&:hover': {
                backgroundColor: '#1A1F35'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default RoomManagement;