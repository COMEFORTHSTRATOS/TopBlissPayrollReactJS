import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Box, Link, Alert } from '@mui/material';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getDoc, query, collection, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import loginpage from '../assets/loginpage.png'; // Update import to use loginpage

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserData } = useAuth();
  const [showResendButton, setShowResendButton] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.verificationSuccess ? location.state.message : ''
  );

  // Clear location state after reading it
  useEffect(() => {
    if (location.state?.verificationSuccess) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleResendVerification = async () => {
    try {
      if (currentUser) {
        await sendEmailVerification(currentUser);
        setError('');
        setShowResendButton(false);
        alert('Verification email has been resent. Please check your inbox.');
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShowResendButton(false);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);

      if (!userCredential.user.emailVerified) {
        setError('Please verify your email before logging in.');
        setShowResendButton(true);
        setLoading(false);
        return;
      }

      // Get user data from Firestore
      const q = query(collection(db, 'users'), where('uid', '==', userCredential.user.uid));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setError('User profile not found. Please register again.');
        await auth.signOut();
        setLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      setUserData(userDoc.data());
      navigate('/home');

    } catch (error) {
      let errorMessage = 'Failed to login. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      }
      setError(errorMessage);
      setShowResendButton(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img src={loginpage} alt="Login Page" style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
          <b>TopBliss HR Admin</b>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Sign in to continue.
        </Typography>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {error && (
          <Alert severity="error">
            {error}
            {showResendButton && (
              <Button
                color="inherit"
                size="small"
                onClick={handleResendVerification}
                sx={{ ml: 1 }}
              >
                Resend Verification
              </Button>
            )}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            required
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            required
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
