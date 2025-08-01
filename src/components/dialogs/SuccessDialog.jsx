import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';

const SuccessDialog = ({ open, onClose, title, message, actionText }) => {
  const { t } = useTranslation();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
          <Typography variant="h5" component="div" fontWeight="bold">
            {title || t('login.success')}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
        <Typography variant="body1">
          {message || t('login.successDescription')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          color="primary"
          sx={{ 
            minWidth: 120,
            borderRadius: 2,
          }}
        >
          {actionText || t('login.continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;