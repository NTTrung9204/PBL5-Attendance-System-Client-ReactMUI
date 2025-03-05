import { Box } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { memo } from "react";
import MenuButton from "./MenuButton";
import Tooltip from '@mui/material/Tooltip';
import { stringAvatar } from "../utils/helper"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom"

function Card({groupTeamName}) {
    const navigate = useNavigate();

    const menuItemsList = [
        {
            title: "Join",
            onClick: (e) => {
                e.stopPropagation();
                console.log("join")
                // navigate("/class")
            }
        },
        {
            title: "Back",
            onClick: (e) => {
                e.stopPropagation();
                console.log("Back")
            }
        },
    ]


    return (
        <>
            <Box  
                sx={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    width: "350px",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "3px",
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.16)',
                    '&:hover':{
                        backgroundColor: '#F5F5F5',
                        cursor: 'pointer'
                    },
                }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        width: "100%"
                    }}
                >
                    <Avatar  variant="rounded"
                    
                    onClick={(event) => {
                        navigate("/calendar");
                    }}    

                    style={{ width: 72, height: 72 }} {...stringAvatar(groupTeamName)} />
                    <Tooltip title={groupTeamName} arrow>
                        <span 
                           
                        onClick={(event) => {
                            navigate("/calendar");    
                        }}       

                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                            {groupTeamName}
                        </span>
                    </Tooltip>
                    <MenuButton
                        menuItem={menuItemsList}
                    />
                </Box>
                <Box
                    sx={{marginTop: "10px"}}
                    
                >
                    <Tooltip title="Announcements">
                        <IconButton>
                            <NotificationsActiveIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Assignments">
                        <IconButton>
                            <BusinessCenterIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Class work">
                        <IconButton>
                            <SquareFootIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </>
    )
}

export default Card;