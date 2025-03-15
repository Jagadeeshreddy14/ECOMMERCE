import { Box, Container, Typography, TextField, Button, Stack } from '@mui/material';
import React from 'react'

const ContactUs = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Contact Us</Typography>
      <Box component="form" sx={{ mt: 3 }}>
        <Stack spacing={3}>
          <TextField required fullWidth label="Name" />
          <TextField required fullWidth label="Email" type="email" />
          <TextField required fullWidth label="Subject" />
          <TextField required fullWidth label="Message" multiline rows={4} />
          <Button variant="contained" size="large">Send Message</Button>
        </Stack>
      </Box>
    </Container>
  )
}

export default ContactUs