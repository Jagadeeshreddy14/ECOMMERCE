import React from 'react';
import { Navbar } from '../features/navigation/components/Navbar';
import  ProductDetails from '../features/products/components/ProductDetails'; // Named export
// OR
// import ProductDetails from '../features/products/components/ProductDetails'; // Default export
import { Footer } from '../features/footer/Footer';

export const ProductDetailsPage = () => {
  return (
    <>
      <Navbar />
      <ProductDetails />
      <Footer />
    </>
  );
};