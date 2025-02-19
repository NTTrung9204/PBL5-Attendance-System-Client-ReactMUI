import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Group as GroupIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#1976d2',
        },
        zIndex: 0
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography variant="h6" sx={{ padding: 2, textAlign: 'center', color: 'white' }}>
        App Sidebar
      </Typography>
      <List>
        <ListItem button component={Link} to="/groups">
          <ListItemIcon>
            <GroupIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Groups" sx={{ color: 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/assignment">
          <ListItemIcon>
            <AssignmentIcon sx={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Assignment" sx={{ color: 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/class">
          <ListItemText primary="Class" sx={{ color: 'white' }} />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;