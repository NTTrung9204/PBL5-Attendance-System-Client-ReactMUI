import { Box } from "@mui/material";
import CalendarCard from "../components/Calendar/CalendarCard";
import { Route, Routes, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
        const response = await fetch(`http://localhost:8080/api/lessons/class/${id}`);
        
        if (!response.ok) {
          throw new Error('Không thể kết nối đến máy chủ');
        }
        
        const data = await response.json();
        console.log("Dữ liệu lịch học nhận được:", data);
        setLessons(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lịch học:', error);
        setError(error.message);
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
    }}> 
        <h2 style={{ textAlign: 'center' }}>Class Calendar</h2>
        
        {loading ? (
          <Box sx={{ textAlign: 'center', padding: '20px' }}>Đang tải dữ liệu lịch học...</Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', padding: '20px', color: 'red' }}>Lỗi: {error}</Box>
        ) : (
          <Box sx={{
              display: 'flex', 
              gap: '24px', 
              flexWrap: 'wrap', 
              padding: '16px',  
              marginBottom: '16px', 
              justifyContent: 'center',
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