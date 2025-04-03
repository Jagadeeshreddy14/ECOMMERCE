import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithGoogle } from '../../../services/firebaseAuth';

export const GoogleAuth = ({ onSuccess, onError }) => {
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const user = await signInWithGoogle();
            onSuccess(user);
        } catch (error) {
            onError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            fullWidth
            sx={{
                borderColor: '#4285f4',
                color: '#4285f4',
                '&:hover': {
                    borderColor: '#357abd',
                    backgroundColor: 'rgba(66, 133, 244, 0.04)'
                }
            }}
        >
            {loading ? 'Signing in...' : 'Continue with Google'}
        </Button>
    );
}; 