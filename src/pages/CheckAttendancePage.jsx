import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';

const CheckAttendancePage = () => {

    const [student, setStudent] = useState()
    const [AttendanceResult, setAttendanceResult] = useState()


    useEffect(()=>{
        const handleInfo = async() => {
            fetch("http://localhost:8080/api/student", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }).then(reponse => {
                if (!reponse.ok){
                    throw new Error('Không thể lấy dữ liệu sinh viên')
                }
              
                return reponse.json()
            }).then(data=>{
                console.log(JSON.stringify(data))
                console.log(data.result)
                setStudent(data.result)
            })
        }
        handleInfo()
    }, [])

    useEffect(()=> {
        const pathParts = location.pathname.split('/');
        const lessionId = pathParts[pathParts.length - 1];
        const handleAttendanceResult = async()=>{
            fetch(`http://localhost:8080/api/attendance/${lessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }).then(reponse => {
                if (!reponse.ok){
                    throw new Error('Không thể lấy dữ liệu sinh viên')
                }
              
                return reponse.json()
            }).then(data=>{
                console.log(JSON.stringify(data))
                console.log(data.result)
                setAttendanceResult(data.result)
            })
        }
        handleAttendanceResult()
    }, [])

    if (!student) {
        return <div>Loading...</div>; 
    }

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
        {/* Header */}
        <Typography variant="h3" align="center" gutterBottom>
            Attendance Result
        </Typography>

        <Grid container spacing={4}>
            {/* Student Info */}
            <Grid item xs={12} sm={6}>
            <Card elevation={3}>
                <CardContent>
                <Typography variant="h5" gutterBottom>
                    Infomation
                </Typography>
                <CardMedia
                    component="img"
                    image="student-photo.jpg"
                    alt="Ảnh Sinh Viên"
                    sx={{ height: 200, objectFit: 'cover', borderRadius: 2 }}
                />
                <Typography variant="body1" color="textSecondary">
                    <strong>Name:</strong> {student.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Id:</strong> {student.id}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Date:</strong> 14/04/2025
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Time:</strong> 10:30 AM
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Status:</strong> Đã Điểm Danh
                </Typography>
                </CardContent>
            </Card>
            </Grid>

            {/* Face Recognition */}
            <Grid item xs={12} sm={6}>
            <Card elevation={3}>
                <CardContent>
                <Typography variant="h5" gutterBottom>
                    Kết Quả Nhận Diện Khuôn Mặt
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Trạng Thái:</strong> Thành Công
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Độ Chính Xác:</strong> 98%
                </Typography>
                <CardMedia
                    component="img"
                    image="attendance-record.jpg"
                    alt="Kết Quả Nhận Diện"
                    sx={{ height: 200, objectFit: 'cover', borderRadius: 2, marginTop: 2 }}
                />
                </CardContent>
            </Card>
            </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', marginTop: 5, padding: 2, backgroundColor: '#f1f1f1' }}>
            <Typography variant="body2" color="textSecondary">
                Auto Attendance System
            </Typography>
        </Box>
        </Container>
    );
}

export default CheckAttendancePage;
