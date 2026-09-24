import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function ImageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const slideIntervalRef = useRef(null);
  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1523050854328-c237dd6991d4?w=1200&h=500&fit=crop&q=80",
      title: "Modern University Classroom",
      description: "Interactive learning environment",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=500&fit=crop&q=80",
      title: "Students Studying Together",
      description: "Collaborative academic excellence",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1427504494785-cacdb58edf60?w=1200&h=500&fit=crop&q=80",
      title: "Faculty Teaching",
      description: "Expert knowledge transfer",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=500&fit=crop&q=80",
      title: "Computer Lab Technology",
      description: "Digital learning infrastructure",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=500&fit=crop&q=80",
      title: "Campus Resources",
      description: "World-class educational facilities",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4500);
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(true);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;

    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div
      className="image-slider-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="image-slider">
        <div className="slider-wrapper">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              <img src={slide.image} alt={slide.title} loading="lazy" />
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          className="slider-btn slider-btn-prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          className="slider-btn slider-btn-next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicator Dots */}
        <div className="slider-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageSlider;
