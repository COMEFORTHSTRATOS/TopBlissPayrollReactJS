import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Paper, Typography, TextField, Button, Box, Link, Alert, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { collection, setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  reload, 
  onAuthStateChanged, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { db, auth } from '../firebase';

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
  const [loading, setLoading] = useState(false);
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
    let attempts = 0;
    const MAX_ATTEMPTS = 30; // 60 seconds (30 attempts × 2 seconds)
    
    if (verificationPending && tempUserData) {
      // Set up auth state listener for verification
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && user.uid === tempUserData.uid) {
          try {
            await reload(user);
            
            if (user.emailVerified) {
              clearInterval(verificationCheck);
              unsubscribe();
              
              try {
                setLoading(true);
                
                // Make sure we're signed in before writing to Firestore
                if (!auth.currentUser) {
                  // Silent re-authentication if needed
                  await signInWithEmailAndPassword(auth, formData.email.toLowerCase().trim(), formData.password);
                }
                
                // Create or update user document
                await setDoc(doc(db, 'users', user.uid), {
                  uid: user.uid,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  fullName: `${formData.firstName} ${formData.lastName}`,
                  email: formData.email.toLowerCase().trim(),
                  emailVerified: true,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });

                navigate('/login', { 
                  state: { 
                    verificationSuccess: true,
                    message: 'Email verified! Account created successfully.' 
                  }
                });
                
              } catch (error) {
                console.error('Firestore error:', error);
                setError(`Error creating user profile: ${error.message}`);
                setLoading(false);
              }
            }
          } catch (error) {
            console.error('Auth state check error:', error);
          }
        }
      });
      
      // Backup interval check
      verificationCheck = setInterval(async () => {
        try {
          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(verificationCheck);
            setError('Verification timeout. Please try logging in or request a new verification email.');
            setVerificationPending(false);
            return;
          }
          
          // Try to reload the current user if available
          const currentUser = auth.currentUser;
          if (currentUser) {
            await reload(currentUser);
            
            if (currentUser.emailVerified) {
              clearInterval(verificationCheck);
              
              try {
                // Create or update user profile
                await setDoc(doc(db, 'users', currentUser.uid), {
                  uid: currentUser.uid,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  fullName: `${formData.firstName} ${formData.lastName}`,
                  email: formData.email.toLowerCase().trim(),
                  emailVerified: true,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });

                navigate('/login', { 
                  state: { 
                    verificationSuccess: true,
                    message: 'Email verified! Account created successfully.' 
                  }
                });
              } catch (error) {
                console.error('Firestore error in interval check:', error);
                setError(`Error creating user profile: ${error.message}`);
              }
            }
          }
        } catch (error) {
          console.error('Verification check error:', error);
        }
      }, 2000);
      
      return () => {
        if (verificationCheck) clearInterval(verificationCheck);
        if (unsubscribe) unsubscribe();
      };
    }
  }, [verificationPending, tempUserData, formData, navigate]);

  const validateForm = () => {
    if (formData.firstName.trim() === '' || formData.lastName.trim() === '') {
      setError('First name and last name are required');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation - at least 6 chars
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Password matching
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Normalize email to lowercase and trim whitespace
      const normalizedEmail = formData.email.toLowerCase().trim();
      
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        formData.password
      );

      // Only create initial profile if we're already authenticated
      if (auth.currentUser) {
        try {
          // Create temporary user document (will be updated after verification)
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            firstName: formData.firstName,
            lastName: formData.lastName,
            fullName: `${formData.firstName} ${formData.lastName}`,
            email: normalizedEmail,
            emailVerified: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (profileErr) {
          console.warn("Could not create initial profile, will create after verification:", profileErr);
        }
      }

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
      console.error('Registration error code:', err.code);
      console.error('Registration full error:', err);
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection and try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.';
          break;
        default:
          errorMessage = `Registration failed: ${err.message || 'Unknown error'}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    disabled={loading}
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
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    disabled={loading}
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
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