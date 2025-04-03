import { Box, Button, Typography } from "@mui/material";
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

export default function AttendancePage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Lấy lessonId từ URL bằng cách lấy tham số cuối cùng
    const pathParts = location.pathname.split('/');
    const lessonId = pathParts[pathParts.length - 1];
    console.log("Extracted lessonId:", lessonId);
    
    const [lessonData, setLessonData] = useState(null);
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Extracted lessonId trong useEffect:", lessonId);
        
        // Kiểm tra xem có lessonId từ URL không
        if (!lessonId) {
            console.error('Không tìm thấy lessonId trong URL');
            setError('Không tìm thấy ID bài học trong URL');
            setLoading(false);
            return;
        }
        
        const fetchLessonData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/lessons/${lessonId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Không tìm thấy bài học với ID đã cung cấp');
                    }
                    throw new Error('Không thể kết nối đến máy chủ');
                }
                const data = await response.json();
                setLessonData(data);
                // console.log("Dữ liệu bài học nhận được:", data);
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
                const response = await fetch(`http://localhost:8080/api/classes/lesson/${lessonId}`);
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến máy chủ');
                }
                const data = await response.json();
                setClassData(data);
                console.log("Dữ liệu bài học nhận được:", data);
                // Trả về class ID để fetch students
                return data.class_id;
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu lớp học:', error);
                setError(error.message);
                return null;
            }
        };

        const fetchStudents = async (classId) => {
            try {
                console.log("Đang cố gắng lấy dữ liệu sinh viên với classId:", classId);
                if (!classId) {
                    console.error("classId không tồn tại hoặc không hợp lệ:", classId);
                    throw new Error('Không tìm thấy ID lớp học');
                }
                
                const response = await fetch(`http://localhost:8080/api/classes/${classId}/students`);
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến máy chủ');
                }
                const data = await response.json();
                console.log("Dữ liệu sinh viên nhận được:", data);
                
                // Thêm state và time mặc định cho mỗi sinh viên
                const studentsWithAttendance = data.map(student => ({
                    ...student,
                    state: false, // Absent là mặc định
                    time: "--"
                }));
                
                setStudents(studentsWithAttendance);
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu sinh viên:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        const loadAllData = async () => {
            const classId = await fetchLessonData();
            console.log("Class ID:", classId);
            if (classId) {
                await fetchClassData(classId);
                await fetchStudents(classId);
            } else {
                setLoading(false);
            }
        };

        loadAllData();
    }, [lessonId]);

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
                                <Typography sx={styles.parameter__title}>Present</Typography>
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
                                <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == true && item.time <= (lessonData?.startTime || AttendanceData.startTime)).length }</Typography>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Typography sx={styles.parameter__title}>Late Clock In</Typography>
                                <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == true && item.time > (lessonData?.startTime || AttendanceData.startTime)).length }</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <TableContainer sx={styles.table} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: "#828282" }}>Student Name</TableCell>
                            <TableCell sx={{ color: "#828282" }} align="right">State</TableCell>
                            <TableCell sx={{ color: "#828282" }} align="right">Time</TableCell>
                            <TableCell sx={{ color: "#828282" }} align="right">Image _ Atd</TableCell>
                            <TableCell sx={{ color: "#828282" }} align="right">Confirm _ Atd</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {students.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">
                                    {row.state == true ? <>{row.time > (lessonData?.startTime || AttendanceData.startTime) ? <span style={{ color: "#8470FF", fontSize: "13px" }}>Late</span> : <span style={{color: "#00CC33", fontSize: "13px"}}>Attendance</span>}</> : <Typography sx={{color: "#FA8072", fontSize: "13px"}}>Absent</Typography>}
                                </TableCell>
                                <TableCell align="right">{row.time}</TableCell>
                                <TableCell align="right">{row.state == true && <Button sx={{ fontSize: "12px" }} color="secondary"><FilterIcon/></Button>}</TableCell>
                                <TableCell align="right">{row.state == false && <Button sx={{ fontSize: "12px" }}>Confirm</Button>}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
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