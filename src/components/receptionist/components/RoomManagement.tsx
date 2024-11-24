  import React, { useState, useRef } from 'react';
  import { Search } from 'lucide-react';
  import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid, Divider } from '@mui/material';

  interface Guest {
    profile: string;
    contactNumber: string;
    email: string;
    room: string[];
    roomType: string;
    checkIn: string;
    checkOut: string;
    vipStatus: string;
  }

  interface RoomDialogProps {
    rooms: { room: string; type: string }[];
    open: boolean;
    onClose: () => void;
  }

  const RoomManagement = () => {
    const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openRoomDialog, setOpenRoomDialog] = useState(false);
    const [selectedRooms, setSelectedRooms] = useState<{ room: string; type: string }[]>([]);
    const [checkoutConfirm, setCheckoutConfirm] = useState(false);

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

    const handleCheckout = () => {
      setCheckoutConfirm(true);
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
          <Button onClick={onClose}variant="outlined"
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

    const roomData = [
      {
        profile: "Arjun Gupta",
        contactNumber: "9823423423",
        email: "arjungupta@gmail.com",
        room: ["406", "407", "408", "409"],
        roomType: "Single Room",
        checkIn: "11/11/24",
        checkOut: "NA",
        vipStatus: "VIP"
      },
      {
        profile: "Shreya Rai",
        contactNumber: "8923423443",
        email: "shreyarai@gmail.com",
        room: ["502"],
        roomType: "Double Room",
        checkIn: "09/11/24",
        checkOut: "NA",
        vipStatus: "----"
      },
      {
        profile: "Arjun Gupta",
        contactNumber: "8284234234",
        email: "arjungupta@gmail.com",
        room: ["601", "602", "603"],
        roomType: "Suite",
        checkIn: "07/11/24",
        checkOut: "10/11/24",
        vipStatus: "VIP"
      },
      {
        profile: "Shreya Rai",
        contactNumber: "8234723467",
        email: "shreyarai@gmail.com",
        room: ["506"],
        roomType: "Single Room",
        checkIn: "04/11/24",
        checkOut: "08/11/24",
        vipStatus: "----"
      },
      {
        profile: "Arjun Gupta",
        contactNumber: "8763254623",
        email: "arjungupta@gmail.com",
        room: ["702"],
        roomType: "Double Room",
        checkIn: "03/11/24",
        checkOut: "04/11/24",
        vipStatus: "----"
      }
    ];

    return (
      <section className="bg-[#E6EEF9] h-full w-full overflow-scroll p-2 sm:p-4">
        <div className="w-[95vw] sm:w-[95vw] md:w-[95vw] lg:w-[95vw] xl:w-[95vw] 2xl:w-[80vw]">
          <h1 className="text-3xl font-semibold p-3 sm:p-4 lg:ml-8 ml-12 text-[#252941] mb-2">Room Management</h1>

        <div className="filters flex justify-start md:justify-center mb-5">
          <div className="filter-buttons flex flex-col lg:flex-row gap-2 items-center w-full max-w-7xl">
            <h1 className="text-2xl font-medium space-nowrap text-start lg:block hidden">
              Filters
            </h1>

            <div
              className="flex-1 w-full mx-8 relative overflow-x-auto"
            >

              <div
                className="scroll-container flex gap-2 overflow-x-auto hide-scrollbar w-full"
              >
                <>
                  <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full ">
                    <option value="All">Customer Type</option>
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                  </select>
                  <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full border-2 mr-2 ">
                    <option value="All">Room Type</option>
                    <option value="Single">Single Room</option>
                    <option value="Double">Double Room</option>
                    <option value="Suite">Suite</option>
                  </select>
                  <select className="filter1 bg-[#F1F6FC] hover:bg-gray-300 text-[#5663AC] font-medium py-2 px-4 rounded-full border-2 mr-2">
                    <option value="All">Stay Duration</option>
                    <option value="1-3">1-3 Days</option>
                    <option value="4-7">4-7 Days</option>
                    <option value="8+">8+ Days</option>
                  </select>
                </>
              </div>

            </div>

            <div className="relative lg:w-2/6 w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#F1F6FC] hover:bg-gray-300 w-full text-[#5663AC] font-medium py-2 px-4 rounded-2xl border-2 border-[#B7CBEA] pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5663AC]" />
              </div>
          </div>
        </div>

        <section className="w-full overflow-x-scroll bg-white rounded-lg shadow-lg ">
        <div className="max-h-[calc(100vh-260px)]">
          <table className="w-full rounded-tr-lg overflow-scroll">
            <thead className="sticky top-0 bg-[#252941] shadow-sm z-20">
              <tr className="border-b text-white">
                  <th className="p-4 text-left font-semibold">Profile</th>
                  <th className="p-4 text-left font-semibold ">Contact</th>
                  <th className="p-4 text-left font-semibold ">Email</th>
                  <th className="p-4 text-left font-semibold">Room</th>
                  <th className="p-4 text-left font-semibold">Type</th>
                  <th className="p-4 text-left font-semibold ">Check In</th>
                  <th className="p-4 text-left font-semibold ">Check Out</th>
                  <th className="p-4 text-left font-semibold rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {roomData.map((guest: Guest, index) => (
                  <tr
                    key={index}
                    className={`border-b hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-[#DEE8FF]" : "bg-[#E6EEF9]"
                      }`}
                    onDoubleClick={() => handleRowDoubleClick(guest)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{guest.profile}</span>
                      </div>
                    </td>
                    <td className="p-4">{guest.contactNumber}</td>
                    <td className="p-4">{guest.email}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {guest.room.slice(0, 2).map((room, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-200 px-2 py-1 rounded-full text-xs"
                          >
                            {room}
                          </span>
                        ))}
                        {guest.room.length > 2 && (
                          <span
                            className="bg-gray-200 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-gray-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRoomClick(guest.room, guest.roomType);
                            }}
                          >
                            +{guest.room.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{guest.roomType}</td>
                    <td className="p-4 ">{guest.checkIn}</td>
                    <td className="p-4">{guest.checkOut}</td>
                    <td className="p-4">{guest.vipStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

        <RoomDialog
          rooms={selectedRooms}
          open={openRoomDialog}
          onClose={() => setOpenRoomDialog(false)}
        />

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
                    {selectedGuest.profile}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Contact Number
                  </Typography>
                  <Typography>{selectedGuest.contactNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email
                  </Typography>
                  <Typography>{selectedGuest.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Room Details
                  </Typography>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedGuest.room.map((room, idx) => (
                      <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full">
                        Room {room}
                      </span>
                    ))}
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Room Type
                  </Typography>
                  <Typography>{selectedGuest.roomType}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Check In
                  </Typography>
                  <Typography>{selectedGuest.checkIn}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Check Out
                  </Typography>
                  <Typography>{selectedGuest.checkOut}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    VIP Status
                  </Typography>
                  <Typography>{selectedGuest.vipStatus}</Typography>
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
              variant="contained"
              onClick={handleCheckout}
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
          <DialogTitle>Confirm Checkout</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to check out {selectedGuest?.profile}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCheckoutConfirm(false)}
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
              onClick={confirmCheckout}
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
      </section>
    );
  };

  export default RoomManagement;