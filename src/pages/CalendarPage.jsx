import { Box } from "@mui/material";
import CalendarCard from "../components/Calendar/CalendarCard";
import { Route, Routes, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function CalendarPage() {
  const { classId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Lấy classId từ URL, nếu không có thì mặc định là 1
        // Lấy classId từ URL bằng cách lấy tham số cuối cùng
        const pathParts = window.location.pathname.split('/');
        const id = classId || pathParts[pathParts.length - 1];
        console.log("Lấy classId từ URL:", id);
        
        // Chuyển từ fetch sang axios
        const response = await api.get(`/api/lessons/class/${id}`, {
          withCredentials: true
        });
        
        // Axios tự động trả về response.data và xử lý lỗi HTTP
        console.log("Dữ liệu lịch học nhận được:", response.data);
        setLessons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lịch học:', error);
        
        // Xử lý lỗi từ axios
        if (error.response) {
          // Server trả về response với status code nằm ngoài phạm vi 2xx
          setError(error.response.data.message || 'Lỗi máy chủ');
        } else if (error.request) {
          // Yêu cầu đã được gửi nhưng không nhận được phản hồi
          setError('Không thể kết nối đến máy chủ');
        } else {
          // Có lỗi khi thiết lập request
          setError(error.message);
        }
        
        setLoading(false);
      }
    };

    fetchLessons();
  }, [classId]);

  // Hàm xác định trạng thái của buổi học dựa trên datetime
  const determineStatus = (lessonDate, startTime, endTime, isCompleted) => {
    const currentDateTime = new Date();
    
    // Tạo datetime đầy đủ từ ngày và giờ bắt đầu/kết thúc
    const lessonStartDateTime = new Date(lessonDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    lessonStartDateTime.setHours(startHours, startMinutes, 0);
    
    const lessonEndDateTime = new Date(lessonDate);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    lessonEndDateTime.setHours(endHours, endMinutes, 0);
    
    console.log(currentDateTime)
    console.log(lessonStartDateTime)
    console.log(lessonEndDateTime)
    if (isCompleted) {
      return 'Passed';
    } else if (
      currentDateTime >= lessonStartDateTime && 
      currentDateTime <= lessonEndDateTime
    ) {
      return 'Now';
    } else if (currentDateTime > lessonEndDateTime) {
      return 'Passed';
    } else {
      return 'Pending';
    }
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      overflowY: 'auto',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
    }}> 
        <h2 style={{ 
          textAlign: 'center', 
          color: '#1976d2',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          margin: '24px 0'
        }}>Class Calendarc</h2>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', padding: '20px', color: '#1976d2' }}>Đang tải dữ liệu lịch học...</Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', padding: '20px', color: '#f44336', backgroundColor: 'rgba(244, 67, 54, 0.08)', borderRadius: '8px', margin: '0 auto', maxWidth: '500px' }}>Lỗi: {error}</Box>
        ) : (
          <Box sx={{
              display: 'flex', 
              flexDirection: 'column',
              gap: '24px', 
              flexWrap: 'wrap', 
              padding: '16px',  
              marginBottom: '16px', 
              justifyContent: 'center',
              alignItems: 'center', 
              paddingBottom: '100px'
          }}>    
              {lessons.map(lesson => (
                <CalendarCard 
                  key={lesson.id}
                  date={formatDate(lesson.lessonDate)}
                  status={determineStatus(
                    lesson.lessonDate, 
                    lesson.startTime, 
                    lesson.endTime, 
                    lesson.isCompleted,
                  )}
                  total={50}
                  startTime={lesson.startTime.substring(0, 5)}
                  endTime={lesson.endTime.substring(0, 5)}
                  lessonId={lesson.id}
                />
              ))}
          </Box>
        )}
    </Box>
  );
}

export default CalendarPage;