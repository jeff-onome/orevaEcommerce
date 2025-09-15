
import React from 'react';
import { Link } from 'react-router-dom';
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

const FacebookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
    </svg>
);

const TwitterIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.339.233-2.043.188-1.161 2.301 1.434 4.195 4.025 4.195-2.09 1.64-4.73 2.62-7.59 2.24 2.18 1.39 4.76 2.21 7.54 2.21 9.05 0 13.99-7.49 13.99-13.99 0-.21 0-.42-.01-.63.96-.69 1.8-1.56 2.46-2.55z" />
    </svg>
);

const WhatsAppIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.45L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-1.03-.011h-.521c-.246.002-.644.074-.967.346-.322.272-1.242 1.218-1.242 2.967 0 1.75.793 2.599 1.697 3.648 1.132 1.341 1.956 2.054 3.03 2.871.432.327.92.544 1.554.81.939.39 1.564.453 2.08.36.572-.102 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
);


const Footer: React.FC = () => {
  const { siteContent } = useAppContext();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
            {siteContent?.social_facebook && (
              <a href={`https://facebook.com/${siteContent.social_facebook}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Facebook">
                  <FacebookIcon />
              </a>
            )}
            {siteContent?.social_twitter && (
              <a href={`https://twitter.com/${siteContent.social_twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Twitter">
                  <TwitterIcon />
              </a>
            )}
            {siteContent?.social_instagram && (
              <a href={`https://instagram.com/${siteContent.social_instagram}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="Instagram">
                  <InstagramIcon />
              </a>
            )}
            {siteContent?.social_tiktok && (
              <a href={`https://tiktok.com/@${siteContent.social_tiktok}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="TikTok">
                  <TikTokIcon />
              </a>
            )}
            {siteContent?.social_whatsapp && (
              <a href={`https://wa.me/${siteContent.social_whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors" aria-label="WhatsApp">
                  <WhatsAppIcon />
              </a>
            )}
        </div>
        <p>&copy; {new Date().getFullYear()} {siteContent?.site_name || 'E-Shop Pro'}. All Rights Reserved.</p>
        <div className="flex flex-col sm:flex-row items-center sm:space-y-0 space-y-2 justify-center sm:space-x-4 mt-4">
          <Link to="/privacy-policy" className="hover:text-secondary transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-secondary transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-secondary transition-colors">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;