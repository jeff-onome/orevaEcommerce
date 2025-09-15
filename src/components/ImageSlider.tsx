import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ImageSliderProps {
  slides: Product[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // This effect resets the index if the slides array changes and the current index is out of bounds.
  useEffect(() => {
    if (slides && slides.length > 0 && currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides, currentIndex]);


  const goToPrevious = useCallback(() => {
    if (!slides || slides.length === 0) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);

  const goToNext = useCallback(() => {
    if (!slides || slides.length === 0) return;
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);
  
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    // Only run the timer if there's more than one slide to prevent an infinite loop
    if (slides.length > 1) {
      const timer = setTimeout(goToNext, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, goToNext, slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }
  
  // This guard prevents a crash if the slides prop updates to a smaller array
  // before the useEffect above has a chance to reset the state.
  if (currentIndex >= slides.length) {
    return null;
  }

  const currentSlide = slides[currentIndex];
  const isSale = currentSlide.sale_price && currentSlide.sale_price < currentSlide.price;

  return (
    <div className="h-64 sm:h-80 lg:h-96 w-full m-auto relative group rounded-lg overflow-hidden shadow-lg">
      <div
        style={{ backgroundImage: `url(${currentSlide.image_url})` }}
        className="w-full h-full bg-center bg-cover duration-500"
      >
        <div className="w-full h-full bg-black bg-opacity-40 flex items-center justify-center text-center text-white p-4">
            <div className="animate-fade-in">
                <h2 className="text-4xl md:text-6xl font-extrabold">{currentSlide.name}</h2>
                {isSale ? (
                    <div className="flex items-baseline justify-center space-x-4 mt-4">
                        <p className="text-lg md:text-2xl text-yellow-300 font-bold">SALE: ₦{currentSlide.sale_price!.toLocaleString()}</p>
                        <p className="text-md md:text-xl line-through opacity-75">₦{currentSlide.price.toLocaleString()}</p>
                    </div>
                ) : (
                    <p className="text-lg md:text-2xl mt-4">₦{currentSlide.price.toLocaleString()}</p>
                )}
                <Link to={`/product/${currentSlide.id}`}>
                    <button className="mt-8 bg-secondary text-primary font-bold py-3 px-8 rounded-full hover:bg-amber-500 transition-all duration-300">
                        Shop Now
                    </button>
                </Link>
            </div>
        </div>
      </div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={goToPrevious}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer" onClick={goToNext}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>
      <div className="flex top-4 justify-center py-2 absolute bottom-5 left-1/2 -translate-x-1/2">
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.id}
            onClick={() => goToSlide(slideIndex)}
            className={`text-2xl cursor-pointer p-1 transition-colors ${currentIndex === slideIndex ? 'text-secondary' : 'text-white'}`}
            style={{lineHeight: '0.5'}}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;