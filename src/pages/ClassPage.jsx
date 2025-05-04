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
  Avatar,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { data, useParams } from 'react-router-dom';
import api from '../api/axios';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ScheduleIcon from '@mui/icons-material/Schedule';

function ClassPage() {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        // Mock data instead of API call
        const resClass = await api.get(`/api/classes/${id}`, {
          withCredentials: true
        });

        const dataClass = resClass.data;

        const resTeacher = await api.get(`/api/teacher/${dataClass?.teacherId}`, {
          withCredentials: true
        });

        const dataTeacher = resTeacher.data;
        // console.log(dataTeacher);
        const resLesson = await api.get(`/api/lessons/schedule/${id}`, {
          withCredentials: true
        });
        const dataLesson = resLesson.data;
        // console.log(dataLesson);

        const resStudent = await api.get(`/api/classes/${id}/students`, {
          withCredentials: true
        });
        const dataStudent = resStudent.data;
        // console.log(dataStudent);

        const mockResponse = {
            data: {
                id: id,
                name: dataClass?.name || "Not found",
                active: true,
                createdAt: dataClass?.createdAt || "Not found",
                weeks: dataClass?.weeks || 0,  
                teacher: {
                    id: "T001",
                    name: dataTeacher?.name || "Not found",
                },
                studentCount: dataStudent?.length || 0,
                schedule: dataLesson || [],
                description: "Mô tả học phần."
            }
        };

        const response = mockResponse;
        
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    // Assuming timeString format is "HH:mm:ss"
    if (!timeString) return "--:--";
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {classData?.name || 'Thông tin lớp học'}
          </Typography>
          <Chip
            label={classData?.active ? 'Đang hoạt động' : 'Đã kết thúc'}
            color={classData?.active ? 'success' : 'error'}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Thông tin chung */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Thông tin chung" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <DateRangeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Ngày tạo" 
                      secondary={formatDate(classData?.createdAt)} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Số tuần học" 
                      secondary={classData?.weeks || 15} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Giáo viên" 
                      secondary={classData?.teacher?.name || 'Chưa có thông tin'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tổng số học sinh" 
                      secondary={classData?.studentCount || 0} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Lịch học */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Lịch học" />
              <CardContent>
                {classData?.schedule && classData.schedule.length > 0 ? (
                  <List>
                    {classData.schedule.map((sch, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ScheduleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={dayTranslations[sch.dayOfWeek] || sch.dayOfWeek}
                          secondary={`${formatTime(sch.startTime)} - ${formatTime(sch.endTime)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Chưa có thông tin lịch học
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Mô tả lớp học */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Mô tả lớp học" />
              <CardContent>
                <Typography variant="body1">
                  {classData?.description || 'Không có mô tả'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ClassPage;