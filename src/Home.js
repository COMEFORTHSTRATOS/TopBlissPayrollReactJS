import React from 'react';
import { Container, Typography, Box, Zoom } from '@mui/material';
import ResponsiveAppBar from './components/ResponsiveAppBar';

function Home() {
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
            Welcome to TopBliss Payroll
          </Typography>
          <Typography variant="body1">
            Welcome to your Employee Management System. You can manage your employees and payroll here.
          </Typography>
        </Container>
      </Zoom>
    </Box>
  );
}

export default Home;
