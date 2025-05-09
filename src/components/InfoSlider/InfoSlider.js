import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; // ✅ Ajout de PropTypes
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@mui/material";

const InfoSlider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  useEffect(() => {
    if (!isPaused) {
      const intervalId = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [nextSlide, isPaused]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[500px] w-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute h-full w-full transition-all duration-500 ease-in-out ${
              currentSlide === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
            }`}
          >
            <div className="flex h-full flex-col md:flex-row">
              <div className="flex-1 p-8 bg-gray-900 text-gray-100">
                <h2 className="mb-4 text-3xl font-bold text-indigo-400">{slide.title}</h2>
                <p className="text-lg text-gray-100">{slide.content}</p>
              </div>
              <div className="relative flex-1">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover brightness-75"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              currentSlide === index ? "bg-indigo-500 w-6" : "bg-gray-600"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>

      <Button
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/80 p-2 text-indigo-400 hover:bg-gray-800 hover:text-indigo-300"
        onClick={prevSlide}
        aria-label="Diapositive précédente"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-800/80 p-2 text-indigo-400 hover:bg-gray-800 hover:text-indigo-300"
        onClick={nextSlide}
        aria-label="Diapositive suivante"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

// ✅ Validation des props
InfoSlider.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default InfoSlider;
