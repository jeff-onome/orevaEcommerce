
import React from 'react';
import { useAppContext } from '../context/AppContext';

const ShippingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1zM3 11h10" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h4m-2 2v-4" />
    </svg>
);
const QualityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const SupportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const PaymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const iconMap: { [key: string]: React.ReactNode } = {
    'shipping': <ShippingIcon />,
    'quality': <QualityIcon />,
    'support': <SupportIcon />,
    'payment': <PaymentIcon />,
};

const ServicesPage: React.FC = () => {
    const { siteContent, services } = useAppContext();
    const activeServices = services.filter(s => s.is_active);

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{siteContent?.services_title || 'Our Services'}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {siteContent?.services_subtitle || "We are dedicated to providing you with the best experience possible. Here are some of the services we offer to ensure your complete satisfaction."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {activeServices.map((service, index) => (
          <div key={index} className="bg-background p-6 rounded-lg flex items-start space-x-6 hover:shadow-md transition-shadow">
            <div className="flex-shrink-0">{iconMap[service.icon_name || ''] || <SupportIcon />}</div>
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
