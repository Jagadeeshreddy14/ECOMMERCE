import { Box, Typography } from '@mui/material'
import React from 'react'

const PrivacyPolicy = () => {
  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Privacy Policy</Typography>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Information We Collect
      </Typography>
      <Typography paragraph>
        We collect information that you provide directly to us, including your name, email address, 
        shipping address, and payment information when you make a purchase.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        How We Use Your Information
      </Typography>
      <Typography paragraph>
        We use the information we collect to process your orders, send you marketing communications 
        (if you opt in), and improve our services.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Information Security
      </Typography>
      <Typography paragraph>
        We implement appropriate security measures to protect your personal information from 
        unauthorized access, alteration, or disclosure.
      </Typography>
    </Box>
  )
}

export default PrivacyPolicy