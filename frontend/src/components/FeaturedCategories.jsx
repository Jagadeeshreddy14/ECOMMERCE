import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const categories = [
    { name: 'Electronics', image: 'electronics.jpg' },
    { name: 'Fashion', image: 'fashion.jpg' },
    { name: 'Home & Living', image: 'home.jpg' },
    { name: 'Beauty', image: 'beauty.jpg' }
  ];

  return (
    <Grid container spacing={3}>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={3} key={category.name}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
            onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}
          >
            <CardMedia
              component="img"
              height="200"
              image={`/images/categories/${category.image}`}
              alt={category.name}
            />
            <CardContent>
              <Typography variant="h6" align="center">
                {category.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeaturedCategories;