import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical, Edit2, Eye } from "lucide-react";
import { Menu, MenuItem, ListItemIcon, ListItemText, Skeleton, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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
  const { customers, loading, count } = useSelector((state) => state.customers);
  const [page, setPage] = React.useState(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchCustomers(1))  }, [dispatch, page]);


  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <section className="w-full bg-white rounded-lg shadow-lg">
        <div className="max-h-[calc(100vh-260px)] overflow-auto">
          <table className="w-full rounded-tr-lg overflow-hidden">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b bg-[#252941] text-white">
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">Phone</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Room No</th>
                <th className="p-4 text-left font-semibold">Room Type</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Price</th>
                <th className="p-4 text-left font-semibold">Check-In</th>
                <th className="p-4 text-left font-semibold">Check-Out</th>
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
                    <td className="p-4 text-gray-700">{customer.room_no}</td>
                    <td className="p-4 text-gray-700">{customer.room_type}</td>
                    <td className="p-4 text-gray-700">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        customer.status === 'VIP' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">${customer.price}</td>
                    <td className="p-4 text-gray-700">
                      {new Date(customer.check_in_time).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-700">
                      {new Date(customer.check_out_time).toLocaleString()}
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-center">
          <Pagination 
            count={Math.ceil(count / 10)} 
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton 
            showLastButton
          />
        </div>
      </section>

      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="border-b pb-2">
          Customer Details
        </DialogTitle>
        <DialogContent className="mt-4">
          {selectedCustomer && (
            <div className="space-y-6 py-2">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Name</h3>
                <p className="text-gray-900">{selectedCustomer.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
                <p className="text-gray-900">Phone: {selectedCustomer.phone_number}</p>
                <p className="text-gray-900">Email: {selectedCustomer.email}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Room Details</h3>
                <p className="text-gray-900">Room No: {selectedCustomer.room_no}</p>
                <p className="text-gray-900">Room Type: {selectedCustomer.room_type}</p>
                <p className="text-gray-900">Price: ${selectedCustomer.price}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Booking Period</h3>
                <p className="text-gray-900">Check-in: {new Date(selectedCustomer.check_in_time).toLocaleString()}</p>
                <p className="text-gray-900">Check-out: {new Date(selectedCustomer.check_out_time).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedCustomer.status === 'VIP' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedCustomer.status}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CustomerDB;
