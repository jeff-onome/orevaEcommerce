
import React from 'react';
import { useAppContext } from '../context/AppContext';

const InstagramIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
    </svg>
);

const TikTokIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-.95-6.43-2.88-1.59-1.92-2.31-4.42-2.09-6.91.21-2.52 1.39-4.83 3.33-6.41 1.92-1.59 4.44-2.31 6.92-2.11.02 1.54-.01 3.08.01 4.63-.44-.13-.89-.25-1.33-.36-1.03-.27-2.1-.4-3.16-.36-1.59.05-3.07.75-4.04 1.88-1.14 1.29-1.64 3.03-1.42 4.67.21 1.59 1.17 3.08 2.5 3.95 1.71 1.14 3.92 1.34 5.8.47 1.02-.48 1.86-1.3 2.39-2.34.46-.92.68-1.99.68-3.06-.01-2.93.01-5.86-.02-8.79-.27-.03-.54-.07-.8-.11-1.14-.17-2.29-.27-3.4-.39-1.48-.17-2.98-.24-4.46-.37v-4.03c.18.01.35.04.53.05 1.25.08 2.5.16 3.75.25 1.18.08 2.35.18 3.53.25.01 0 .02.01.03.01z" />
    </svg>
);


const Footer: React.FC = () => {
  const { siteContent } = useAppContext();
  const instagramHandle = siteContent?.social_instagram || '';
  const tiktokHandle = siteContent?.social_tiktok || '';

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
            {instagramHandle && (
              <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
                  <InstagramIcon />
              </a>
            )}
            {tiktokHandle && (
              <a href={`https://tiktok.com/${tiktokHandle}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="TikTok">
                  <TikTokIcon />
              </a>
            )}
        </div>
        <p>&copy; {new Date().getFullYear()} {siteContent?.site_name || 'E-Shop Pro'}. All Rights Reserved.</p>
        <div className="flex flex-col sm:flex-row items-center sm:space-y-0 space-y-2 justify-center sm:space-x-4 mt-4">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-secondary transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;