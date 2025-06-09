import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';
import api from "../api/axios";
import { useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '@mui/material/styles';

const CheckAttendancePage = () => {
    const { classId } = useParams();
    const [student, setStudent] = useState(null);
    const [attendanceResult, setAttendanceResult] = useState(null);
    const [timeResult, setTimeResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const gradientBg = `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`;

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await api.get("/api/student", {
                    withCredentials: true
                });
                setStudent(response.data.result);
            } catch (error) {
                setError('Không thể lấy dữ liệu sinh viên');
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudentInfo();
    }, []);

    useEffect(() => {
        const fetchAttendanceResult = async () => {
            if (!classId) return;

            try {
                const response = await api.get(`/api/attendance/result/${classId}`, {
                    withCredentials: true
                });
                
                const { result } = response.data;
                setAttendanceResult(result);
                if (result?.checkinDate) {
                    const date = new Date(result.checkinDate);
                    setTimeResult({
                        dayOnly: date.toLocaleDateString(),
                        timeOnly: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                }
            } catch (error) {
                setError('Không thể lấy dữ liệu điểm danh');
                console.error('Error fetching attendance data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAttendanceResult();
    }, [classId]);

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
            }}>
                <Typography variant="h5" color="primary">Đang tải...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
            }}>
                <Typography variant="h5" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
            py: 6
        }}>
            <Container maxWidth="sm">
                <Paper elevation={4} sx={{
                    p: 4,
                    borderRadius: 3,
                    background: 'rgba(255,255,255,0.95)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    backdropFilter: 'blur(8px)',
                    mb: 6
                }}>
                    <Typography
                        variant="h3"
                        align="center"
                        gutterBottom
                        sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(90deg, #2196F3 30%, #21CBF3 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 3
                        }}
                    >
                        Kết Quả Điểm Danh
                    </Typography>

                    <Card elevation={0} sx={{
                        borderRadius: 2,
                        background: 'rgba(245,247,250,0.7)',
                        boxShadow: '0 2px 8px rgba(33,150,243,0.07)',
                        mb: 2
                    }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                                Thông Tin Sinh Viên
                            </Typography>
                            {attendanceResult?.status !== "Absent" && attendanceResult?.status !== null && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <CardMedia
                                        component="img"
                                        image={attendanceResult.imgPath ? `http://localhost:5000/student_images/${attendanceResult.imgPath}` : ''}
                                        alt="Recognition Result"
                                        sx={{
                                            width: 180,
                                            height: 180,
                                            objectFit: 'cover',
                                            borderRadius: '50%',
                                            border: '4px solid',
                                            borderColor: 'primary.main',
                                            boxShadow: '0 4px 16px rgba(33,150,243,0.10)'
                                        }}
                                    />
                                </Box>
                            )}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                                    <strong>Họ tên:</strong> {student?.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                                    <strong>Mã số sinh viên:</strong> {student?.id}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                                    <strong>Ngày điểm danh:</strong> {timeResult?.dayOnly || 'Chưa điểm danh'}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                                    <strong>Giờ điểm danh:</strong> {timeResult?.timeOnly || 'Chưa điểm danh'}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <strong>Trạng thái:</strong> {attendanceResult?.status === 'Present' ? (
                                        <span style={{ color: theme.palette.success.main, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CheckCircleIcon fontSize="small" /> Có mặt
                                        </span>
                                    ) : attendanceResult?.status === 'Absent' ? (
                                        <span style={{ color: theme.palette.error.main, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <CancelIcon fontSize="small" /> Vắng mặt
                                        </span>
                                    ) : (
                                        <span style={{ color: theme.palette.info.main }}>
                                            Lớp học đang diễn ra, hãy điểm danh!
                                        </span>
                                    )}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Paper>

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

export default CheckAttendancePage;
