import React, { useEffect, useState, useRef } from 'react';

interface CustomCarouselProps{
  images: string[]
}

export default function CustomCarousel({images} : CustomCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = window.setInterval(nextSlide, 3000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-10 overflow-hidden rounded shadow-lg">
      {/* Slide image */}
      <div className="w-full h-64">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>

      {/* Left/Right Buttons */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-gray-700 bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full"
        onClick={prevSlide}
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-gray-700 bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full"
        onClick={nextSlide}
      >
        ❯
      </button>

      {/* Indicators + Pause Button */}
      <div className="absolute bottom-4 w-full flex justify-center items-center gap-4">
        {/* Dots */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Pause/Resume */}
        <button
          className="text-white bg-gray-700 bg-opacity-70 hover:bg-opacity-100 px-2 py-1 text-sm rounded"
          onClick={togglePause}
        >
          {isPaused ? <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd"/>
</svg>
 : <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z" clip-rule="evenodd"/>
</svg>
}
        </button>
      </div>
    </div>
  );
};