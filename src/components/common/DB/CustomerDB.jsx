import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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

const NoResults = () => (
  <tr>
    <td colSpan="9" className="text-center p-8">
      <div className="flex flex-col items-center justify-center text-gray-500">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">No matching results found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    </td>
  </tr>
);

function CustomerDB({ searchTerm = "", filters }) {
  const dispatch = useDispatch();
  const { customers = [], loading } = useSelector((state) => state.customers);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const handleDialogOpen = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCustomer(null);
  };

  if (loading) {
    return (
      <section className="w-full bg-white rounded-lg shadow-lg">
        <div className="max-h-[calc(100vh-260px)] overflow-auto">
          <table className="w-full rounded-tr-lg overflow-hidden">
            <tbody>
              {[...Array(5)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  const customersList = Array.isArray(customers) ? customers : [];

  const filteredCustomers = customersList.filter(customer => {
    // Search filter
    const searchMatch = !searchTerm || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone_number.includes(searchTerm);

    // Customer type filter
    const typeMatch = filters.customerType === "All" || 
      customer.status === filters.customerType;

    // Room type filter
    const roomTypeMatch = filters.roomType === "All" ||
      customer.room_type === filters.roomType;

    return searchMatch && typeMatch && roomTypeMatch;
  });

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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
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
              ) : (
                <NoResults />
              )}
            </tbody>
          </table>
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
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CustomerDB;
