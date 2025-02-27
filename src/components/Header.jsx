import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Avatar, Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import AccountMenu from './AccountMenu' 

function Header() {
  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 3, backgroundColor:'#EBEBEB' , boxShadow: 'none', borderBottom: '1px solid #ccc'}}>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: '47px !important', // Override default minHeight
          padding: '0 16px', // Ensure consistent padding
          width: '100%', 
          height: '47px' 
        }}
      >
        <Typography variant="h6" sx={{color: '#000', fontWeight: '300'}}>
          PBL5
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          borderRadius: 1, 
          bgcolor: 'background.paper', 
          width: '50%',

        }}>
          <SearchIcon sx={{ padding: '0 8px', color: '#9D9D9D', fontSize: '35px'}} />
          <InputBase
            placeholder="Search…"
            sx={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: 1,
              height: '28px'
            }}
          />
        </Box>

        <AccountMenu sx={{ width: 40, height: 40 }} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;