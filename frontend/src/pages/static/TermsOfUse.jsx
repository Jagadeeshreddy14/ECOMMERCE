import { Box, Typography } from '@mui/material'
import React from 'react'

const TermsOfUse = () => {
  return (
    <Box sx={{ p: 4, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Terms of Use</Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        1. Acceptance of Terms
      </Typography>
      <Typography paragraph>
        By accessing and using this website, you accept and agree to be bound by the terms and 
        provisions of this agreement.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        2. User Account
      </Typography>
      <Typography paragraph>
        You are responsible for maintaining the confidentiality of your account and password. 
        You agree to accept responsibility for all activities that occur under your account.
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        3. Purchase and Payment
      </Typography>
      <Typography paragraph>
        When making a purchase, you agree to provide current, complete, and accurate purchase 
        and account information. All payments must be made through our secure payment system.
      </Typography>
    </Box>
  )
}

export default TermsOfUse