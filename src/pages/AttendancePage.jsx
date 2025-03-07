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

export default function AttendancePage() {

    const AttendanceData = {
        date: "March 03 2023",
        time: "08:30:00",
    }

    const ListStudentAttendance = [
        { name: "Le Trung Phong", state: true, time: "08:15:00" },
        { name: "Nguyen Thanh Trung", state: true, time: "08:15:00" },
        { name: "Tran Xuan Tai", state: true, time: "08:15:00" },
        { name: "Duong Quang Minh Hoang", state: true, time: "08:45:00" },
        { name: "Vo Thanh Tu", state: false, time: null },
        { name: "Nguyen Minhh Phuc", state: false, time: null },
        { name: "Ngo Van Quoc Khanh", state: true, time: "08:20:00" },
        { name: "Ha Van Khanh Dat", state: true, time: "08:50:00" },
        { name: "Le Nguyen Ai Tran", state: true, time: "9:00 AM" },
        { name: "Vo Thi Quynh Nga", state: false, time: null },
        { name: "Vo Thi Quynh Nga", state: false, time: null },
        { name: "Vo Thi Quynh Nga", state: false, time: null },
        { name: "Vo Thi Quynh Nga", state: false, time: null },
        { name: "Vo Thi Quynh Nga", state: false, time: null },
        { name: "Vo Thi Quynh Nga", state: false, time: null },
        { name: "Vo Thi Quynh Nga", state: false, time: null },
    ]

    return (
        <Box sx={styles.container}>
            <Box sx={styles.information}>
                <Typography sx={styles.information__title}>Attendance</Typography>
                <Box sx={{ display: "flex", gap: "20px" }}>
                    <Typography sx={styles.information__item}><CalendarMonthIcon sx={styles.information__item__icon}/>{ AttendanceData.date }</Typography>
                    {" / "}
                    <Typography sx={styles.information__item}><ScheduleIcon sx={styles.information__item__icon}/> { AttendanceData.time }</Typography>
                </Box>
            </Box>
            <Box sx={styles.statistic}>
                <Box sx={styles.statistic__item}>
                    <Typography sx={styles.statistic__item__title}>Statistic Summary</Typography>
                    <Box sx={styles.statistic__item__parameter}>
                        <Box sx={styles.parameter}>
                            <Typography sx={styles.parameter__title}>N-Students</Typography>
                            <Typography sx={styles.parameter__number}>{ ListStudentAttendance.length }</Typography>
                        </Box>
                        <Box sx={styles.parameter}>
                            <Typography sx={styles.parameter__title}>Present</Typography>
                            <Typography sx={styles.parameter__number}>{ ListStudentAttendance.filter(item => item.state == true).length }</Typography>
                        </Box>
                        <Box sx={styles.parameter}>
                            <Typography sx={styles.parameter__title}>Absent</Typography>
                            <Typography sx={styles.parameter__number}>{ ListStudentAttendance.filter(item => item.state == false).length }</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={styles.statistic__item}>
                    <Typography sx={styles.statistic__item__title}>Present Summary</Typography>
                    <Box sx={styles.statistic__item__parameter}>
                        <Box sx={styles.parameter}>
                            <Typography sx={styles.parameter__title}>Attendance</Typography>
                            <Typography sx={styles.parameter__number}>{ ListStudentAttendance.filter(item => item.state == true).length }</Typography>
                        </Box>
                        <Box sx={styles.parameter}>
                            <Typography sx={styles.parameter__title}>Early Clock In</Typography>
                            <Typography sx={styles.parameter__number}>{ ListStudentAttendance.filter(item => item.state == true && item.time <= AttendanceData.time).length }</Typography>
                        </Box>
                        <Box sx={styles.parameter}>
                            <Typography sx={styles.parameter__title}>Late Clock In</Typography>
                            <Typography sx={styles.parameter__number}>{ ListStudentAttendance.filter(item => item.state == true && item.time > AttendanceData.time).length }</Typography>
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
                    {ListStudentAttendance.map((row) => (
                        <TableRow
                            // key={}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">
                                {row.state == true ? <>{row.time > AttendanceData.time && <span style={{ color: "#8470FF" }}>Late{" / "}</span>}<span style={{color: "#00CC33", fontSize: "13px"}}>Attendance</span></> : <Typography sx={{color: "#FA8072", fontSize: "13px"}}>Absent</Typography>}
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
        gap: "20px"
    },
    statistic__item: {
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
        marginTop: "30px",
        boxShadow: "0px 1px 2px 0px",
        overflow: "auto",
        maxHeight: "calc(100vh - 400px)",
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