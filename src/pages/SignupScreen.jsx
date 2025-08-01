import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link
} from '@mui/material';
import { Phone, Lock, Person } from '@mui/icons-material';
import useAuth from '../hooks/useAuth';
import { useDialogContext } from '../contexts/DialogContext';

const SignupScreen = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSuccess, showError } = useDialogContext();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? value.replace(/\D/g, '') : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.phone || formData.phone.length < 11) {
      newErrors.phone = 'Valid phone number is required';
      valid = false;
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await register({
        name: formData.name,
        phone: formData.phone,
        password: formData.password
      });

      if (response.status === 'success') {
        showSuccess('Registration successful', 'Please verify your phone number with the OTP sent to you');
        navigate('/verify-otp', { state: { phone: formData.phone } });
      }
    } catch (error) {
      showError('Registration failed', error.message || 'Something went wrong');
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
        bgcolor: 'background.paper' 
      }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Create Account
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link href="/login" sx={{ cursor: 'pointer' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupScreen;