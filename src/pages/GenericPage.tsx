import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Spinner from '../components/Spinner';

interface GenericPageProps {
  slug: string;
}

const GenericPage: React.FC<GenericPageProps> = ({ slug }) => {
  const { pages, loading } = useAppContext();
  const page = pages.find(p => p.slug === slug);

  if (loading) {
    return <Spinner />;
  }

  if (!page) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Page not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">{page.title}</h1>
      {/* Using a div with pre-wrap to respect newlines from the database textarea */}
      <div 
        className="prose max-w-none text-gray-700 leading-relaxed" 
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {page.content}
      </div>
    </div>
  );
};

export default GenericPage;
