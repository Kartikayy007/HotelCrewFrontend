import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';

export const CreateAnnouncementBox = ({ onClose, onSubmit, departments }) => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    department: 'all', 
    urgency: 'normal',
    description: ''
  });

  const [errors, setErrors] = useState({
    title: false,
    department: false,
    description: false
  });

  const handleSubmit = () => {
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

  const clearError = (field) => {
    setErrors(prev => ({...prev, [field]: false}));
  };

  return (
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
        <TextField
          label="Announcement Title"
          fullWidth
          variant="outlined"
          value={announcement.title}
          error={errors.title}
          helperText={errors.title && "Title is required"}
          onChange={(e) => {
            clearError('title');
            setAnnouncement({
              ...announcement,
              title: e.target.value
            });
          }}
          placeholder="Enter announcement title"
        />

        <FormControl fullWidth error={errors.department}>
          <InputLabel>Send To (Departments)</InputLabel>
          <Select
            value={announcement.department}
            label="Send To (Departments)"
            placeholder="All Departments"
            onChange={(e) => {
              clearError('department');
              const selectedValue = e.target.value;
              setAnnouncement({
                ...announcement,
                department: selectedValue
              });
            }}
            displayEmpty
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.value} value={dept.value}>
                {dept.label}
              </MenuItem>
            ))}
          </Select>
          {errors.department && (
            <FormHelperText>Please select a department</FormHelperText>
          )}
        </FormControl>

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
            <MenuItem value="normal">
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

        <TextField
          label="Announcement Message"
          fullWidth
          multiline
          rows={6}
          error={errors.description}
          helperText={errors.description && "Message is required"}
          value={announcement.description}
          onChange={(e) => {
            clearError('description');
            setAnnouncement({
              ...announcement,
              description: e.target.value
            });
          }}
          placeholder="Write your announcement message here..."
        />

        <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
          <Button
            variant="outlined"
            onClick={onClose}
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
  );
};