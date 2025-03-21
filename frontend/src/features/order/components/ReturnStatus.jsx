const ReturnStatus = ({ returnRequest }) => {
  const steps = [
    'Return Requested',
    'Return Approved',
    'Pickup Scheduled',
    'Item Received',
    'Refund Processed'
  ];

  const getStepNumber = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Approved': return 1;
      case 'Pickup Scheduled': return 2;
      case 'Received': return 3;
      case 'Refund Completed': return 4;
      default: return 0;
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Return Status
      </Typography>
      
      <Stepper activeStep={getStepNumber(returnRequest.status)} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Return Details:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Return ID" 
              secondary={returnRequest._id} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Request Date" 
              secondary={new Date(returnRequest.requestDate).toLocaleDateString()} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Pickup Date" 
              secondary={returnRequest.pickupDate ? 
                new Date(returnRequest.pickupDate).toLocaleDateString() : 
                'Not scheduled'} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Refund Amount" 
              secondary={returnRequest.refundAmount ? 
                `₹${returnRequest.refundAmount}` : 
                'Pending'} 
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};