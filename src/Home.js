import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResponsiveAppBar from './components/ResponsiveAppBar';

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to TopBliss Payroll
        </Typography>
        <Typography variant="body1">
          Welcome to your Employee Management System. You can manage your employees and payroll here.
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
