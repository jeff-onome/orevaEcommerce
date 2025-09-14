
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface SalesBannerProps {
  title: string;
  subtitle: string;
  endDate: string;
}

interface TimeLeft {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
}

const SalesBanner: React.FC<SalesBannerProps> = ({ title, subtitle, endDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
      if (value === undefined) return null;
      return (
        <div key={interval} className="text-center">
            <div className="text-2xl md:text-4xl font-bold">{String(value).padStart(2, '0')}</div>
            <div className="text-xs uppercase">{interval}</div>
        </div>
      )
  });

  return (
    <div className="bg-primary text-onPrimary p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
        <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
            <p className="text-md md:text-lg opacity-90 mt-1">{subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
            {timerComponents.length ? timerComponents : <span className="text-xl font-bold">Sale has ended!</span>}
        </div>

        <Link to="/shop">
            <button className="bg-secondary text-primary font-bold py-3 px-8 rounded-full hover:bg-amber-500 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                Shop the Sale
            </button>
        </Link>
    </div>
  );
};

export default SalesBanner;