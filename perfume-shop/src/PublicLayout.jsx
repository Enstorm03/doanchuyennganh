import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

const PublicLayout = () => {
  return (
    <>
      <Header brandName="Aura" />
      <Outlet /> {/* Các trang public sẽ được render ở đây */}
      <Footer brandName="Aura" />
    </>
  );
};

export default PublicLayout;