// AnnouncementSection.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAnnouncements,
  selectAllAnnouncements,
  selectAnnouncementsLoading
} from '../../../redux/slices/AnnouncementSlice';
import { Dialog, DialogContent, DialogTitle, Skeleton } from '@mui/material';
import LoadingAnimation from '../../common/LoadingAnimation';

interface Announcement {
  id: number;
  title: string;
  description: string;
  department: string;
  urgency: string;
  created_at: string;
}

const AnnouncementSection: React.FC = () => {
  const dispatch = useDispatch();
  const announcements = useSelector(selectAllAnnouncements);
  const loading = useSelector(selectAnnouncementsLoading);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastAnnouncementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    dispatch(fetchAnnouncements(`?page=${page}`));
  }, [dispatch, page]);

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  return (
    <div className="bg-white h-96 rounded-lg shadow-lg flex flex-col">
    <div className="sticky top-0 z-20 bg-white/95    ">
      <h2 className="text-xl font-semibold p-4">
        Announcement Channel
      </h2>
    </div>
      
      {loading && page === 1 ? (
        <div className="flex-1 overflow-y-auto space-y-4 p-6 pt-2">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={100} className="rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto space-y-4 p-6 pt-2">
            {announcements.map((announcement: Announcement, index: number) => (
              <div
                key={announcement.id}
                ref={index === announcements.length - 1 ? lastAnnouncementRef : null}
                className={`p-4 rounded cursor-pointer hover:opacity-90 transition-all shadow bg-[#F1F6FC]
                `}
                onDoubleClick={() => handleAnnouncementClick(announcement)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${
                      announcement.urgency.toLowerCase() === 'Urgent' ? 'text-red-800' : ''
                    }`}>
                      {announcement.title}
                    </h3>
                    {announcement.urgency.toLowerCase() === 'Urgent' && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    announcement.urgency === 'Urgent' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {announcement.urgency}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2">
                  {announcement.description}
                </p>
                <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                  <span>{announcement.department}</span>
                  <span>{new Date(announcement.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          {loading && page > 1 && (
            <div className="flex justify-center py-4">
              <LoadingAnimation size={40} color="#3F4870" />
            </div>
          )}
        </>
      )}

      <Dialog
        open={Boolean(selectedAnnouncement)}
        onClose={() => setSelectedAnnouncement(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedAnnouncement && (
          <>
            <DialogTitle>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{selectedAnnouncement.title}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  selectedAnnouncement.urgency === 'High' ? 'bg-red-100 text-red-800' :
                  selectedAnnouncement.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {selectedAnnouncement.urgency}
                </span>
              </div>
            </DialogTitle>
            <DialogContent>
              <div className="mt-4">
                <p className="whitespace-pre-wrap">{selectedAnnouncement.description}</p>
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <span>Department: {selectedAnnouncement.department}</span>
                  <span>{new Date(selectedAnnouncement.created_at).toLocaleString()}</span>
                </div>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default AnnouncementSection;