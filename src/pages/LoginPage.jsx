import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            setError('Vui lòng nhập tên đăng nhập và mật khẩu');
            return;
        }
    
        setIsLoading(true);
        setError('');
    
        const response = await fetch('http://localhost:8080/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });
        
        const data = await response.json();
        if (!response.ok) {
            setError(data.message);
            setIsLoading(false);
            return;
        }
        else if (response.ok) {
            localStorage.setItem("roles", data.roles);
            navigate('/groups');
        } else {
            setError(data.message);
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
                        Đăng Nhập
                    </Typography>
                    
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    
                    <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Tên đăng nhập"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mật khẩu"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Link href="#" variant="body2">
                                Quên mật khẩu?
                            </Link>
                            <Link href="/register" variant="body2">
                                {"Chưa có tài khoản? Đăng ký"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default LoginPage;
