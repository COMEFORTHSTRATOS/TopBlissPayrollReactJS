import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

function Payroll() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payroll Management
        </Typography>
        <Typography variant="body1">
          Manage your company's payroll efficiently.
        </Typography>
      </Container>
    </Box>
  );
}

export default Payroll;
