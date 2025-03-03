import React from 'react';
import { Container, Typography, Box, Zoom } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

function Attendance() {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar />
      <Zoom in={show} timeout={300}>
        <Container sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Attendance
          </Typography>
          <Typography variant="body1">
            Track employee attendance here.
          </Typography>
        </Container>
      </Zoom>
    </Box>
  );
}

export default Attendance;

