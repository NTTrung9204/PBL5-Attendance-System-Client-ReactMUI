import { Box, Typography } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Navigate, useNavigate } from "react-router-dom";

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    width: "300px",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: 'pointer',
  },
  row: {
    display: "flex",
    justifyContent: "space-between",

    marginLeft: '4px',
    marginRight: '4px',
    alignItems: "center",
    marginBottom: "8px",
  },
  dateContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px", // Khoảng cách giữa icon và text
  },
  statusBox: (status) => ({
    padding: "4px 12px",
    borderRadius: "15px",
    fontWeight: "bold",
    color: "#333",
    fontSize: '14px',
    backgroundColor:
      status === "Passed"
        ? "#FFD700" // Vàng
        : status === "Now"
        ? "#4CAF50" // Xanh lá cây
        : status === "Pending"
        ? "#ccc" // Xám
        : "#f5f5f5", // Mặc định
  }),
  subContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  boxItem: {
    flex: 1,
    textAlign: "center",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    margin: "4px",
  },
};

function CalendarCard({ date, status, present, total, startTime }) {
  const navigate = useNavigate()
  return (
    <Box sx={{
        ...styles.container,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-10px)',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)'
        }
      }}
      onClick={() => navigate('/calendar/attendance')}
      >
      {/* Hàng 1: Date & Status */}
      <Box style={styles.row}>
        <Box style={styles.dateContainer}>
          <ScheduleIcon />
          <Typography>{date}</Typography>
        </Box>
        <Typography style={styles.statusBox(status)}>{status}</Typography>
      </Box>

      {/* Hàng 2: Start Time & Present/Total */}
      <Box style={styles.subContainer}>
        <Box style={styles.boxItem}>
          <Typography variant="body2">Start Time</Typography>
          <Typography variant="h6">{startTime}</Typography>
        </Box>
        <Box style={styles.boxItem}>
          <Typography variant="body2">Present</Typography>
          <Typography variant="h6">
            {present}/{total}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CalendarCard;
