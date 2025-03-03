import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutDialog from './LogoutDialog';
import logobliss from '../assets/logobliss.png';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && currentUser.uid) {
        try {
          // First, try to find the user document where uid matches
          const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log('Found user data:', userData); // Debug log
            setUserData(userData);
          } else {
            console.log('No user document found for uid:', currentUser.uid); // Debug log
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Add debug log to see what's in userData when rendering
  console.log('Current userData state:', userData);

  const pages = [
    { name: 'Home', path: '/home' },
    { name: 'Employees', path: '/employees' },
    { name: 'Payroll', path: '/payroll' },
     {name: 'Attendance', path: '/attendance'} 
  ];

  const settings = [
    { name: userData ? `${userData.email}` : (currentUser?.email || 'User'), path: '/profile' },
    { name: 'Account', path: '/account' },
    { name: 'Logout', action: () => setLogoutDialogOpen(true) }
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigation = (path) => {
    handleCloseNavMenu();
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setLogoutDialogOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSettingClick = (setting) => {
    handleCloseUserMenu();
    if (setting.action) {
      setting.action();
    } else {
      navigate(setting.path);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img
              src={logobliss}
              alt="TopBliss Logo"
              style={{
                height: '40px',
                marginRight: '10px',
                display: { xs: 'none', md: 'flex' }
              }}
            />
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: '"League Spartan", sans-serif',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Top Bliss Solutions Inc.
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={() => handleNavigation(page.path)}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogoutClick}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: '"League Spartan", sans-serif',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              TopBliss
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleNavigation(page.path)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Typography 
                variant="subtitle1" 
                component="span" 
                sx={{ 
                  mr: 2,
                  color: 'inherit',
                  cursor: 'pointer',
                  fontFamily: '"League Spartan", sans-serif',
                }}
                onClick={handleOpenUserMenu}
              >
                Welcome, {userData ? (userData.firstName || currentUser.email) : 'User'}!
              </Typography>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={() => handleSettingClick(setting)}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

export default ResponsiveAppBar;
