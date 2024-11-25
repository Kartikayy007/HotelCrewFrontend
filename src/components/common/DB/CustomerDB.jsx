import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical, Edit2, Eye } from "lucide-react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import { fetchCustomers } from '../../../redux/slices/customerSlice';

const TableRowSkeleton = () => (
  <tr className="border-b">
    <td className="p-4"><Skeleton variant="text" width={150} /></td>
    <td className="p-4"><Skeleton variant="text" width={100} /></td>
    <td className="p-4"><Skeleton variant="text" width={150} /></td>
    <td className="p-4"><Skeleton variant="text" width={80} /></td>
    <td className="p-4"><Skeleton variant="text" width={150} /></td>
    <td className="p-4"><Skeleton variant="text" width={150} /></td>
    <td className="p-4"><Skeleton variant="text" width={80} /></td>
  </tr>
);

function CustomerDB() {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.customers);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleMenuOpen = (event, customer) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomer(customer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomer(null);
  };

  const handleView = (id) => {
    console.log("Viewing customer:", id);
    handleMenuClose();
  };

  const handleEdit = (id) => {
    console.log("Editing customer:", id);
    handleMenuClose();
  };

  return (
    <section className="w-full bg-white rounded-lg shadow-lg">
      <div className="max-h-[calc(100vh-260px)] overflow-auto">
        <table className="w-full rounded-tr-lg overflow-hidden">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b bg-[#252941] text-white">
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Phone</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Room</th>
              <th className="p-4 text-left font-semibold">Check-In</th>
              <th className="p-4 text-left font-semibold">Check-Out</th>
              <th className="p-4 text-left font-semibold">Price</th>
              <th className="p-4"></th>
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
                  <td className="p-4 text-gray-700">{customer.name}</td>
                  <td className="p-4 text-gray-700">{customer.phone_number}</td>
                  <td className="p-4 text-gray-700">{customer.email}</td>
                  <td className="p-4 text-gray-700">{customer.room}</td>
                  <td className="p-4 text-gray-700">
                    {new Date(customer.check_in_time).toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700">
                    {new Date(customer.check_out_time).toLocaleString()}
                  </td>
                  <td className="p-4 text-gray-700">${customer.price}</td>
                  <td className="p-4 relative">
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
                        onClick={() => handleView(selectedCustomer?.id)}
                      >
                        <ListItemIcon>
                          <Eye className="h-4 w-4" />
                        </ListItemIcon>
                        <ListItemText>View Details</ListItemText>
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleEdit(selectedCustomer?.id)}
                      >
                        <ListItemIcon>
                          <Edit2 className="h-4 w-4" />
                        </ListItemIcon>
                        <ListItemText>Edit Booking</ListItemText>
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CustomerDB;
