import React from 'react';
import { Navbar } from '../features/navigation/components/Navbar';
import { AddProduct } from '../features/admin/components/AddProduct';
import { Box, Container, Typography, useTheme, styled } from '@mui/material';
import { motion } from 'framer-motion';

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 100%)`,
  minHeight: '100vh',
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(4),
  transition: 'all 0.3s ease-in-out',
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.dark,
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
}));

const ContentBox = styled(motion.div)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-4px)',
  },
  transition: 'all 0.3s ease-in-out',
}));

export const AddProductPage = () => {
    const theme = useTheme();

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
    };

    return (
        <>
            <Navbar />
            <PageWrapper>
                <ContentContainer maxWidth="md">
                    <PageTitle
                        variant="h4"
                        component="h1"
                    >
                        Add New Product
                    </PageTitle>

                    <ContentBox
                        initial="initial"
                        animate="animate"
                        variants={pageVariants}
                    >
                        <AddProduct />
                    </ContentBox>
                </ContentContainer>
            </PageWrapper>
        </>
    );
};