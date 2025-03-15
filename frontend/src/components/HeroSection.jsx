import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

const HeroSection = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        mb: 4
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ maxWidth: 600 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.75rem' }
            }}
          >
            Welcome to Our Store
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Discover amazing products at great prices
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Shop Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;