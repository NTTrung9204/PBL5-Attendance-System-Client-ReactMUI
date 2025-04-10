import React, { useState } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Link,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('ROLE_STUDENT');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        const registrationData = {
            username,
            password,
            confirmPassword,
            roles: [role],
            name,
            phone,
            email
        };

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            if (!response.ok) {
                const data = await response.json();
                console.log(data);
                throw new Error(data.message);
            }

            setSuccess(true);
            setError('');

            // Nếu là học sinh, lưu username và chuyển hướng
            if (role === 'ROLE_STUDENT') {
                localStorage.setItem('pendingFaceRegistration', username);
                setTimeout(() => {
                    navigate('/face-registration');
                }, 2000);
            } else {
                // Nếu là giáo viên, chuyển hướng về login
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            setError(error.message);
            console.error('Lỗi đăng ký:', error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
                    <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
                        Đăng Ký Tài Khoản
                    </Typography>
                    
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>
                        {role === 'ROLE_STUDENT' 
                            ? 'Tiến hành lấy dữ liệu khuôn mặt...' 
                            : 'Đăng ký thành công! Đang chuyển hướng...'}
                    </Alert>}
                    
                    <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Họ và tên"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Số điện thoại"
                            name="phone"
                            autoComplete="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Tên đăng nhập"
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-label">Vai trò</InputLabel>
                            <Select
                                labelId="role-label"
                                id="role"
                                value={role}
                                label="Vai trò"
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
                                <MenuItem value="ROLE_TEACHER">Giáo viên</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mật khẩu"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                        >
                            Đăng Ký
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Đã có tài khoản? Đăng nhập
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default RegisterPage;
