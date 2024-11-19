import React, { useState } from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import { 
  Menu, 
  MenuItem, 
  Typography, 
  Box,
  Tooltip 
} from '@mui/material';

function HotelOccupancyHeatmap() {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const weekLabels = Array.from({length: 13.04}, (_, i) => `Week${i + 1}`);
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    <Box>
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
                {value}%
              </div>
            </Tooltip>
          );
        }}
        xLabelsStyle={() => ({
          color: "#777",
          fontSize: ".7rem",
          textTransform: "uppercase"
        })}
        yLabelsStyle={() => ({
          fontSize: "1rem",
          color: "#777",
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: ratio === 0 
          ? 'rgba(63, 72, 112, 0.1)' 
          : `rgba(63, 72, 112, ${ratio})`,
          width: "90%",
          borderRadius: "3px",
          height: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: 'pointer'
        })}
        cellHeight="3.3rem"
        xLabelsPos="top"
        yLabelsPos="center"
        onClick={handleCellClick}
      />
      {renderCellDetails()}
    </Box>
  );
}

export default HotelOccupancyHeatmap;