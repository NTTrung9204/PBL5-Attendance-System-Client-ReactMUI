import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';

const CheckAttendancePage = () => {

    const [student, setStudent] = useState()
    const [AttendanceResult, setAttendanceResult] = useState()
    const [TimeResult, setTimeResult] = useState()


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
        const handleAttendanceResult = async ()=>{
            const res = await fetch(`http://localhost:8080/api/attendance/result/${lessionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })

            if (!res.ok){
                console.log(res)
                throw new Error('Không thể lấy dữ liệu sinh viên')
            }else{
                const data =await res.json()
                console.log(JSON.stringify(data))
                console.log(data.result)
                setAttendanceResult(data.result)
                if (data.result){
                    const checkin = data.result.checkinDate
                    const dayOnly = checkin.split("T")[0]
                    var timeOnly = checkin.split("T")[1] 
                    const [hour, minute] = timeOnly.split(":");
                    timeOnly = `${hour}:${minute}`;
                    const tr = {
                        dayOnly: dayOnly,
                        timeOnly: timeOnly
                    } 
                    console.log(tr)
                    setTimeResult(tr)
                }
            }
        }
        handleAttendanceResult()
      
    }, [])

    if (!student||!AttendanceResult||!TimeResult) {
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
                    <strong>Date:</strong> {TimeResult.dayOnly}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Time:</strong> {TimeResult.timeOnly}
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
                    Face Recognize Result
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Trạng Thái:</strong> Success
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Độ Chính Xác:</strong> 98%
                </Typography>
                <CardMedia
                    component="img"
                    image={`http://localhost:5000/student_images/${AttendanceResult.imgPath}`}
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
