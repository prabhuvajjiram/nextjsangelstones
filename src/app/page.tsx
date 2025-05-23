'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/sections/HeroSection'; 
import AboutSection from '@/components/sections/AboutSection';
import ProductsSection from '@/components/sections/ProductsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import WhyChooseUsSection from '@/components/sections/WhyChooseUsSection';
import ContactSection from '@/components/sections/ContactSection';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedProduct, setSelectedProduct] = useState<FeaturedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Product click handler removed - not currently used

  const closeProductModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <Layout>
      <main>
        {/* Critical, above-fold content loaded immediately */}
        <HeroSection />
        <section id="about">
          <AboutSection />
        </section>
        <section id="products">
          <ProductsSection />
        </section>
        <section id="projects">
          <ProjectsSection />
        </section>
        <section id="why-choose-us">
          <WhyChooseUsSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>

        {/* Modal only loads when needed */}
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
