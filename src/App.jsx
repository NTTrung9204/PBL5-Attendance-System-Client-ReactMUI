import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GroupsPage from './pages/GroupsPage';
import AssignmentPage from './pages/AssignmentPage';
import GeneralClass from './pages/class/GeneralClass';
import HomeClass from './pages/class/HomeClass';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />

        <Box sx={{ display: 'flex', flexGrow: 1, marginTop: 8, height: '100%' }}>
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width:'100%',
              bgcolor: 'background.default',
              padding: 0,
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/groups" />} />

              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/assignment" element={<AssignmentPage />} />
              <Route path="/class/*" element={<HomeClass />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
