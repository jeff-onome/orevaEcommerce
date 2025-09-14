import React from 'react';
import { useAppContext } from '../context/AppContext';

const AboutPage: React.FC = () => {
  const { siteContent } = useAppContext();

  if (!siteContent) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{siteContent.about_title}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {siteContent.about_subtitle}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-4">{siteContent.about_story_title}</h2>
          <p className="text-gray-700 leading-relaxed">
            {siteContent.about_story_content}
          </p>
        </div>
        {siteContent.about_story_image_url ? (
            <img src={siteContent.about_story_image_url} alt="Our Store" className="rounded-lg shadow-md" loading="lazy" decoding="async" />
        ) : (
            <div className="w-full aspect-video bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">{siteContent.about_team_title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteContent.team_members.map(member => (
            <div key={member.id} className="p-6 bg-background rounded-lg">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name || 'Team Member'} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-sm object-cover" loading="lazy" decoding="async" />
              ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-4 shadow-sm bg-gray-200 flex items-center justify-center text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              )}
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
