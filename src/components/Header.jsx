import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Avatar, Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import AccountMenu from './AccountMenu' 

function Header() {
  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Typography variant="h6">
          PBL5
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 1, bgcolor: 'background.paper', width: '50%' }}>
          <SearchIcon sx={{ padding: 1 }} />
          <InputBase
            placeholder="Search…"
            sx={{
              width: '100%',
              padding: 1,
              borderRadius: 1,
            }}
          />
        </Box>

        <AccountMenu sx={{ width: 40, height: 40 }} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
