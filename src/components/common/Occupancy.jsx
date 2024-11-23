import React, { useState } from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import { 
  Menu, 
  MenuItem, 
  Typography, 
  Box,
  Tooltip 
} from '@mui/material';
import { pad } from 'crypto-js';

function HotelOccupancyHeatmap() {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  // Change length to 5 rows
  const weekLabels =  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayLabels = Array.from({length: 4}, (_, i) => ``);

  const generateOccupancyData = () => {
    return weekLabels.map(() => 
      dayLabels.map(() => {
        const seasonalVariation = Math.sin(Math.random() * Math.PI) * 20;
        return Math.min(Math.max(
          Math.floor(50 + seasonalVariation + (Math.random() * 20 - 10)), 
          30), 
          95
        );
      })
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const occupancyData = generateOccupancyData();

  const handleCellClick = (x, y, event) => {
    setAnchorEl(event.currentTarget);
    setSelectedCell({ x, y });
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCell(null);
  };

  const renderCellDetails = () => {
    if (!selectedCell) return null;

    const dayOfWeek = dayLabels[selectedCell.x];
    const week = weekLabels[selectedCell.y];
    const occupancy = occupancyData[selectedCell.y][selectedCell.x];
    const cellDate = new Date(startOfYear);
    cellDate.setDate(startOfYear.getDate() + (selectedCell.y * 7) + selectedCell.x);

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Occupancy Details
            </Typography>
            <Typography>Date: {cellDate.toDateString()}</Typography>
            <Typography>Day: {dayOfWeek}</Typography>
            <Typography>{week}</Typography>
            <Typography>Occupancy: {occupancy}%</Typography>
          </Box>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0px'
    }}>
      <Box sx={{ maxWidth: '1000px', width: '100%' }}>
        <HeatMapGrid
          data={occupancyData}
          xLabels={dayLabels}
          yLabels={weekLabels}
          cellRender={(x, y, value) => {
            const cellDate = new Date(startOfYear);
            cellDate.setDate(startOfYear.getDate() + (y * 7) + x);
            
            return (
              <Tooltip 
                title={`Date: ${cellDate.toDateString()}
                Occupancy: ${value}%`}
                arrow
              >
                <div style={{ 
                  color: value > 80 ? 'white' : 'black',
                  fontSize: '0rem',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {}%
                </div>
              </Tooltip>
            );
          }}
          xLabelsStyle={() => ({
            color: "#777",
            fontSize: "0",
            textTransform: "uppercase"
          })}
          yLabelsStyle={() => ({
            fontSize: "1rem",
            paddingBottom: "1.5rem",
            color: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          })}
          cellStyle={(_x, _y, ratio) => ({
            background: ratio === 0 
                ? 'rgba(62, 72, 112, 0.1)' 
                : `rgba(62, 72, 112, ${ratio})`,
            width: "85%",
            borderRadius: "14px", // Increased from 3px
            height: "75%", // Reduced from 80%
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: 'pointer',
            margin: "10px", // Added margin for gaps
        })}
          cellHeight="4rem"
          xLabelsPos="top"
          yLabelsPos="center"
          onClick={handleCellClick}
          square
        />
        {renderCellDetails()}
      </Box>
    </Box>
  );
}

export default HotelOccupancyHeatmap;