import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Group as GroupIcon, Assignment as AssignmentIcon, Notifications as ActivityIcon} from '@mui/icons-material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Link } from 'react-router-dom';

function Sidebar() {
  const listItemTestStyle = {
    '& .MuiListItemText-primary': {
      fontSize: '10px',
      color: '#727272'
    }
  }
  return (
    <Drawer
      sx={{
        width: 67,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 67,
          boxSizing: 'border-box',
          bgcolor: '#EBEBEB',
        },
        zIndex: 0
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography variant="h6" sx={{ padding: 2, textAlign: 'center', color: 'white' }}>
      </Typography>
      <List sx={{marginTop: '10px'}}>
        <ListItem sx={{display: 'flex', flexDirection: 'column'}} button component={Link} to="/groups">
          <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
            <GroupIcon sx={{ color: '#727272' }} />
          </ListItemIcon>
          <ListItemText primary="Groups" sx={listItemTestStyle} />
        </ListItem>
        <ListItem sx={{display: 'flex', flexDirection: 'column'}} button component={Link} to="/assignment">
          <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
            <AssignmentIcon sx={{ color: '#727272' }} />
          </ListItemIcon>
          <ListItemText primary="Assignment" sx={listItemTestStyle} />
        </ListItem>

        <ListItem sx={{display: 'flex', flexDirection: 'column'}} button component={Link} to="/activities">
          <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
            <ActivityIcon sx={{ color: '#727272' }} />
          </ListItemIcon>
          <ListItemText primary="Activity" sx={listItemTestStyle} />
        </ListItem>

        <ListItem sx={{display: 'flex', flexDirection: 'column'}} button component={Link} to="/chats">
          <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
            <ChatBubbleIcon sx={{ color: '#727272' }} />
          </ListItemIcon>
          <ListItemText primary="Chat" sx={listItemTestStyle} />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;