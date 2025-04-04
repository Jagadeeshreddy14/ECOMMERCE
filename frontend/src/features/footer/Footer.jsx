import { Box, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Stack } from '@mui/material';
import React from 'react';
import { QRCodePng, appStorePng, googlePlayPng, facebookPng, instagramPng, twitterPng, linkedinPng } from '../../assets';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
    const theme = useTheme();
    const is700 = useMediaQuery(theme.breakpoints.down(700));
    const navigate = useNavigate();

    // Color palette
    const colors = {
        darkBlue: '#1E293B',
        mediumBlue: '#334155',
        lightBlue: '#64748B',
        accent: '#3B82F6',
        white: '#F8FAFC',
        lightGray: '#E2E8F0'
    };

    // Styles
    const sectionStyles = {
        minWidth: is700 ? '100%' : '220px',
        padding: '1rem',
        marginBottom: is700 ? '2rem' : 0
    };

    const titleStyles = {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: colors.white,
        marginBottom: '1.5rem',
        position: 'relative',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-8px',
            left: 0,
            width: '40px',
            height: '3px',
            backgroundColor: colors.accent,
            borderRadius: '3px'
        }
    };

    const linkStyles = {
        color: colors.lightGray,
        marginBottom: '0.8rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            color: colors.accent,
            transform: 'translateX(5px)'
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    return (
        <Box sx={{
            backgroundColor: colors.darkBlue,
            color: colors.white,
            padding: is700 ? '2rem 1rem' : '3rem',
            borderTop: `1px solid ${colors.mediumBlue}`
        }}>
            <Stack spacing={4} sx={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Main Content */}
                <Stack 
                    direction={is700 ? 'column' : 'row'} 
                    justifyContent="space-between"
                    alignItems={is700 ? 'flex-start' : 'flex-start'}
                    flexWrap="wrap"
                >
                    {/* Email Subscription Section */}
                    <Box sx={{
                        ...sectionStyles,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Center horizontally
                        textAlign: 'center'  // Center text
                    }}>
                        <Typography variant="h6" sx={{ 
                            fontSize: '1.5rem', 
                            fontWeight: 700,
                            color: colors.white,
                            marginBottom: '1rem'
                        }}>
                            Exclusive
                        </Typography>
                        <Typography variant="body1" sx={{ 
                            color: colors.lightGray,
                            marginBottom: '1.5rem'
                        }}>
                            Premium products for your everyday needs
                        </Typography>
                        
                        <Typography variant="subtitle1" sx={{ 
                            fontWeight: 500,
                            color: colors.white,
                            marginBottom: '1rem'
                        }}>
                            Subscribe
                        </Typography>
                        
                        <Typography variant="body2" sx={{ 
                            color: colors.lightGray,
                            marginBottom: '1rem'
                        }}>
                            Get 10% off your first order
                        </Typography>
                        
                        <Stack direction="row" alignItems="center" sx={{ width: '100%', maxWidth: '400px' }}>
                            <TextField
                                placeholder="Your email address"
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{
                                    backgroundColor: colors.mediumBlue,
                                    borderRadius: '6px',
                                    '& .MuiOutlinedInput-root': {
                                        color: colors.white,
                                        '& fieldset': {
                                            borderColor: colors.lightBlue
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.accent
                                        }
                                    }
                                }}
                            />
                            <IconButton sx={{ 
                                backgroundColor: colors.accent,
                                color: colors.white,
                                marginLeft: '0.5rem',
                                '&:hover': {
                                    backgroundColor: '#2563EB'
                                }
                            }}>
                                <SendIcon />
                            </IconButton>
                        </Stack>
                    </Box>

                    {/* Support */}
                    <Box sx={sectionStyles}>
                        <Typography variant="h6" sx={titleStyles}>Support</Typography>
                        <Stack spacing={1}>
                            <Typography sx={linkStyles}>Kalasalingam University</Typography>
                            <Typography sx={linkStyles}>exclusive@gmail.com</Typography>
                            <Typography sx={linkStyles}>+88015-88888-9999</Typography>
                        </Stack>
                    </Box>

                    {/* Account */}
                    <Box sx={sectionStyles}>
                        <Typography variant="h6" sx={titleStyles}>Account</Typography>
                        <Stack spacing={1}>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/profile')}>My Account</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/login')}>Login / Register</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/')}>Home</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/cart')}>Cart</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/wishlist')}>Wishlist</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/shop')}>Shop</Typography>
                        </Stack>
                    </Box>

                    {/* Quick Links */}
                    <Box sx={sectionStyles}>
                        <Typography variant="h6" sx={titleStyles}>Quick Links</Typography>
                        <Stack spacing={1}>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/privacy-policy')}>Privacy Policy</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/terms-of-use')}>Terms Of Use</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/faq')}>FAQ</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/contact')}>Contact Us</Typography>
                            <Typography sx={linkStyles} onClick={() => handleNavigate('/about-us')}>About Us</Typography>
                        </Stack>
                    </Box>

                    {/* App Download Section */}
                    <Box sx={{ 
                        ...sectionStyles,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // Center horizontally
                        textAlign: 'center'  // Center text
                    }}>
                        <Typography variant="h6" sx={titleStyles}>Download App</Typography>
                        <Typography variant="body2" sx={{ 
                            color: colors.lightGray,
                            marginBottom: '1.5rem'
                        }}>
                            Save ₹3 with App New User Only
                        </Typography>
                        
                        {/* QR Code and App Store Links - centered */}
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: is700 ? 'column' : 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '2rem'
                        }}>
                            <Box sx={{ 
                                backgroundColor: colors.white,
                                padding: '8px',
                                borderRadius: '8px',
                                width: '90px',
                                height: '90px'
                            }}>
                                <img 
                                    src={QRCodePng} 
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }} 
                                    alt="QR Code" 
                                />
                            </Box>
                            
                            <Stack spacing={1}>
                                <motion.div whileHover={{ scale: 1.03 }}>
                                    <img 
                                        src={googlePlayPng} 
                                        style={{ 
                                            width: '120px',
                                            cursor: 'pointer'
                                        }} 
                                        alt="Google Play" 
                                        onClick={() => window.open('https://play.google.com/store')} 
                                    />
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.03 }}>
                                    <img 
                                        src={appStorePng} 
                                        style={{ 
                                            width: '120px',
                                            cursor: 'pointer'
                                        }} 
                                        alt="App Store" 
                                        onClick={() => window.open('https://www.apple.com/app-store/')} 
                                    />
                                </motion.div>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Follow Us section - centered */}
                    <Box sx={{ width: '100%',padding:1, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ 
                            color: colors.lightGray,
                            marginBottom: '0.75rem'
                        }}>
                            Follow Us
                        </Typography>
                        
                        {/* Social icons - centered */}
                        <Stack 
                            direction="row" 
                            spacing={2}
                            justifyContent="center" // Center horizontally
                            sx={{ width: '100%' }}
                        >
                            {[
                                { icon: facebookPng, url: 'https://facebook.com', color: '#1877F2' },
                                { icon: twitterPng, url: 'https://twitter.com', color: '#1DA1F2' },
                                { icon: instagramPng, url: 'https://instagram.com', color: '#E4405F' },
                                { icon: linkedinPng, url: 'https://linkedin.com', color: '#0A66C2' }
                            ].map((social, index) => (
                                <motion.div 
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <IconButton
                                        sx={{
                                            backgroundColor: colors.mediumBlue,
                                            boxShadow: `0 4px 10px ${social.color}`, // Add shadow with the social media color
                                            '&:hover': { 
                                                backgroundColor: social.color,
                                                boxShadow: `0 6px 15px ${social.color}` // Increase shadow on hover
                                            },
                                            width: '50px', // Fixed size for the button
                                            height: '50px', // Fixed size for the button
                                            transition: 'all 0.3s ease', // Smooth transition for hover effect
                                        }}
                                        onClick={() => window.open(social.url)}
                                    >
                                        <img 
                                            src={social.icon} 
                                            style={{ 
                                                width: '24px', // Fixed size for the icon
                                                height: '24px', // Fixed size for the icon
                                                objectFit: 'contain' 
                                            }} 
                                            alt={social.url.split('//')[1]} 
                                        />
                                    </IconButton>
                                </motion.div>
                            ))}
                        </Stack>
                    </Box>
                </Stack>

                {/* Copyright */}
                <Box sx={{ 
                    textAlign: 'center',
                    paddingTop: '2rem',
                    borderTop: `1px solid ${colors.mediumBlue}`,
                    marginTop: '1rem'
                }}>
                    <Typography variant="body2" sx={{ color: colors.lightGray }}>
                        &copy; {new Date().getFullYear()} Apex Store. All rights reserved
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default Footer;