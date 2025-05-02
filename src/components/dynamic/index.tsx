/**
 * Dynamic component imports to reduce initial JavaScript bundle size
 * This addresses the "Reduce unused JavaScript (389 KiB)" Lighthouse issue
 */

import dynamic from 'next/dynamic';
import { Suspense, ComponentType, ReactNode } from 'react';

// Loading fallbacks
const DefaultLoadingComponent = () => (
  <div className="w-full h-40 flex items-center justify-center bg-gray-50 animate-pulse">
    <div className="text-center">
      <div className="w-8 h-8 mx-auto border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
      <p className="mt-2 text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// Dynamic imports with configured loading states

// Contact form - Dynamically loaded when scrolled into view
export const DynamicContactForm = dynamic(
  () => import('../sections/ContactSection').then(mod => mod.default),
  {
    loading: () => <DefaultLoadingComponent />,
    ssr: false // Don't render on server to reduce initial JS
  }
);

// Product modal - Only loaded when a product is clicked
export const DynamicProductModal = dynamic(
  () => import('../modals/ProductModal').then(mod => mod.default),
  {
    loading: () => <DefaultLoadingComponent />,
    ssr: false
  }
);

// Featured products section - Below the fold, can be loaded later
export const DynamicFeaturedProducts = dynamic(
  () => import('../sections/FeaturedProductsSection').then(mod => mod.default),
  {
    loading: () => <DefaultLoadingComponent />,
    ssr: true // We want this for SEO but it can load lazily
  }
);

// Projects section - Below the fold, can be loaded later
export const DynamicProjectsSection = dynamic(
  () => import('../sections/ProjectsSection').then(mod => mod.default),
  {
    loading: () => <DefaultLoadingComponent />,
    ssr: true
  }
);

// Dynamic with custom suspense wrapper
export function createDynamicComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  LoadingComponent: React.FC = DefaultLoadingComponent,
  ssrEnabled = true
) {
  const DynamicComponent = dynamic(importFunc, {
    loading: () => <LoadingComponent />,
    ssr: ssrEnabled
  });

  // Return a component that handles its own suspense boundary
  return (props: React.ComponentProps<T> & { fallback?: ReactNode }) => {
    const { fallback = <LoadingComponent />, ...componentProps } = props;
    
    return (
      <Suspense fallback={fallback}>
        <DynamicComponent {...componentProps as React.ComponentProps<T>} />
      </Suspense>
    );
  };
}
