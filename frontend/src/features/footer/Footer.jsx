import { Box, IconButton, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Stack } from '@mui/material';
import React from 'react';
import { QRCodePng, appStorePng, googlePlayPng, facebookPng, instagramPng, twitterPng, linkedinPng } from '../../assets';
import SendIcon from '@mui/icons-material/Send';
import { MotionConfig, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export const Footer = () => {
    const theme = useTheme();
    const is700 = useMediaQuery(theme.breakpoints.down(700));
    const navigate = useNavigate(); // Hook for navigation

    const labelStyles = {
        fontWeight: 300,
        cursor: 'pointer',
    };

    // Navigation functions
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Stack sx={{ backgroundColor: theme.palette.primary.main, paddingTop: "3rem", paddingLeft: is700 ? "1rem" : "3rem", paddingRight: is700 ? "1rem" : "3rem", paddingBottom: "1.5rem", rowGap: "5rem", color: theme.palette.primary.light, justifyContent: "space-around" }}>

            {/* Upper Section */}
            <Stack flexDirection={'row'} rowGap={'1rem'} justifyContent={is700 ? "" : 'space-around'} flexWrap={'wrap'}>

                {/* Subscribe Section */}
                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6' fontSize={'1.5rem'}>Exclusive</Typography>
                    <Typography variant='h6'>Subscribe</Typography>
                    <Typography sx={labelStyles}>Get 10% off your first order</Typography>
                    <TextField placeholder='Enter your email' sx={{ border: '1px solid white', borderRadius: "6px" }} InputProps={{ endAdornment: <IconButton><SendIcon sx={{ color: theme.palette.primary.light }} /></IconButton>, style: { color: "whitesmoke" } }} />
                </Stack>

                {/* Support Section */}
                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6'>Support</Typography>
                    <Typography sx={labelStyles}>Kalasalingam University</Typography>
                    <Typography sx={labelStyles}>exclusive@gmail.com</Typography>
                    <Typography sx={labelStyles}>+88015-88888-9999</Typography>
                </Stack>

                {/* Account Section */}
                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6'>Account</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/profile')}>My Account</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/login')}>Login / Register</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/cart')}>Cart</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/wishlist')}>Wishlist</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/shop')}>Shop</Typography>
                </Stack>

                {/* Quick Links Section */}
                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6'>Quick Links</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/privacy-policy')}>Privacy Policy</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/terms-of-use')}>Terms Of Use</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/faq')}>FAQ</Typography>
                    <Typography sx={labelStyles} onClick={() => handleNavigate('/contact')}>Contact</Typography>
                </Stack>

                {/* Download App Section */}
                <Stack rowGap={'1rem'} padding={'1rem'}>
                    <Typography variant='h6'>Download App</Typography>
                    <Typography sx={{ ...labelStyles, color: "graytext", fontWeight: 500 }}>Save ₹3 with App New User Only</Typography>
                    <Stack flexDirection={'row'} columnGap={'.5rem'}>

                        {/* QR Code */}
                        <Box width={'100px'} height={"100px"}>
                            <img src={QRCodePng} height={'100%'} width={'100%'} style={{ objectFit: 'contain' }} alt="QR Code" />
                        </Box>

                        {/* App Store and Google Play Buttons */}
                        <Stack justifyContent={'space-around'}>
                            <Stack>
                                <img style={{ width: "100%", height: "100%", cursor: "pointer" }} src={googlePlayPng} alt="GooglePlay" onClick={() => window.open('https://play.google.com/store')} />
                            </Stack>
                            <Stack>
                                <img style={{ width: "100%", height: '100%', cursor: "pointer" }} src={appStorePng} alt="AppStore" onClick={() => window.open('https://www.apple.com/app-store/')} />
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Social Media Icons */}
                    <Stack mt={.6} flexDirection={'row'} columnGap={'2rem'}>
                        <MotionConfig whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }}>
                            <motion.img style={{ cursor: "pointer" }} src={facebookPng} alt="Facebook" onClick={() => window.open('https://facebook.com')} />
                            <motion.img style={{ cursor: "pointer" }} src={twitterPng} alt="Twitter" onClick={() => window.open('https://twitter.com')} />
                            <motion.img style={{ cursor: "pointer" }} src={instagramPng} alt="Instagram" onClick={() => window.open('https://instagram.com')} />
                            <motion.img style={{ cursor: "pointer" }} src={linkedinPng} alt="Linkedin" onClick={() => window.open('https://linkedin.com')} />
                        </MotionConfig>
                    </Stack>
                </Stack>

            </Stack>

            {/* Lower Section */}
            <Stack alignSelf={"center"}>
                <Typography color={'GrayText'}>&copy; Apex Store {new Date().getFullYear()}. All right reserved</Typography>
            </Stack>

        </Stack>
    );
};