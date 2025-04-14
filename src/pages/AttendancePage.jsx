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
        console.log("aa")
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
            const response = await fetch('http://localhost:8080/api/attendance/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lessonId: parseInt(lessonId),
                    studentId: selectedStudent.id,
                    checkinDate: new Date().toISOString(),
                    imgPath: "",
                    status: newState
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật trạng thái điểm danh');
            }
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
            
            const response = await fetch(`http://localhost:8080/api/classes/${classId}/students`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Không thể kết nối đến máy chủ');
            }
            const data = await response.json();
            
            // Tạo mảng sinh viên với thông tin cơ bản
            const studentsWithBasicInfo = data.map(student => ({
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
                        const attendanceResponse = await fetch('http://localhost:8080/api/attendance/get_status', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                lessonId: parseInt(lessonId),
                                studentId: student.id
                            }),
                            credentials: 'include'
                        });
                        
                        if (!attendanceResponse.ok) {
                            console.error(`Lỗi khi lấy trạng thái điểm danh cho sinh viên ${student.id}`);
                            return student;
                        }
                        
                        const attendanceData = await attendanceResponse.json();
                        
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
                const response = await fetch(`http://localhost:8080/api/lessons/${lessonId}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Không tìm thấy bài học với ID đã cung cấp');
                    }
                    throw new Error('Không thể kết nối đến máy chủ');
                }
                const data = await response.json();
                // console.log("Dữ liệu bài học nhận được:", data);
                setLessonData(data);
                // // Sau khi có lesson data, lấy thông tin về class
                return data.class_id;
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu bài học:', error);
                setError(error.message);
                return null;
            }
        };

        const fetchClassData = async (classId) => {
            try {
                const response = await fetch(`http://localhost:8080/api/classes/lesson/${lessonId}`, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến máy chủ');
                }
                const data = await response.json();
                // console.log("Dữ liệu lớp học nhận được:", data);
                
                // Vấn đề: setState là bất đồng bộ, không cập nhật state ngay lập tức
                // Giải pháp: Sử dụng biến data trực tiếp thay vì classData
                setClassData(data);
                
                // Đây là lý do tại sao classData vẫn là null sau khi gọi setClassData
                // React gom các cập nhật state và thực hiện chúng sau khi hàm này hoàn tất
                // console.log("Class data (từ biến cục bộ):", data);
                
                // Trả về class ID để fetch students
                return data.class_id;
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

    if (error) {
        return (
            <Box sx={{ padding: "40px", textAlign: "center" }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/calendar')}
                    sx={{ mt: 2 }}
                >
                    Quay lại lịch học
                </Button>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ padding: "40px", textAlign: "center" }}>
                <Typography>Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={styles.container}>
            <Box sx={styles.information}>
                <Typography sx={styles.information__title}>Attendance</Typography>
                <Typography sx={styles.information__item}>
                    <SchoolIcon sx={styles.information__item__icon}/>
                    {classData?.name || "Tên lớp"}
                </Typography>
                <Box sx={{ display: "flex", gap: "20px" }}>
                    <Typography sx={styles.information__item}><CalendarMonthIcon sx={styles.information__item__icon}/>{ lessonData?.lessonDate ? formatDate(lessonData.lessonDate) : AttendanceData.date }</Typography>
                    {" / "}
                    <Typography sx={styles.information__item}><ScheduleIcon sx={styles.information__item__icon}/> { lessonData?.startTime || AttendanceData.startTime } - { lessonData?.endTime || AttendanceData.endTime }</Typography>
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "20px" }}>
                <Box sx={styles.statistic}>
                    <Box sx={styles.statistic__item} className="br-8">
                        <Typography sx={styles.statistic__item__title}>Statistic Summary</Typography>
                        <Box sx={styles.statistic__item__parameter}>
                            <Box sx={styles.parameter}>
                                <Typography sx={styles.parameter__title}>N-Students</Typography>
                                <Typography sx={styles.parameter__number}>{ students.length }</Typography>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Typography sx={styles.parameter__title}>Attended</Typography>
                                <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == true).length }</Typography>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Typography sx={styles.parameter__title}>Absent</Typography>
                                <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == false).length }</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={styles.statistic__item} className="br-8">
                        <Typography sx={styles.statistic__item__title}>Present Summary</Typography>
                        <Box sx={styles.statistic__item__parameter}>
                            <Box sx={styles.parameter}>
                                <Typography sx={styles.parameter__title}>Attendance</Typography>
                                <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == true).length }</Typography>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Typography sx={styles.parameter__title}>Early Clock In</Typography>
                                <Typography sx={styles.parameter__number}>{ students.filter(item => item.attendanceType === "Attended").length }</Typography>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Typography sx={styles.parameter__title}>Late Clock In</Typography>
                                <Typography sx={styles.parameter__number}>{ students.filter(item => item.attendanceType === "Late").length }</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <TableContainer sx={styles.table} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "#828282", textAlign: "center" }}>Student Name</TableCell>
                            <TableCell sx={{ color: "#828282", textAlign: "center" }}>State</TableCell>
                            <TableCell sx={{ color: "#828282", textAlign: "center" }}>Time</TableCell>
                            <TableCell sx={{ color: "#828282", textAlign: "center" }}>Image</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {students.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ textAlign: "center" }}>
                                    {row.name}
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>
                                    <Button 
                                        onClick={(e) => handleStateClick(e, row)}
                                        sx={{ 
                                            fontSize: "13px",
                                            color: row.attendanceType === "Attended" ? "#00CC33" : 
                                                  row.attendanceType === "Late" ? "#FFA500" : "#FA8072",
                                            textTransform: "none",
                                            minWidth: "80px"
                                        }}
                                    >
                                        {row.attendanceType}
                                    </Button>
                                </TableCell>
                                <TableCell sx={{ textAlign: "center" }}>{row.time}</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>{row.state == true && 
                                    <Button 
                                        sx={{ fontSize: "12px" }} 
                                        color="secondary"
                                        onClick={() => handleImageClick(row.imgPath)}
                                    >
                                        <FilterIcon/>
                                    </Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleStateClose}
                >
                    <MenuItem onClick={() => handleStateChange("Absent")}>
                        <Typography sx={{ color: "#FA8072" }}>Absent</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleStateChange("Attended")}>
                        <Typography sx={{ color: "#00CC33" }}>Attended</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleStateChange("Late")}>
                        <Typography sx={{ color: "#FFA500" }}>Late</Typography>
                    </MenuItem>
                </Menu>
            </Box>
            <Dialog open={openImageDialog} onClose={handleCloseImageDialog} maxWidth="md">
                <DialogContent>
                    {selectedImage ? (
                        <img 
                            src={selectedImage} 
                            alt="Student attendance" 
                            style={{ width: '100%', maxHeight: '80vh' }} 
                        />
                    ) : (
                        <Typography>No image available</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    )
}

