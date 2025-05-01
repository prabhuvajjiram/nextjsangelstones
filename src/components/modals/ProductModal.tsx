import Image from 'next/image';
import Link from 'next/link';
import { handleImageError } from '@/utils/imageUtils';

interface ProductImage {
  name: string;
  path: string;
}

interface ProductModalProps {
  product: ProductImage;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          <div className="relative h-[50vh] w-full mb-4">
            <Image
              src={product.path}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              onError={(e) => handleImageError(e.currentTarget as HTMLImageElement, product.path)}
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {product.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}
          </h2>
          
          <div className="mt-6 flex justify-between">
            <button 
              className="bg-secondary text-white px-6 py-2 rounded hover:bg-secondary/90"
              onClick={onClose}
            >
              Close
            </button>
            <Link 
              href="/contact" 
              className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
            >
              Inquire About This Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
