import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import GroupsPage from './pages/GroupsPage';
import AssignmentPage from './pages/AssignmentPage';
import Activity from './pages/Activity';
import { Calculate } from '@mui/icons-material';
import Chat from './pages/Chat';

function App() {
  return (

    <Router style='width: 100%'>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' , overflowY: "hidden" }}>
        <Header />

        <Box sx={{ display: 'flex', flexGrow: 1, marginTop: 8 }}>
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              padding: 0,
              overflow: "hidden !important",
              width: '100%'
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/groups" />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/assignment" element={<AssignmentPage />} />
              <Route path="/activities/*" element={<Activity />} />
              <Route path="/chats/*" element={<Chat />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
