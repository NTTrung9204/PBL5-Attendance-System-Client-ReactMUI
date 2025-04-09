import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/ResigterPage';
import GroupsPage from './pages/GroupsPage';
import AssignmentPage from './pages/AssignmentPage';
import Activity from './pages/Activity';
import Chat from './pages/Chat';
import GeneralClass from './pages/class/GeneralClass';
import HomeClass from './pages/class/HomeClass';
import CalendarPage from './pages/CalendarPage';
import AttendancePage from './pages/AttendancePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: "hidden" }}>
              <Header />
              <Box sx={{ display: 'flex', flexGrow: 1, marginTop: '49px', height: '100%' }}>
                <Sidebar />
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    width: '100%',
                    bgcolor: 'background.default',
                    padding: 0,
                    overflow: "hidden !important",
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/groups" replace />} />
                    <Route path="/groups" element={<GroupsPage />} />
                    <Route path="/assignment" element={<AssignmentPage />} />
                    <Route path="/activities/*" element={<Activity />} />
                    <Route path="/chats/*" element={<Chat />} />
                    <Route path="/class/*" element={<HomeClass />} />
                    <Route path="/calendar/*" element={<CalendarPage />} />
                    <Route path="/calendar/attendance/*" element={<AttendancePage />} />
                  </Routes>
                </Box>
              </Box>
            </Box>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
