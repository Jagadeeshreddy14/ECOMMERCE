import React from 'react';
import { Typography, Stack } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Stack height="50vh" justifyContent="center" alignItems="center">
          <Typography color="error">Something went wrong</Typography>
        </Stack>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;