const styles = {
    container: {
        padding: "40px"
    },
    information: {
        marginBottom: "40px"
    },
    information__title: {
        fontSize: "30px",
        fontWeight: "600",
    },
    information__item: {
        fontSize: "15px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: "gray",
    },
    information__item__icon: {
        fontSize: "20px"
    },
    statistic: {
        display: "flex",
        gap: "20px",
        flexDirection: "column",
    },
    statistic__item: {
        minWidth: "400px",
        padding: "10px",
        boxShadow: "0px 1px 2px 0px"
    },
    statistic__item__title: {
        fontSize: "20px",
        color: "#3399FF",
        marginBottom: "15px"
    },
    statistic__item__parameter: {
        display: "flex",
        gap: "50px",
    },
    parameter: {
        
    },
    parameter__title: {
        fontSize: "15px",
        color: "#AAAAAA",
        marginBottom: "5px"
    },
    parameter__number: {

    },
    table: {
        // marginTop: "30px",
        boxShadow: "0px 1px 2px 0px",
        overflow: "auto",
        maxHeight: "calc(100vh - 250px)",
        '&::-webkit-scrollbar': {
            width: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(120deg, rgba(200, 200, 200, 0.7), rgba(240, 240, 240, 0.9))', 
            borderRadius: '12px', 
            border: '2px solid rgba(255, 255, 255, 0.6)', 
            transition: 'background 0.3s ease-in-out, transform 0.2s',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(120deg, rgba(220, 220, 220, 0.9), rgba(255, 255, 255, 1))', 
            transform: 'scale(1.1)', 
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
        },
        '&::-webkit-scrollbar-track': {
            background: 'rgba(245, 245, 245, 0.7)', 
            borderRadius: '12px',
            boxShadow: 'inset 0 0 6px rgba(200, 200, 200, 0.2)', 
        },
    }
}