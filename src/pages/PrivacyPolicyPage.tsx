import React from 'react';
import { useAppContext } from '../context/AppContext';
import Spinner from '../components/Spinner';

const PrivacyPolicyPage: React.FC = () => {
  const { siteContent } = useAppContext();

  if (!siteContent) {
    return <Spinner />;
  }

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">Privacy Policy</h1>
      <div className="prose max-w-none text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
        {siteContent.privacy_policy_content || 'Privacy Policy content has not been set.'}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
