import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResponsiveAppBar from './ResponsiveAppBar';

function Attendance() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Attendance Management
        </Typography>
        <Typography variant="body1">
          Track and manage employee attendance efficiently.
        </Typography>
      </Container>
    </Box>
  );
}

export default Attendance;
