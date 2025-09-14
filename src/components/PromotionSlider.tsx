
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Promotion } from '../types';

interface PromotionSliderProps {
  promotions: Promotion[];
}

const PromotionSlider: React.FC<PromotionSliderProps> = ({ promotions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? promotions.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, promotions.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === promotions.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, promotions.length]);

  useEffect(() => {
    if (promotions.length > 1) {
      const timer = setTimeout(goToNext, 7000); // Slower for promos
      return () => clearTimeout(timer);
    }
  }, [currentIndex, goToNext, promotions.length]);

  if (!promotions || promotions.length === 0) {
    return null;
  }

  const currentPromotion = promotions[currentIndex];
  const linkTo = currentPromotion.target_category
    ? `${currentPromotion.cta_link}?category=${encodeURIComponent(currentPromotion.target_category)}`
    : currentPromotion.cta_link || '/shop';

  return (
    <div className="h-56 sm:h-64 w-full m-auto relative group rounded-lg overflow-hidden shadow-lg animate-fade-in">
      <div
        style={{ backgroundImage: `url(${currentPromotion.image_url})` }}
        className="w-full h-full bg-center bg-cover duration-500"
      >
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-center text-white p-4">
            <div className="animate-slide-in-up">
                <h2 className="text-3xl md:text-4xl font-extrabold text-shadow-lg">{currentPromotion.title}</h2>
                <p className="text-base md:text-lg mt-4 max-w-2xl mx-auto">{currentPromotion.description}</p>
                <Link to={linkTo}>
                    <button className="mt-6 bg-secondary text-primary font-bold py-2 px-6 rounded-full hover:bg-amber-500 transition-all duration-300 transform hover:scale-105">
                        {currentPromotion.cta_text}
                    </button>
                </Link>
            </div>
        </div>
      </div>
      {/* Arrows */}
      {promotions.length > 1 && (
        <>
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={goToPrevious}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </div>
            <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={goToNext}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
            <div className="flex top-4 justify-center py-2 absolute bottom-5 left-1/2 -translate-x-1/2">
                {promotions.map((_, slideIndex) => (
                <div
                    key={slideIndex}
                    onClick={() => setCurrentIndex(slideIndex)}
                    className={`text-2xl cursor-pointer p-1 transition-colors ${currentIndex === slideIndex ? 'text-secondary' : 'text-white'}`}
                    style={{lineHeight: '0.5'}}
                >
                    ●
                </div>
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default PromotionSlider;