import React from 'react';
import { Container, Typography, Box, Zoom } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';

function Payroll() {
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
            Payroll Management
          </Typography>
          <Typography variant="body1">
            Manage your company's payroll efficiently.
          </Typography>
        </Container>
      </Zoom>
    </Box>
  );
}

export default Payroll;

