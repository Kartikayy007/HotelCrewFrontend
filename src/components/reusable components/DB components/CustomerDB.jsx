import React, { useState, useEffect, Suspense } from "react";
import { MoreVertical, Edit2, Trash2, Eye, X } from "lucide-react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';

const TableRowSkeleton = () => (
  <tr className="border-b">
    <td className="p-6">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={120} />
      </div>
    </td>
    <td className="p-4"><Skeleton variant="text" width={100} /></td>
    <td className="p-4"><Skeleton variant="text" width={80} /></td>
    <td className="p-4"><Skeleton variant="text" width={150} /></td>
    <td className="p-4"><Skeleton variant="text" width={80} /></td>
    <td className="p-4"><Skeleton variant="text" width={50} /></td>
    <td className="p-4"><Skeleton variant="circular" width={32} height={32} /></td>
  </tr>
);

function CustomerDB() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        setCustomers([
          {
            id: 1,
            name: "Jane Smith",
            phone: "9876543210",
            email: "jane.smith@example.com",
            room: "301",
            checkIn: "2024-03-20",
            checkOut: "2024-03-25",
            vipStatus: "VIP",
          },
          {
            id: 2,
            name: "John Doe",
            phone: "9876543211",
            email: "john.doe@example.com",
            room: "302",
            checkIn: "2024-03-21",
            checkOut: "2024-03-26",
            vipStatus: "Regular",
          },
          {
            id: 3,
            name: "Alice Johnson",
            phone: "9876543212",
            email: "alice.j@example.com",
            room: "303",
            checkIn: "2024-03-22",
            checkOut: "2024-03-27",
            vipStatus: "Regular",
          },
        ]);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleView = (id) => {
    console.log("Viewing customer:", id);
    setOpenMenuId(null);
  };

  const handleEdit = (id) => {
    console.log("Editing customer:", id);
    setOpenMenuId(null);
  };

  const getVipStatusColor = (status) => {
    return status === "VIP"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleMenuOpen = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="max-w-full mx-auto bg-white rounded-lg shadow-lg">
        <div className="max-h-[calc(100vh-260px)] overflow-auto">
          <table className="w-full rounded-tr-lg overflow-hidden">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b bg-[#252941] text-white">
                <th className="p-4 text-left font-semibold">Profile</th>
                <th className="p-4 text-left font-semibold">Contact</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Room</th>
                <th className="p-4 text-left font-semibold">Check-In</th>
                <th className="p-4 text-left font-semibold">Check-Out</th>
                <th className="pr-16 font-semibold " colspan="2">VIP Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                customers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-[#DEE8FF]" : "bg-[#E6EEF9]"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-md">
                          <img
                            src={`https://randomuser.me/api/portraits/${
                              index % 2 ? "women" : "men"
                            }/${customer.id}.jpg`}
                            alt={customer.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{customer.phone}</td>
                    <td className="p-4 text-gray-700">{customer.email}</td>
                    <td className="p-4 text-gray-700">{customer.room}</td>
                    <td className="p-4 text-gray-700">{customer.checkIn}</td>
                    <td className="p-4 text-gray-700">{customer.checkOut}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border  ${getVipStatusColor(
                          customer.vipStatus
                        )}`}
                      >
                        {customer.vipStatus}
                      </span>
                    </td>
                    <td className="p-4 relative">
                      <>
                        <button
                          onClick={(e) => handleMenuOpen(e, customer)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          transformOrigin={{horizontal: "right", vertical: "top"}}
                          anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                        >
                          <MenuItem
                            onClick={() => {
                              handleView(selectedCustomer?.id);
                              handleMenuClose();
                            }}
                          >
                            <ListItemIcon>
                              <Eye className="h-4 w-4" />
                            </ListItemIcon>
                            <ListItemText>View Details</ListItemText>
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              handleEdit(selectedCustomer?.id);
                              handleMenuClose();
                            }}
                          >
                            <ListItemIcon>
                              <Edit2 className="h-4 w-4" />
                            </ListItemIcon>
                            <ListItemText>Edit Booking</ListItemText>
                          </MenuItem>
                        </Menu>
                      </>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Suspense>
  );
}

export default CustomerDB;