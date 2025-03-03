import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

function Attendance() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Container sx={{ mt: 4 }}>
  
                      <Typography variant="h5" gutterBottom>
         Attendance hahahaah
        </Typography>
        <Typography variant="body1">
          Track employee attendance here.
                
        </Typography>
      </Container>
    </Box>
  );
}

export default Attendance;

                