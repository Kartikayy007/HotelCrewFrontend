import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Fade,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import SmartTitleGenerator from '../../feature/SmartTitleGenerator';
import PredictiveTextArea from '../../feature/PredictiveTextArea';

export const CreateAnnouncementBox = ({ onClose, onSubmit, departments }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    department: 'All', 
    urgency: 'Normal',
    description: ''
  });

  const [errors, setErrors] = useState({
    title: false,
    department: false,
    description: false
  });

  const handleSubmit = () => {
    setFormSubmitted(true);
    const newErrors = {
      title: !announcement.title.trim(),
      department: !announcement.department,
      description: !announcement.description.trim()
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    onSubmit(announcement);
    onClose();
  };

  const tooltipStyle = {
    color: 'red',
    '& .MuiTooltip-tooltip': {
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      fontSize: '0.875rem'
    }
  };

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  // Add handleCancel function
  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  return (
    <Dialog 
      open={!isClosing} 
      onClose={handleClose}
      TransitionComponent={Fade}
      TransitionProps={{
        timeout: {
          enter: 300,
          exit: 200
        }
      }}
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(5px)",
          transition: "opacity 200ms ease-in-out, backdrop-filter 200ms ease-in-out",
        },
        TransitionComponent: Fade,
        transitionDuration: {
          enter: 300,
          exit: 200
        }
      }}
      PaperProps={{
        sx: {
          transform: 'none',
          transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
          opacity: isClosing ? 0 : 1,
          transform: isClosing ? 'scale(0.95) translateY(10px)' : 'none'
        }
      }}
    >
      <div className="p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            New Announcement
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create an announcement to notify departments
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Tooltip
              open={formSubmitted && !announcement.title.trim()}
              title="Title is required"
              arrow
              placement="top"
              sx={tooltipStyle}
            >
              <div className="w-full">
                <input 
                  type="text"
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  value={announcement.title}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter Title"
                
                />
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 ">
              <SmartTitleGenerator
                description={announcement.description}
                onTitleGenerated={(title) => setAnnouncement(prev => ({...prev, title}))}
                disabled={!announcement.description.trim()}
              />
              </div>
            </Tooltip>
          </div>

          <Tooltip
            open={formSubmitted && !announcement.department}
            title="Please select a department"
            arrow
            placement="top"
            sx={tooltipStyle}
          >
            <FormControl fullWidth>
              <InputLabel>Send To (Departments)</InputLabel>
              <Select
                value={announcement.department}
                label="Send To (Departments)"
                placeholder="All Departments"
                onChange={(e) => setAnnouncement({...announcement, department: e.target.value})}
                displayEmpty
              >
                <MenuItem value="All" default>All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

          <FormControl fullWidth>
            <InputLabel>Urgency Level</InputLabel>
            <Select
              value={announcement.urgency}
              label="Urgency Level"
              onChange={(e) => setAnnouncement({
                ...announcement,
                urgency: e.target.value
              })}
            >
              <MenuItem value="Normal">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                  Normal
                </span>
              </MenuItem>
              <MenuItem value="urgent">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                  Urgent
                </span>
              </MenuItem>
            </Select>
          </FormControl>

          <Tooltip
            open={formSubmitted && !announcement.description.trim()}
            title="Message is required"
            arrow
            placement="top"
            sx={tooltipStyle}
          >
            <div className="w-full relative">
              <PredictiveTextArea
                placeholder="Write your announcement message here..."
                value={announcement.description}
                onChange={(e) => {
                  const newDescription = e.target.value;
                  setAnnouncement(prev => ({
                    ...prev, 
                    description: newDescription
                  }));
                }}
                className="min-w-full min-h-[250px] p-3 border rounded-md focus:outline-none focus:border-blue-500 resize-none"
              />

              
              
            </div>
          </Tooltip>

          <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{borderColor: "#3A426F", color: "#3A426F"}}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#3A426F",
                "&:hover": {backgroundColor: "#3A426F"},
              }}
            >
              Post Announcement
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
