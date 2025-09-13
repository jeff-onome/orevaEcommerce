import React from 'react';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';

const ContactPage: React.FC = () => {
  const { siteContent } = useAppContext();

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Reach out to us through any of the methods below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Get in Touch</h2>
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-gray-600">{siteContent?.contact_address}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
             <div className="mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
             </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600">{siteContent?.contact_email}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-gray-600">{siteContent?.contact_phone}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">Send Us a Message</h2>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary" required />
            <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary" required />
            <input type="text" placeholder="Subject" className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary" />
            <textarea placeholder="Your Message" rows={5} className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary" required></textarea>
            <Button type="submit" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;