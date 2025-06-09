import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PortraitIcon from '@mui/icons-material/Portrait';
import FilterIcon from '@mui/icons-material/Filter';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SchoolIcon from '@mui/icons-material/School';
import api from "../api/axios";
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function AttendancePage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Kiểm tra role và chuyển hướng nếu không phải là giáo viên
    useEffect(() => {
        const roles = localStorage.getItem('roles');
        if (!roles || !roles.includes('ROLE_TEACHER')) {
            navigate('/calendar');
        }
    }, [navigate]);
    
    // Lấy lessonId từ URL bằng cách lấy tham số cuối cùng
    const pathParts = location.pathname.split('/');
    const lessonId = pathParts[pathParts.length - 1];
    
    const [lessonData, setLessonData] = useState(null);
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openImageDialog, setOpenImageDialog] = useState(false);

    const handleStateClick = (event, student) => {
        setAnchorEl(event.currentTarget);
        setSelectedStudent(student);
    };

    const handleStateClose = () => {
        setAnchorEl(null);
    };

    const handleStateChange = async (newState) => {
        if (!selectedStudent) return;
        
        // Cập nhật UI ngay lập tức
        const updatedStudents = [...students];
        const studentIndex = updatedStudents.findIndex(s => s.id === selectedStudent.id);
        
        if (studentIndex !== -1) {
            updatedStudents[studentIndex] = {
                ...updatedStudents[studentIndex],
                attendanceType: newState
            };
            setStudents(updatedStudents);
        }
        
        try {
            await api.post('/api/attendance/update', {
                lessonId: parseInt(lessonId),
                studentId: selectedStudent.id,
                checkinDate: new Date().toISOString(),
                imgPath: "",
                status: newState
            }, {
                withCredentials: true
            });
            console.log(new Date().toISOString());
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
        
        handleStateClose();
    };

    const handleImageClick = (imagePath) => {
        const originalPath = "http://localhost:5000/student_images/"
        setSelectedImage(originalPath + imagePath);
        setOpenImageDialog(true);
    };

    const handleCloseImageDialog = () => {
        setOpenImageDialog(false);
    };

    const fetchStudentsAttendance = async (classId) => {
        try {
            if (!classId) {
                console.error("classId không tồn tại hoặc không hợp lệ:", classId);
                throw new Error('Không tìm thấy ID lớp học');
            }
            
            const response = await api.get(`/api/classes/${classId}/students`, {
                withCredentials: true
            });
            
            // Tạo mảng sinh viên với thông tin cơ bản
            const studentsWithBasicInfo = response.data.map(student => ({
                ...student,
                state: false, // Giá trị mặc định
                time: "--",
                imgPath: "",
                attendanceType: "Absent" // Giá trị mặc định
            }));
            
            // Lấy thông tin điểm danh cho từng sinh viên
            const studentsWithAttendance = await Promise.all(
                studentsWithBasicInfo.map(async (student) => {
                    try {
                        const attendanceResponse = await api.post('/api/attendance/get_status', {
                            lessonId: parseInt(lessonId),
                            studentId: student.id
                        }, {
                            withCredentials: true
                        });
                        
                        const attendanceData = attendanceResponse.data;
                        
                        // Sử dụng trực tiếp status từ API
                        let attendanceType = attendanceData.status || "--";
                        
                        // Cập nhật trạng thái điểm danh
                        return {
                            ...student,
                            state: attendanceData.checkinDate !== null,
                            time: attendanceData.checkinDate ? new Date(attendanceData.checkinDate).toLocaleTimeString() : "--",
                            imgPath: attendanceData.imgPath || "",
                            attendanceType: attendanceType
                        };
                    } catch (error) {
                        console.error(`Lỗi khi xử lý dữ liệu điểm danh cho sinh viên ${student.id}:`, error);
                        return student;
                    }
                })
            );
            
            setStudents(studentsWithAttendance);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sinh viên:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        
        // Kiểm tra xem có lessonId từ URL không
        if (!lessonId) {
            console.error('Không tìm thấy lessonId trong URL');
            setError('Không tìm thấy ID bài học trong URL');
            setLoading(false);
            return;
        }
        
        const fetchLessonData = async () => {
            try {
                const response = await api.get(`/api/lessons/${lessonId}`, {
                    withCredentials: true
                });
                
                setLessonData(response.data);
                return response.data.class_id;
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu bài học:', error);
                if (error.response && error.response.status === 404) {
                    setError('Không tìm thấy bài học với ID đã cung cấp');
                } else {
                    setError('Không thể kết nối đến máy chủ');
                }
                return null;
            }
        };

        const fetchClassData = async (classId) => {
            try {
                const response = await api.get(`/api/classes/lesson/${lessonId}`, {
                    withCredentials: true
                });
                
                setClassData(response.data);
                return response.data.class_id;
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu lớp học:', error);
                setError(error.message);
                return null;
            }
        };

        const loadAllData = async () => {
            const classId = await fetchLessonData();
            if (classId) {
                await fetchClassData(classId);
                await fetchStudentsAttendance(classId);
            } else {
                setLoading(false);
            }
        };

        loadAllData();

        // Thiết lập interval để cập nhật trạng thái điểm danh mỗi 2 giây
        const intervalId = setInterval(() => {
            // console.log("Interval đang chạy mỗi 2 giây - Thời gian hiện tại:", new Date().toLocaleTimeString());
            // console.log("Class data:", classData);
            if (classData?.id) {
                // console.log("Đang cập nhật trạng thái điểm danh...");
                fetchStudentsAttendance(classData.id);
            }
        }, 2000);

        // Xóa interval khi component unmount
        return () => {
            // console.log("Đang xóa interval");
            clearInterval(intervalId);
        };
    }, [lessonId, classData?.id ]);

    const AttendanceData = lessonData || {
        date: "March 03 2023",
        startTime: "08:30:00",
        endTime: "10:00:00",
    }

    // Hàm định dạng ngày từ chuỗi ISO
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('vi-VN', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const handleExportCSV = () => {
        // Create CSV content
        const headers = ['Student Name', 'State', 'Time'];
        const csvContent = [
            headers.join(','),
            ...students.map(student => [
                student.name,
                student.attendanceType,
                student.time
            ].join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${classData?.name}_${formatDate(lessonData?.lessonDate)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (error) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)' }}>
                <Box sx={{ textAlign: 'center', p: 4, background: 'rgba(255,255,255,0.95)', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        {error}
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate('/calendar')}
                        // sx={{ mt: 2 }}
                    >
                        Quay lại lịch học
                    </Button>
                </Box>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)' }}>
                <Typography variant="h5" color="primary">Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            py: 6
        }}>
            <Box sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
                {/* Main Content: 2 columns */}
                <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                    {/* Left: Header + Statistic Cards */}
                    <Box sx={{
                        flex: '0 0 340px',
                        minWidth: 260,
                        maxWidth: 380,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}>
                        {/* Header in left column */}
                        <Box sx={{ mb: 2, textAlign: 'center', p: 2, background: 'rgba(255,255,255,0.95)', borderRadius: 3, boxShadow: '0 4px 20px rgba(33,150,243,0.08)' }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(90deg, #2196F3 30%, #21CBF3 90%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Quản Lý Điểm Danh
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                                {classData?.name || "Tên lớp"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                Ngày: {lessonData?.lessonDate ? formatDate(lessonData.lessonDate) : AttendanceData.date}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Giờ: {lessonData?.startTime || AttendanceData.startTime} - {lessonData?.endTime || AttendanceData.endTime}
                            </Typography>
                        </Box>
                        {/* Statistic Cards */}
                        <Box sx={{
                            p: 3,
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(33,150,243,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            border: '1px solid rgba(33,150,243,0.08)'
                        }}>
                            <PortraitIcon sx={{ fontSize: 40, color: '#2563eb', mr: 2 }} />
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: '#2563eb', fontSize: 16 }}>Tổng số sinh viên</Typography>
                                <Typography sx={{ fontWeight: 800, fontSize: 28 }}>{students.length}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            p: 3,
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(33,150,243,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            border: '1px solid rgba(33,150,243,0.08)'
                        }}>
                            <CheckCircleIcon sx={{ fontSize: 40, color: '#10b981', mr: 2 }} />
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: '#10b981', fontSize: 16 }}>Đã điểm danh</Typography>
                                <Typography sx={{ fontWeight: 800, fontSize: 28 }}>{students.filter(item => item.state == true).length}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            p: 3,
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(33,150,243,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            border: '1px solid rgba(33,150,243,0.08)'
                        }}>
                            <CancelIcon sx={{ fontSize: 40, color: '#ef4444', mr: 2 }} />
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: '#ef4444', fontSize: 16 }}>Vắng mặt</Typography>
                                <Typography sx={{ fontWeight: 800, fontSize: 28 }}>{students.filter(item => item.state == false).length}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right: Attendance Table */}
                    <Box sx={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                            background: 'rgba(255,255,255,0.97)',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                            p: 3,
                            mb: 2,
                            border: '1px solid rgba(33,150,243,0.08)',
                            overflowX: 'auto',
                            height: 520,
                            overflowY: 'auto',
                        }}>
                            <Table sx={{ minWidth: 650 }} aria-label="attendance table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontSize: 15, textTransform: 'uppercase', textAlign: 'center' }}>Avatar</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontSize: 15, textTransform: 'uppercase', textAlign: 'center' }}>Tên sinh viên</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontSize: 15, textTransform: 'uppercase', textAlign: 'center' }}>Trạng thái</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontSize: 15, textTransform: 'uppercase', textAlign: 'center' }}>Giờ điểm danh</TableCell>
                                        <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontSize: 15, textTransform: 'uppercase', textAlign: 'center' }}>Ảnh</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((row, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { background: 'rgba(33,150,243,0.04)' } }}>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Avatar 
                                                    src={`${api.defaults.baseURL}/avatars/${row.username}.jpg?t=${Date.now()}`}
                                                    alt={row.name}
                                                    sx={{ width: 45, height: 45, mx: 'auto', border: '2px solid #e5e7eb', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.1)', border: '2px solid #3b82f6' } }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontWeight: 600, color: '#1e40af' }}>{row.name}</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Button 
                                                    type="button"
                                                    onClick={(e) => handleStateClick(e, row)}
                                                    sx={{ 
                                                        fontWeight: 700,
                                                        borderRadius: 2,
                                                        px: 2,
                                                        py: 1,
                                                        fontSize: 14,
                                                        backgroundColor: row.attendanceType === "Attended" ? "#dcfce7" : row.attendanceType === "Late" ? "#fef3c7" : "#fee2e2",
                                                        color: row.attendanceType === "Attended" ? "#16a34a" : row.attendanceType === "Late" ? "#d97706" : "#dc2626",
                                                        boxShadow: '0 2px 8px rgba(33,150,243,0.07)',
                                                        transition: 'all 0.3s',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 12px rgba(33,150,243,0.13)'
                                                        }
                                                    }}
                                                >
                                                    {row.attendanceType}
                                                </Button>
                                            </TableCell>
                                            <TableCell sx={{ textAlign: 'center', fontWeight: 500 }}>{row.time}</TableCell>
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {row.state == true && 
                                                    <Button 
                                                        sx={{ fontSize: 20, color: '#3b82f6', p: 1, minWidth: 'unset', borderRadius: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)', transition: 'all 0.3s', '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)', transform: 'translateY(-2px)' } }} 
                                                        onClick={() => handleImageClick(row.imgPath)}
                                                    >
                                                        <FilterIcon/>
                                                    </Button>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                        {/* Export CSV button OUTSIDE the table, bottom right of right column */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<FileDownloadIcon />}
                                onClick={handleExportCSV}
                                sx={{
                                    background: 'linear-gradient(90deg, #2196F3 30%, #21CBF3 90%)',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.10)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #21CBF3 30%, #2196F3 90%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(33, 150, 243, 0.18)'
                                    }
                                }}
                            >
                                Xuất CSV
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Menu & Dialog giữ nguyên */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleStateClose}
                sx={{ '& .MuiPaper-root': { borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid rgba(33,150,243,0.08)' } }}
            >
                <MenuItem onClick={() => handleStateChange("Absent")}>
                    <CancelIcon sx={{ color: "#dc2626", marginRight: 1 }} />
                    <Typography sx={{ color: "#dc2626" }}>Vắng mặt</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleStateChange("Attended")}> 
                    <CheckCircleIcon sx={{ color: "#16a34a", marginRight: 1 }} />
                    <Typography sx={{ color: "#16a34a" }}>Đã điểm danh</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleStateChange("Late")}> 
                    <TimerOffIcon sx={{ color: "#d97706", marginRight: 1 }} />
                    <Typography sx={{ color: "#d97706" }}>Điểm danh muộn</Typography>
                </MenuItem>
            </Menu>
            <Dialog 
                open={openImageDialog} 
                onClose={handleCloseImageDialog} 
                maxWidth="md"
                sx={{ '& .MuiDialog-paper': { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' } }}
            >
                <DialogContent sx={{ p: 3 }}>
                    {selectedImage ? (
                        <img 
                            src={selectedImage} 
                            alt="Student attendance" 
                            style={{ width: '100%', maxHeight: '80vh', borderRadius: '8px' }} 
                        />
                    ) : (
                        <Typography>Không có ảnh</Typography>
                    )}
                </DialogContent>
            </Dialog>

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
                            background: 'linear-gradient(135deg, #90caf9, #2196f3)',
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
        </Box>
    )
}