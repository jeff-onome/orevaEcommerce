
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
        <img src={siteContent.about_story_image_url || ''} alt="Our Store" className="rounded-lg shadow-md" loading="lazy" decoding="async" />
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-6">{siteContent.about_team_title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteContent.team_members.map(member => (
            <div key={member.id} className="p-6 bg-background rounded-lg">
              <img src={member.image_url || ''} alt={member.name || 'Team Member'} className="w-32 h-32 rounded-full mx-auto mb-4 shadow-sm" loading="lazy" decoding="async" />
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