import * as React from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, Button } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SideBarClass from '../../components/class/SideBarClass';
import GeneralClass from './GeneralClass';


function HomeClass() {
    return (
        <Box sx={styles.container}>
            <SideBarClass />
            <Routes sx={{ width: "100%" }}>
                <Route path="/" element={<Navigate to="/class/general" />} /> 
                <Route path="/general" element={<GeneralClass />} />  
                <Route path="/gradles" element={<GeneralClass />} />  
            </Routes>
        </Box>
    )
}

export default HomeClass;

const styles = {
    container: {
        display: "flex",
        height: "100%",
        width: "100%",
    }
}