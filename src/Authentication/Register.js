import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Box, Link, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification, reload } from 'firebase/auth';
import { db, auth } from '../firebase';
import CryptoJS from 'crypto-js';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    let verificationCheck;
    if (verificationPending && tempUserData) {
      verificationCheck = setInterval(async () => {
        try {
          await reload(tempUserData);
          
          if (tempUserData.emailVerified) {
            clearInterval(verificationCheck);
            
            try {
              // Add verified user to Firestore
              await addDoc(collection(db, 'users'), {
                uid: tempUserData.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                fullName: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                emailVerified: true,
                createdAt: new Date().toISOString()
              });

              // Immediately navigate to login without changing state
              navigate('/login', { 
                state: { 
                  verificationSuccess: true,
                  message: 'Email verified! Account created successfully.' 
                }
              });
              
            } catch (error) {
              console.error('Firestore error:', error);
              setError('Error creating user profile. Please contact support.');
            }
          }
        } catch (error) {
          console.error('Verification check error:', error);
        }
      }, 2000);
    }

    return () => {
      if (verificationCheck) {
        clearInterval(verificationCheck);
      }
    };
  }, [verificationPending, tempUserData, formData, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setVerificationPending(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Check if email already exists in Firestore
      const q = query(collection(db, 'users'), where('email', '==', formData.email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setError('Email already exists');
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Store temp user data and send verification email
      setTempUserData(userCredential.user);
      await sendEmailVerification(userCredential.user);
      setVerificationPending(true);
      
      setSuccess(
        'Please check your email to verify your account. ' +
        'Once verified, you will be automatically redirected to the login page. ' +
        'Please do not close this window.'
      );

    } catch (err) {
      let errorMessage = 'Failed to register. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already registered.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setError(errorMessage);
      console.error('Registration error:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '90vh',
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
          width: '90%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" component="h1" gutterBottom>
          <b>Create Account</b>
        </Typography>
        <Typography variant="body2" gutterBottom>
          Fill in your details to register.
        </Typography>
        
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        {verificationPending && (
          <Alert severity="info">
            Verification email sent! Please check your email and click the verification link.
            This page will automatically redirect you once verified.
            Keep this window open.
          </Alert>
        )}
        
        <form onSubmit={handleRegister} style={{ display: verificationPending ? 'none' : 'block' }}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
