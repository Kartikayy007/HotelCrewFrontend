import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Box, Paper, Container } from '@mui/material';
import { Bell } from 'lucide-react';





const SSchedule = () => {
  return (
    <Box sx={{ bgcolor: '#e6e9ef', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Performance Chart */}
         
          {/* Announcement Section */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Bell size={24} color="#1976d2" style={{ marginRight: '8px' }} />
                  <Typography variant="h6">
                    Announcement Channel
                  </Typography>
                </Box>
                {[1, 2].map((i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderLeft: 4,
                      borderColor: 'primary.main'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      15 November 2024
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', my: 0.5 }}>
                      Important Announcement from Admin to All Staff
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We would like to inform you about something important happening at the XYZ Hotel.
                      The first important change is the...
                    </Typography>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Box>

          {/* Attendance Section */}
          <Box sx={{ flex: '1 1 300px' }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Attendance
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                  <CircularProgressWithLabel value={86} />
                  <Box sx={{ ml: 3 }}>
                    <Typography color="text.secondary">Attendance:</Typography>
                    <Typography variant="h5">120/300</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Leave Request Section */}
          <Box sx={{ flex: '1 1 600px' }}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Leave Request
                </Typography>
                <Typography variant="body1" paragraph>
                  I hope this message finds you well. I am writing to formally request leave from 
                  work for [number of days] starting from [start date] to [end date]. The reason 
                  for my absence would be due to personal reasons, medical reasons, or...
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status: Pending
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dates: 15/11/24 - 16/11/24
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: 2 days
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SSchedule;