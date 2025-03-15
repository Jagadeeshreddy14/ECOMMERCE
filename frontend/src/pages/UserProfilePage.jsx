import React from 'react';
import { UserProfile } from '../features/user/components/UserProfile';
import { Navbar } from '../features/navigation/components/Navbar';
import { Box, Stack, Typography, useTheme, useMediaQuery } from '@mui/material'; // Added Typography here

export const UserProfilePage = () => {
  const theme = useTheme();
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  return (
    <Box
      sx={{
        minHeight: '100vh', // Ensure the page takes up the full viewport height
        backgroundColor: '#c0c0c0', // Light background color
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navbar */}
      <Navbar
        sx={{
          backgroundColor: '#c0c0c0', // White background for the navbar
          borderBottom: '1px solidrgb(141, 150, 151)', // Subtle border at the bottom
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
        }}
      />

      {/* Main Content */}
      <Box
        flexGrow={1} // Allows the main content to take up available space
        sx={{
          padding: { xs: '1rem', md: '2rem' }, // Responsive padding
          maxWidth: '1200px', // Limit the width for larger screens
          margin: '0 auto', // Center the content horizontally
        }}
      >
        {/* User Profile Section */}
        <Stack
          spacing={0} // Add spacing between elements
          sx={{
            backgroundColor: '#fdf5e6', // White background for the profile section
            padding: { xs: '1rem', md: '2rem' }, // Responsive padding
            borderRadius: '50px', // Rounded corners
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for depth
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              textAlign: 'center',
            }}
          >
            User Profile
          </Typography>

          {/* Render the UserProfile Component */}
          <UserProfile />
        </Stack>
      </Box>
    </Box>
  );
};