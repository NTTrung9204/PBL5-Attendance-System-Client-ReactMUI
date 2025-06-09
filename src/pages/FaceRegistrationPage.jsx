import React, { useState, useRef, useEffect } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    Grid, 
    Paper, 
    IconButton, 
    Alert,
    Container,
    useTheme,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Fade,
    Zoom
} from '@mui/material';
import { 
    CameraAlt, 
    Delete, 
    Check, 
    Upload, 
    Face, 
    PhotoCamera,
    ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function FaceRegistrationPage() {
    const theme = useTheme();
    const [images, setImages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Video ref:", videoRef.current);
    }, []);

    const startCamera = async () => {
        try {
            console.log("Bắt đầu khởi động camera...");
            setIsCapturing(true);
            setCameraError("");
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            console.log("Đã nhận stream:", stream);
            
            if (videoRef.current) {
                console.log("Video ref tồn tại:", videoRef.current);
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            } else {
                console.log("Video ref không tồn tại!");
                setIsCapturing(false);
            }
        } catch (err) {
            console.error('Lỗi khi khởi động camera:', err);
            setIsCapturing(false);
            if (err.name === 'NotAllowedError') {
                setCameraError("Camera đã bị chặn. Vui lòng cho phép truy cập camera trong cài đặt trình duyệt.");
            } else if (err.name === 'NotFoundError') {
                setCameraError("Không tìm thấy camera. Vui lòng kiểm tra kết nối camera.");
            } else if (err.name === 'NotReadableError') {
                setCameraError("Camera đang được sử dụng bởi ứng dụng khác. Vui lòng đóng các ứng dụng đang sử dụng camera.");
            } else if (err.name === 'SecurityError') {
                setCameraError("Truy cập camera bị chặn do vấn đề bảo mật. Vui lòng truy cập qua HTTPS hoặc 192.168.180.164.");
            } else {
                setCameraError("Lỗi không xác định khi khởi động camera: " + err.message);
            }
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            setImages([...images, imageData]);
        }
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImages(prevImages => [...prevImages, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCapturing(false);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const username = localStorage.getItem('pendingFaceRegistration');
            if (!username) {
                console.error('Không tìm thấy thông tin đăng ký khuôn mặt');
                return;
            }

            console.log("Đang gửi yêu cầu đăng ký khuôn mặt với username:", username);
            console.log("Hình ảnh đang gửi:", images);

            const faceResponse = await fetch('http://localhost:5000/api/face/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    images: images
                }),
                credentials: 'include',
                mode: 'cors'
            });

            if (faceResponse.ok) {
                navigate('/login');
            } else {
                console.error('Lỗi khi đăng ký khuôn mặt');
            }
        } catch (error) {
            console.error('Lỗi:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Đăng Ký Khuôn Mặt
                </Typography>
                <Divider sx={{ width: '60px', borderWidth: 2, borderColor: theme.palette.primary.main, mb: 2 }} />
                <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 600 }}>
                    Vui lòng chụp ít nhất 3 ảnh khuôn mặt ở các góc độ khác nhau để đảm bảo độ chính xác của hệ thống
                </Typography>
            </Box>

            {cameraError && (
                <Fade in={!!cameraError}>
                    <Alert 
                        severity="error" 
                        sx={{ 
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)'
                        }}
                    >
                        {cameraError}
                    </Alert>
                </Fade>
            )}

            <Card 
                elevation={6} 
                sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                    }
                }}
            >
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box 
                                sx={{ 
                                    position: 'relative',
                                    width: '100%',
                                    height: 400,
                                    bgcolor: 'grey.100',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                {!isCapturing ? (
                                    <Box sx={{ 
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        alignItems: 'center',
                                        width: '100%',
                                        p: 2
                                    }}>
                                        <Face sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<CameraAlt />}
                                            onClick={startCamera}
                                            sx={{
                                                minWidth: 200,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            Bật Camera
                                        </Button>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                        />
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Upload />}
                                            onClick={() => fileInputRef.current.click()}
                                            sx={{
                                                minWidth: 200,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            Tải ảnh lên
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            style={{ 
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transform: 'scaleX(-1)'
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={captureImage}
                                            startIcon={<PhotoCamera />}
                                            sx={{ 
                                                position: 'absolute',
                                                bottom: 16,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                borderRadius: 2,
                                                py: 1.5,
                                                px: 3,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                                                '&:hover': {
                                                    transform: 'translateX(-50%) translateY(-2px)',
                                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            Chụp ảnh
                                        </Button>
                                    </>
                                )}
                            </Box>
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Ảnh đã chụp ({images.length}/3)
                                </Typography>
                                <Box 
                                    sx={{ 
                                        flex: 1,
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        p: 2,
                                        bgcolor: 'grey.50',
                                        borderRadius: 2,
                                        minHeight: 300,
                                        maxHeight: 400,
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '8px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: 'transparent',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: theme.palette.grey[300],
                                            borderRadius: '4px',
                                            '&:hover': {
                                                background: theme.palette.grey[400],
                                            },
                                        },
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    {images.map((image, index) => (
                                        <Zoom in={true} key={index}>
                                            <Box sx={{ position: 'relative' }}>
                                                <img
                                                    src={image}
                                                    alt={`Ảnh ${index + 1}`}
                                                    style={{ 
                                                        width: 120,
                                                        height: 120,
                                                        objectFit: 'cover',
                                                        borderRadius: 8,
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeImage(index)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -8,
                                                        right: -8,
                                                        bgcolor: 'white',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        '&:hover': { 
                                                            bgcolor: 'error.light',
                                                            color: 'white'
                                                        },
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Zoom>
                                    ))}
                                    {images.length === 0 && (
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'text.secondary'
                                            }}
                                        >
                                            <Typography variant="body1" align="center">
                                                Chưa có ảnh nào được chụp
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box 
                        sx={{ 
                            mt: 4,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate(-1)}
                            sx={{
                                borderRadius: 2,
                                py: 1.2,
                                px: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                            }}
                        >
                            Quay lại
                        </Button>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={stopCamera}
                                disabled={!isCapturing}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    px: 3,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Tắt Camera
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={images.length < 3 || isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Check />}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.2,
                                    px: 3,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất'}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

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
                            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
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
    );
}

export default FaceRegistrationPage;