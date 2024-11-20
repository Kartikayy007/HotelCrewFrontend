import React from 'react'
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const MSettings = () => {
  const initialDayShiftStaff = [
    { id:1, name: "Alice bilu", department: "Reception" },
    { id:2, name: "Anu", department: "Reception" },
    {id:3,  name: "Andy", department: "Reception" },
    { id:4, name: "Abhi", department: "Reception" },
    { id:5, name: "Bob", department: "Kitchen" },
    { id:6, name: "Charlie", department: "Housekeeping" },
    { id:7, name: "Chiku", department: "Maintainence" },
    { id:8, name: "David", department: "Security" },
    { id:9, name: "Roger", department: "Security" },
    { id:10, name: "Kaur", department: "Parking" },
    { id:11, name: "Dope", department: "Parking" },
    {id:12,  name: "Dark", department: "Security" },
    { id:13, name: "Wild", department: "Security" },
    { id:14, name: "Duck", department: "Security" },
    { id:15, name: "Puck", department: "Security" },
    { id:16, name: "Muck", department: "Security" },
    { id:17, name: "Chuck", department: "Security" },
    { id:18, name: "Diljeet", department: "Security" },
    { id:19, name: "Hitler", department: "Security" },
    { id:20, name: "crunchy", department: "Security" },
  ];

  return (
    <div>Settings</div>
  )
}

export default MSettings