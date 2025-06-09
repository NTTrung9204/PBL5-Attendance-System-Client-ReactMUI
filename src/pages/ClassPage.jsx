import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Fade,
  Zoom
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';

function ClassPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gradientBg = `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`;
  
  const dayTranslations = {
    'MONDAY': 'Thứ Hai',
    'TUESDAY': 'Thứ Ba',
    'WEDNESDAY': 'Thứ Tư',
    'THURSDAY': 'Thứ Năm',
    'FRIDAY': 'Thứ Sáu',
    'SATURDAY': 'Thứ Bảy',
    'SUNDAY': 'Chủ Nhật'
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await api.get(`/api/classes/${id}/with-schedule`, {
          withCredentials: true
        });

        setClassData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp học:', error);
        setError('Không thể tải thông tin lớp học. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Fade in={true}>
          <Alert severity="error" sx={{ 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {error}
          </Alert>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Fade in={true}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              mb: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            <Box sx={{ 
              mb: 4, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                {classData?.name || 'Thông tin lớp học'}
              </Typography>
              <Chip
                label="Xem lịch học"
                color="primary"
                clickable
                onClick={() => navigate(`/calendar/${classData?.classId}`)}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                  }
                }}
              />
            </Box>

            <Divider sx={{ 
              mb: 4,
              background: 'linear-gradient(90deg, transparent, #2196F3, transparent)',
              height: '2px'
            }} />

            <Grid container spacing={4}>
              {/* Thông tin chung */}
              <Grid item xs={12} md={6}>
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <CardHeader 
                      title="Thông tin chung"
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                        borderRadius: '8px 8px 0 0'
                      }}
                    />
                    <CardContent>
                      <List>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                            <DateRangeIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Mã lớp"
                            secondary={classData?.classId}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                            <AccessTimeIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Ngày tạo" 
                            secondary={classData?.createdAt}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                            <CalendarTodayIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Số tuần học" 
                            secondary={classData?.numberOfWeeks}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Giáo viên" 
                            secondary={classData?.teacherName || 'Chưa có thông tin'}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 1.5 }}>
                          <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                            <GroupIcon />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Tổng số học sinh" 
                            secondary={classData?.totalStudents || 0}
                            primaryTypographyProps={{ fontWeight: 'bold' }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>

              {/* Lịch học */}
              <Grid item xs={12} md={6}>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <CardHeader 
                      title="Lịch học"
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                        borderRadius: '8px 8px 0 0'
                      }}
                    />
                    <CardContent>
                      {classData?.schedule && Object.keys(classData.schedule).length > 0 ? (
                        <List>
                          {Object.entries(classData.schedule).map(([day, times], index) => (
                            <motion.div
                              key={day}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <ListItem sx={{ 
                                py: 1.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(33, 150, 243, 0.04)',
                                  borderRadius: 1
                                }
                              }}>
                                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                                  <ScheduleIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={dayTranslations[day] || day}
                                  secondary={`${formatTime(times.startTime)} - ${formatTime(times.endTime)}`}
                                  primaryTypographyProps={{ fontWeight: 'bold' }}
                                />
                              </ListItem>
                            </motion.div>
                          ))}
                        </List>
                      ) : (
                        <Typography 
                          variant="body2" 
                          color="textSecondary"
                          sx={{ 
                            textAlign: 'center',
                            py: 2,
                            fontStyle: 'italic'
                          }}
                        >
                          Chưa có thông tin lịch học
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 8,
            py: 3,
            px: 2,
            backgroundColor: 'transparent',
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontWeight: 500,
            }}
          >
            <span>© {new Date().getFullYear()}</span>
            <Box
              component="span"
              sx={{
                background: gradientBg,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              PBL5 - Auto Attendance System
            </Box>
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 1,
              opacity: 0.8,
            }}
          >
            Hệ thống điểm danh tự động thông minh
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default ClassPage;