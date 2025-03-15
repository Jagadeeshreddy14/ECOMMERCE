import React from 'react';
import { MenuItem, Select, FormControl } from '@mui/material';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'ta', label: 'தமிழ்' }
  ];

  return (
    <FormControl size="small">
      <Select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        sx={{
          bgcolor: 'background.paper',
          '& .MuiSelect-select': { py: 1 }
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};