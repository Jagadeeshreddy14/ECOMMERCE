import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  return (
    <IconButton 
      onClick={toggleTheme}
      sx={{
        color: theme.palette.text.primary,
        '&:hover': { transform: 'scale(1.1)' }
      }}
    >
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};