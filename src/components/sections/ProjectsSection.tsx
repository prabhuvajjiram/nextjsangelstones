'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { handleImageError as handleImageErrorUtil } from '@/utils/imageUtils';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const ProjectsSection = () => {
  // Sample projects data
  const projects: Project[] = [
    {
      id: 1,
      title: 'Granite Monuments',
      category: 'monuments',
      image: '/images/granite-monuments-project01.png',
      description: 'Custom designed granite monument with intricate engraving and polished finish.'
    },
    {
      id: 2,
      title: 'Granite Monuments',
      category: 'monuments',
      image: '/images/granite-monuments-project02.png',
      description: 'Elegant black granite monument with gold leaf detailing and custom shape.'
    },
    {
      id: 3,
      title: 'Granite Monuments',
      category: 'monuments',
      image: '/images/granite-monuments-project03.png',
      description: 'Traditional upright monument with personalized engraving and decorative elements.'
    },
    {
      id: 4,
      title: 'Granite Slabs',
      category: 'slabs',
      image: '/images/granite-slabs-project01.png',
      description: 'Premium quality granite slab with unique veining pattern for countertops.'
    },
    {
      id: 5,
      title: 'Granite Slabs',
      category: 'slabs',
      image: '/images/granite-slabs-project02.png',
      description: 'Polished granite slab showcasing natural stone beauty and durability.'
    },
    {
      id: 6,
      title: 'Granite Slabs',
      category: 'slabs',
      image: '/images/granite-slabs-project03.png',
      description: 'Custom cut granite slab with exceptional clarity and consistent coloration.'
    },
    {
      id: 7,
      title: 'Custom Designs',
      category: 'designs',
      image: '/images/customized-designs-project01.png',
      description: 'Bespoke granite design featuring custom artwork and specialized finishing.'
    },
    {
      id: 8,
      title: 'Custom Designs',
      category: 'designs',
      image: '/images/customized-designs-project02.png',
      description: 'Innovative granite design incorporating multiple textures and finishes.'
    },
    {
      id: 9,
      title: 'Custom Designs',
      category: 'designs',
      image: '/images/customized-designs-project03.png',
      description: 'Artistic granite creation with personalized elements and premium materials.'
    },
  ];

  // State for filtering and modal
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Effect to set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(projects.map(project => project.category)))];

  // Filter projects based on active category
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  // Handle opening the modal
  const openModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Projects</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our portfolio of completed projects showcasing our craftsmanship and attention to detail.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 mx-2 mb-2 rounded-md transition-colors ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => openModal(project)}
            >
              <div className="relative h-64">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => handleImageErrorUtil(e, project.image)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white text-primary p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {isClient && isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="relative">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative h-[50vh]">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  onError={(e) => handleImageErrorUtil(e, selectedProject.image)}
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedProject.title}</h2>
                <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                
                <div className="mt-4">
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedProject.category.charAt(0).toUpperCase() + selectedProject.category.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
