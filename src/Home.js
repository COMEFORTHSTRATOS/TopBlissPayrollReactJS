import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResponsiveAppBar from './ResponsiveAppBar';

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to TopBliss Payroll
        </Typography>
        <Typography variant="body1">
          Your one-stop solution for managing payroll and attendance.
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
