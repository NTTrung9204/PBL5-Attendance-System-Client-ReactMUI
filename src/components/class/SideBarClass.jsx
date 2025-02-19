import * as React from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Group as GroupIcon, Assignment as AssignmentIcon, Height, BorderRight } from '@mui/icons-material';
import { useState } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function SideBarClass() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={styles.container}>
            <Button sx={styles.back}>
                <ArrowBackIosNewIcon />
                <Typography sx={styles.back_text}>All teams</Typography>
            </Button>
            <Box
                sx={styles.logo}
                component="img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJJn_M4YE94nJAMecjnQ73VEvuP0OQSZUUgw&s"
                alt="Random"
            />
            <Box sx={styles.flex_title_dots}>
                <Typography sx={styles.title}>Group_PBL5 - Du an ky thuat may tinh</Typography>
                <Button
                    sx={styles.dots}
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreHorizIcon />
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                </Menu>
            </Box>
            <Box>
                <List>
                    <ListItem sx={styles.itemNavBar} button component={Link} to="/class/general">
                        <ListItemText primary="General" sx={{ color: 'white' }} />
                    </ListItem>

                    <ListItem sx={styles.itemNavBar} button component={Link} to="/class/gradles">
                        <ListItemText primary="Gradles" sx={{ color: 'white' }} />
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default SideBarClass;

const styles = {
    container: {
        width: "30%",
        height: "100%",
        backgroundColor: "#444444",
        padding: "20px",
        borderRight: "2px solid #666666",
    },
    back: {
        color: "#EEEEEE",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
        "&:hover": {
          color: "#6699FF",    
          cursor: "pointer",        
        },
    },
    back_text: {

    },
    logo: {
        width: "100px",
        margin: "20px 0px"
    },
    flex_title_dots: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    title: {
        color: "#ffffff",
        fontSize: "30px",
        maxWidth: "calc(100% - 80px)",
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis"
    },
    dots: {
        color: "white",
        border: "none",
    },
    itemNavBar: {
        "&:hover": {
          backgroundColor: "#777777",    
          cursor: "pointer",        
        },
    },
}