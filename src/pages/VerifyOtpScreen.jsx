import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { LockReset } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { useDialogContext } from '../contexts/DialogContext';

const VerifyOtpScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useDialogContext();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!location.state?.phone) {
      navigate('/signup');
      showError('Error', 'Phone number is required for OTP verification');
      return;
    }
    setPhone(location.state.phone);
  }, [location, navigate, showError]);

  useEffect(() => {
    if (isAuthenticated) {
      showSuccess('Verification Successful', 'You are now logged in');
      navigate('/');
    }
  }, [isAuthenticated, navigate, showSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await verifyOTP({
        phone,
        otp
      });
      // The useEffect will handle navigation after successful verification
    } catch (error) {
      setError(error.message || 'OTP verification failed');
      showError('Verification Failed', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ 
        p: 4, 
        boxShadow: 3, 
        borderRadius: 2, 
        bgcolor: 'background.paper',
        textAlign: 'center'
      }}>
        <LockReset sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Verify OTP
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter the 6-digit OTP sent to {phone}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="OTP Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="112233"
            type="text"
            inputProps={{
              maxLength: 6,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
              },
            }}
            sx={{ mb: 3 }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || otp.length !== 6}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          
          <Button
            fullWidth
            variant="text"
            sx={{ mt: 2 }}
            onClick={() => navigate('/signup')}
          >
            Back to Signup
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default VerifyOtpScreen;