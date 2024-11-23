import React, { useState, useEffect } from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
import { Menu, MenuItem, Typography, Box, Tooltip, useTheme, useMediaQuery } from '@mui/material';

function HotelOccupancyHeatmap() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
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

  const getCellDimensions = () => {
    if (isMobile) return "2.5rem";
    if (isTablet) return "3rem";
    return "4rem";
  };

  const getFontSize = () => {
    if (isMobile) return "0.75rem";
    if (isTablet) return "0.875rem";
    return "1rem";
  };

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: { xs: '0.5rem', sm: '1rem', md: '1.5rem' }
    }}>
      <Box sx={{ 
        width: '100%',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.2)',
          borderRadius: '4px',
        }
      }}>
        <HeatMapGrid
          data={occupancyData}
          xLabels={dayLabels}
          yLabels={weekLabels}
          cellRender={(x, y, value) => {
            const cellDate = new Date(startOfYear);
            cellDate.setDate(startOfYear.getDate() + (y * 7) + x);
            
            return (
              <Tooltip 
                title={`Date: ${cellDate.toDateString()}\nOccupancy: ${value}%`}
                arrow
              >
                <div style={{ 
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} />
              </Tooltip>
            );
          }}
          xLabelsStyle={() => ({
            display: 'none'
          })}
          yLabelsStyle={() => ({
            fontSize: getFontSize(),
            paddingBottom: { xs: '0.5rem', sm: '1rem', md: '1.5rem' },
            color: 'black',
            whiteSpace: 'nowrap'
          })}
          cellStyle={(_x, _y, ratio) => ({
            background: ratio === 0 
              ? 'rgba(62, 72, 112, 0.1)' 
              : `rgba(62, 72, 112, ${ratio})`,
            width: "85%",
            height: "75%",
            borderRadius: { xs: '8px', sm: '10px', md: '14px' },
            cursor: 'pointer',
            margin: { xs: '4px', sm: '6px', md: '10px' },
          })}
          cellHeight={getCellDimensions()}
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