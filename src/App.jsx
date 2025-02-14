import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GroupsPage from './pages/GroupsPage';
import AssignmentPage from './pages/AssignmentPage';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />

        <Box sx={{ display: 'flex', flexGrow: 1, marginTop: 8 }}>
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              padding: 3,
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/groups" />} />

              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/assignment" element={<AssignmentPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
