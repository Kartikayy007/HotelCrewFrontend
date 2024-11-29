import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle } from '@mui/material';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnouncements, selectAllAnnouncements } from '../../redux/slices/AnnouncementSlice';
import LoadingAnimation from './LoadingAnimation';

export const AllAnnouncementsDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const announcements = useSelector(selectAllAnnouncements);

  useEffect(() => {
    if (open) {
      loadAnnouncements(1);
    }
  }, [open]);

  const loadAnnouncements = async (pageNum) => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      const response = await dispatch(
        fetchAnnouncements(`?page=${pageNum}`)
      ).unwrap();
      
      setHasMore(response.next !== null);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadAnnouncements(page + 1);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md" 
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="p-0 font-bold">All Announcements</DialogTitle>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div 
          ref={containerRef}
          className="max-h-[60vh] overflow-y-auto space-y-4"
          onScroll={handleScroll}
        >
          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg 
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5}
                  d="M19 5h-2a3 3 0 01-3-3H8a3 3 0 00-3 3H3a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2zM8 14h8M8 10h8"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Announcements Found
              </h3>
              <p className="text-gray-500 text-center max-w-sm">
                There are no announcements available at the moment.
              </p>
            </div>
          ) : (
            <>
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border-b border-gray-200 p-4 last:border-0 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                        {announcement.department}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2">{announcement.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">By: {announcement.assigned_by}</p>
                    <p className="text-sm text-gray-500">Urgency: {announcement.urgency}</p>
                    <p className="text-sm text-gray-500">Hotel: {announcement.hotel}</p>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer">
                        Assigned To ({announcement.assigned_to?.length || 0})
                      </summary>
                      <ul className="mt-1 ml-4 text-sm text-gray-500">
                        {(announcement.assigned_to || []).map((person, idx) => (
                          <li key={idx}>{person}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-center p-4">
                  <LoadingAnimation size={24} color="#3A426F" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};