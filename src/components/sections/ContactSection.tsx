'use client';

import { useState, useRef, useEffect } from 'react';

export default function ContactSection() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      // Simulating API call with timeout
      // In a real implementation, this would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form on success
      if (formRef.current) {
        formRef.current.reset();
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
      
      setFormStatus('success');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }
  };

  // Add animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Store ref value to prevent issues in cleanup function
    const sectionElement = sectionRef.current;
    
    if (sectionElement) {
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="section bg-primary-50 reveal">
      <div className="container">
        <div className="text-center mb-16">
          <h3 className="font-serif text-sm tracking-widest uppercase text-accent-700 mb-2">
            Get In Touch
          </h3>
          <div className="luxury-divider mx-auto w-24 mb-6"></div>
          <h2 className="section-title">
            Contact Angel Granites
          </h2>
          <p className="section-subtitle mx-auto">
            We&apos;re here to assist you in creating a lasting memorial. Reach out to us with any questions or to schedule a consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white p-8 shadow-luxury">
            <h3 className="text-2xl font-serif mb-6">Send us a message</h3>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-1">
                    Your Name <span className="text-accent-700">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-primary-200 focus:border-accent-400 focus:ring focus:ring-accent-100 outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                    Email Address <span className="text-accent-700">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-primary-200 focus:border-accent-400 focus:ring focus:ring-accent-100 outline-none transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-primary-200 focus:border-accent-400 focus:ring focus:ring-accent-100 outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-primary-700 mb-1">
                    Subject <span className="text-accent-700">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-primary-200 focus:border-accent-400 focus:ring focus:ring-accent-100 outline-none transition-all duration-200 bg-white"
                  >
                    <option value="">Please select</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Monument">Custom Monument</option>
                    <option value="Pricing Information">Pricing Information</option>
                    <option value="Schedule Consultation">Schedule Consultation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary-700 mb-1">
                  Your Message <span className="text-accent-700">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-primary-200 focus:border-accent-400 focus:ring focus:ring-accent-100 outline-none transition-all duration-200"
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`btn btn-primary w-full flex items-center justify-center ${
                    formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Message'}
                </button>
                
                {formStatus === 'success' && (
                  <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3">
                    Thank you for your message. We&apos;ll get back to you shortly.
                  </div>
                )}
                
                {formStatus === 'error' && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3">
                    There&#39;s no better way to honor your loved one&#39;s memory than with a beautifully crafted monument.
                  </div>
                )}
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-col justify-between">
            <div className="mb-8">
              <h3 className="text-2xl font-serif mb-6">Contact Information</h3>
              <p className="text-primary-700 mb-8">
                We&apos;d love to hear from you. Visit our showroom, call us directly, or fill out the contact form.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-primary-900 font-medium mb-1">Our Location</h4>
                    <p className="text-primary-700">
                      123 Granite Way,<br/>
                      Stoneville, MA 02345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-primary-900 font-medium mb-1">Phone Number</h4>
                    <p className="text-primary-700">
                      <a href="tel:+1-123-456-7890" className="hover:text-accent-700 transition-colors">
                        (123) 456-7890
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-primary-900 font-medium mb-1">Email Address</h4>
                    <p className="text-primary-700">
                      <a href="mailto:info@angelgranites.com" className="hover:text-accent-700 transition-colors">
                        info@angelgranites.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-accent-50 flex items-center justify-center flex-shrink-0 mr-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-accent-700" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-primary-900 font-medium mb-1">Working Hours</h4>
                    <p className="text-primary-700">
                      Monday - Friday: 9:00 AM - 5:00 PM<br/>
                      Saturday: 10:00 AM - 2:00 PM<br/>
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Integration Placeholder */}
            <div className="bg-primary-100 aspect-video flex items-center justify-center shadow-luxury">
              <div className="text-center p-6">
                <div className="text-accent-700 mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-10 w-10 mx-auto" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                    />
                  </svg>
                </div>
                <p className="text-primary-700">
                  Interactive map would be displayed here.<br/>
                  Integration with Google Maps or similar service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
