import { useEffect, useState, useRef } from "react";

interface CustomCarouselProps {
  images: string[];
}

export default function CustomCarousel({ images }: CustomCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = window.setInterval(nextSlide, 8000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, images.length]);

  const containerClasses =
    "relative w-full mx-auto mt-10 overflow-hidden rounded shadow-lg transition-all duration-300 " +
    (isExpanded ? "max-w-5xl h-[70vh]" : "max-w-3xl h-64");

  const imageClasses =
    "w-full h-full transition-all duration-300 " +
    (isExpanded ? "object-contain bg-black" : "object-cover");

  return (
    <div className={containerClasses}>
      {/* Slide image */}
      <div className="w-full h-full flex items-center justify-center bg-black">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className={imageClasses}
        />
      </div>

      {/* Left/Right Buttons */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 transform text-white bg-gray-700 bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full"
        onClick={prevSlide}
        aria-label="Previous image"
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 transform text-white bg-gray-700 bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full"
        onClick={nextSlide}
        aria-label="Next image"
      >
        ❯
      </button>

      {/* Expand / Collapse button – TOP RIGHT */}
      <button
        type="button"
        onClick={toggleExpanded}
        className="absolute top-4 right-4 flex items-center justify-center rounded-full bg-gray-700 bg-opacity-70 p-2 text-white hover:bg-opacity-100"
        aria-label={isExpanded ? "Minimize carousel" : "Expand carousel"}
      >
        {isExpanded ? (
          // Minimize icon
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 9h4m0 0V5m0 4L4 4m15 5h-4m0 0V5m0 4 5-5M5 15h4m0 0v4m0-4-5 5m15-5h-4m0 0v4m0-4 5 5"
            />
          </svg>
        ) : (
          // Expand icon
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"
            />
          </svg>
        )}
      </button>

      {/* Bottom controls – CENTERED (dots + play/pause) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
        {/* Dots */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Pause/Resume */}
        <button
          className="flex items-center justify-center text-white bg-gray-700 bg-opacity-70 hover:bg-opacity-100 px-2 py-1 text-sm rounded"
          onClick={togglePause}
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? (
            // Play icon
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            // Pause icon
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M8 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H8Zm7 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
