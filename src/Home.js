import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResponsiveAppBar from './components/ResponsiveAppBar';

function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to TopBliss Payroll
        </Typography>
        <Typography variant="body1">
          pano ba workflow
        </Typography>
      </Container>
    </Box>
  );
}

export default Home;
