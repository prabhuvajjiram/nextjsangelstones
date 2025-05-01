'use client';

import Image from 'next/image';

interface Reason {
  icon: string;
  title: string;
  description: string;
}

const WhyChooseUsSection = () => {
  const reasons: Reason[] = [
    {
      icon: 'quality',
      title: 'Premium Quality',
      description: 'We use only the finest granite sourced from around the world, ensuring your memorial will stand the test of time.'
    },
    {
      icon: 'customization',
      title: 'Custom Designs',
      description: 'Our skilled artisans can create personalized designs that perfectly capture the essence and memory of your loved ones.'
    },
    {
      icon: 'experience',
      title: '25+ Years Experience',
      description: 'With over two decades in the industry, we bring unmatched expertise and craftsmanship to every project.'
    },
    {
      icon: 'support',
      title: 'Compassionate Service',
      description: 'We provide caring, respectful guidance through every step of the memorial selection and creation process.'
    },
    {
      icon: 'delivery',
      title: 'Nationwide Delivery',
      description: 'We offer reliable shipping and installation services to cemeteries and memorial sites across the country.'
    },
    {
      icon: 'warranty',
      title: 'Lifetime Warranty',
      description: 'We stand behind our work with a comprehensive warranty that covers craftsmanship and materials.'
    }
  ];

  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'quality':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'customization':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'experience':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'support':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'delivery':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'warranty':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <section id="why-choose-as" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
        <div className="w-full h-full bg-primary rotate-45 transform origin-top-right"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-playfair mt-2 mb-6">
            The Angel Granites Difference
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            When you choose Angel Granites, you're selecting a partner committed to honoring your loved ones with dignity and craftsmanship. Here's what sets us apart:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4">
                {renderIcon(reason.icon)}
              </div>
              <h3 className="text-xl font-bold mb-3">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-playfair mb-4">Our Commitment to Excellence</h3>
              <p className="text-gray-600 mb-6">
                At Angel Granites, we understand that creating a memorial is a deeply personal experience. Our team is dedicated to providing exceptional service and superior craftsmanship, ensuring that each monument we create is a fitting tribute to your loved one.
              </p>
              <p className="text-gray-600 mb-6">
                From the initial consultation to the final installation, we work closely with you to create a memorial that captures the essence of the person it honors. Our attention to detail and commitment to quality are evident in every piece we create.
              </p>
              <div className="flex items-center mt-4">
                <Image 
                  src="/images/signature.png" 
                  alt="Founder's Signature" 
                  width={150} 
                  height={60}
                  className="h-12 w-auto mr-4"
                />
                <div>
                  <p className="font-bold">David Anderson</p>
                  <p className="text-sm text-gray-500">Founder, Angel Granites</p>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image
                src="/images/workshop.jpg"
                alt="Angel Granites Workshop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
