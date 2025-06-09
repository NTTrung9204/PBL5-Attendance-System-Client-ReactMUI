import { Box } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { memo, useState, useEffect } from "react";
import MenuButton from "./MenuButton";
import Tooltip from '@mui/material/Tooltip';
import { stringAvatar } from "../utils/helper"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom"
import api from "../api/axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function Card({groupTeamName, classId, onHideStatusChange, initialHidden = false}) {
    const navigate = useNavigate();
    const [isHidden, setIsHidden] = useState(initialHidden);
    const [openRenameDialog, setOpenRenameDialog] = useState(false);
    const [openQuitDialog, setOpenQuitDialog] = useState(false);
    const [openStudentListDialog, setOpenStudentListDialog] = useState(false);
    const [newClassName, setNewClassName] = useState(groupTeamName);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        setIsHidden(initialHidden);
        const roles = localStorage.getItem('roles');
        setIsTeacher(roles && roles.includes('ROLE_TEACHER'));
        setIsStudent(roles && roles.includes('ROLE_STUDENT'));
    }, [initialHidden]);

    const fetchStudents = async () => {
        try {
            const response = await api.get(`/api/classes/${classId}/students`, {
                withCredentials: true
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleHideUnhide = async (e) => {
        e.stopPropagation();
        try {
            const roles = localStorage.getItem('roles');
            if (roles && roles.includes('ROLE_STUDENT')) {
                await api.patch(`/api/student-class/updateHidden/${classId}`, {}, {
                    withCredentials: true
                });
                const newHiddenState = !isHidden;
                setIsHidden(newHiddenState);
                if (onHideStatusChange) {
                    onHideStatusChange(classId, newHiddenState);
                }
            } else if (roles && roles.includes('ROLE_TEACHER')) {
                await api.patch(`/api/classes/updateHiddenToTeacher/${classId}`, {}, {
                    withCredentials: true
                });
                const newHiddenState = !isHidden;
                setIsHidden(newHiddenState);
                if (onHideStatusChange) {
                    onHideStatusChange(classId, newHiddenState);
                }
            }
        } catch (error) {
            console.error('Error updating hide status:', error);
        }
    };

    const handleRename = async () => {
        try {
            await api.patch(`/api/classes/rename/${classId}`, 
                { newName: newClassName },
                { withCredentials: true }
            );
            setOpenRenameDialog(false);
            window.location.reload();
        } catch (error) {
            console.error('Error renaming class:', error);
        }
    };

    const handleQuit = async () => {
        try {
            await api.delete(`/api/student-class/quit/${classId}`, {
                withCredentials: true
            });
            setOpenQuitDialog(false);
            window.location.reload();
        } catch (error) {
            console.error('Error quitting class:', error);
        }
    };

    const handleOpenStudentList = async (e) => {
        e.stopPropagation();
        await fetchStudents();
        setOpenStudentListDialog(true);
    };

    const menuItemsList = [
        {
            title: "Thông tin",
            onClick: (e) => {
                e.stopPropagation();
                navigate(`/class/${classId}`)
            }
        },
        {
            title: isHidden ? "Hiện" : "Ẩn",
            onClick: handleHideUnhide
        },
        {
            title: "Danh sách học sinh",
            onClick: handleOpenStudentList
        }
    ];

    // Add rename option only for teachers
    if (isTeacher) {
        menuItemsList.push({
            title: "Đổi tên lớp",
            onClick: (e) => {
                e.stopPropagation();
                setOpenRenameDialog(true);
            }
        });
    }

    // Add quit option only for students
    if (isStudent) {
        menuItemsList.push({
            title: "Rời lớp học",
            onClick: (e) => {
                e.stopPropagation();
                setOpenQuitDialog(true);
            }
        });
    }

    // Tạo avatar props an toàn, kiểm tra nếu groupTeamName không tồn tại
    const avatarData = stringAvatar(groupTeamName);
    const avatarProps = {
        sx: { 
          bgcolor: avatarData.color,
          width: 72,
          height: 72,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        },
        children: avatarData.initials
      };

    return (
        <>
            <Box  
                sx={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    width: "350px",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.16)',
                    '&:hover':{
                        backgroundColor: '#F8F9FA',
                        cursor: 'pointer'
                    },
                }}
                onClick={() => navigate(`/calendar/${classId}`)}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        width: "100%"
                    }}
                >
                    <Avatar  
                        variant="rounded"
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/calendar/${classId}`);
                        }}    
                        {...avatarProps} 
                    />
                    <Tooltip title={groupTeamName || "Không có tên"} arrow>
                        <span 
                           
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/calendar/${classId}`);    
                        }}       

                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: "500",
                            transition: "color 0.2s ease",
                            color: "#333",
                        }}>
                            {groupTeamName || "Không có tên"}
                        </span>
                    </Tooltip>
                    <div onClick={(e) => e.stopPropagation()}>
                        <MenuButton menuItem={menuItemsList} />
                    </div>
                </Box>
                <Box
                    sx={{marginTop: "10px"}}
                    
                >
                    <Tooltip title="Thông báo">
                        <IconButton>
                            <NotificationsActiveIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Bài tập">
                        <IconButton>
                            <BusinessCenterIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Bài giảng">
                        <IconButton>
                            <SquareFootIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Rename Dialog */}
            <Dialog open={openRenameDialog} onClose={() => setOpenRenameDialog(false)}>
                <DialogTitle>Đổi tên lớp học</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên lớp mới"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRenameDialog(false)}>Hủy</Button>
                    <Button onClick={handleRename} variant="contained" color="primary">
                        Đổi tên lớp
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Quit Dialog */}
            <Dialog open={openQuitDialog} onClose={() => setOpenQuitDialog(false)}>
                <DialogTitle>Rời lớp học</DialogTitle>
                <DialogContent>
                    <p>Bạn có chắc chắn muốn rời khỏi lớp học này? Hành động này không thể hoàn tác.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQuitDialog(false)}>Hủy</Button>
                    <Button onClick={handleQuit} variant="contained" color="error">
                        Rời lớp
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Student List Dialog */}
            <Dialog 
                open={openStudentListDialog} 
                onClose={() => setOpenStudentListDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <GroupIcon />
                    Danh sách học sinh
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <List sx={{ 
                        width: '100%', 
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        '& .MuiListItem-root': {
                            transition: 'all 0.3s ease',
                            borderRadius: 1,
                            mb: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(33, 150, 243, 0.04)',
                                transform: 'translateX(8px)'
                            }
                        }
                    }}>
                        {students.map((student, index) => (
                            <div key={student.id}>
                                <ListItem 
                                    alignItems="center"
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                    }}
                                >
                                    <ListItemAvatar sx={{ mr: 2, minWidth: 0 }}>
                                        <Avatar 
                                            src={`${api.defaults.baseURL}/avatars/${student.username}.jpg`}
                                            alt={student.name}
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                border: '2px solid',
                                                borderColor: 'primary.main',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                                                },
                                                display: 'block',
                                                mx: 'auto',
                                            }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    mb: 0.5
                                                }}
                                            >
                                                {student.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 1 }}>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    color="primary"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mb: 0.5,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    <PersonIcon fontSize="small" />
                                                    {student.username}
                                                </Typography>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    <EmailIcon fontSize="small" />
                                                    {student.email}
                                                </Typography>
                                                <Typography
                                                    component="div"
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}
                                                >
                                                    <PhoneIcon fontSize="small" />
                                                    {student.phone}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                        onClick={() => setOpenStudentListDialog(false)}
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                            }
                        }}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Card;