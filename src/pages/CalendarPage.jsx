import { Box } from "@mui/material";
import CalendarCard from "../components/Calendar/CalendarCard";
import { Route, Routes } from "react-router-dom";

function CalendarPage() {
  return (
    <Box sx={{ 
      height: '100%', 
      overflowY: 'auto', 
    }}> 
        <h2 style={{ textAlign: 'center' }}>Class Calendar</h2>
        <Box sx={{
            display: 'flex', 
            gap: '24px', 
            flexWrap: 'wrap', 
            padding: '16px',  
            marginBottom: '16px', 
            justifyContent: 'center',
            paddingBottom: '100px'
        }}>    

            <CalendarCard date={'March 08 2023'} status={'Passed'} present={45} total={50} startTime={'08:53'}/>  
            <CalendarCard date={'March 08 2023'} status={'Passed'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Now'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
            <CalendarCard date={'March 08 2023'} status={'Pending'} present={45} total={50} startTime={'08:53'}/>
        </Box>
    </Box>
  );
}

export default CalendarPage;