import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

function Employees() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Employees Management
        </Typography>
        <Typography variant="body1">
          Track and manage employees
        </Typography>
      </Container>
    </Box>
  );
}

export default Employees;
