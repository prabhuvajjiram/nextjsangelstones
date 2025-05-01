'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductsSection from '@/components/sections/ProductsSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import ContactSection from '@/components/sections/ContactSection';
import VarietySection from '@/components/sections/VarietySection';
import dynamic from 'next/dynamic';

// Dynamically import the ProductModal component to avoid issues
const ProductModal = dynamic(() => import('@/components/modals/ProductModal'), {
  ssr: false, // Disable server-side rendering for this component
});

// Match the exact FeaturedProduct interface from FeaturedProductsSection
interface FeaturedProduct {
  id: string;
  name: string;
  thumbnail: string;
  fullImage: string;
  category: string;
}

// Convert FeaturedProduct to ProductImage for the modal
const convertToProductImage = (product: FeaturedProduct) => {
  return {
    name: product.name,
    path: product.fullImage || product.thumbnail // Use fullImage if available, otherwise thumbnail
  };
};

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductModal = (product: FeaturedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <Layout>
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <FeaturedProductsSection onProductClick={openProductModal} />
        <ProjectsSection />
        <WhyChooseUsSection />
        <VarietySection />
        <ContactSection />

        {isModalOpen && selectedProduct && (
          <ProductModal 
            product={convertToProductImage(selectedProduct)} 
            onClose={closeProductModal} 
          />
        )}
      </main>
    </Layout>
  );
}
