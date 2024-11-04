import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TypewriterText = ({ text, speed = 50, delay = 0 }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true);
      const interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            setIsTyping(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(startTyping, delay);
    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  useEffect(() => {
    setDisplayText(text.slice(0, currentIndex));
  }, [currentIndex, text]);

  return (
    <span>
      {displayText}
      {isTyping && (
        <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-neutral-950"></span>
      )}
    </span>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "/assets/hotelcrewlogo.svg",
    "/assets/slide3.svg",
    "/assets/slide2.svg",
    "/assets/slide1.svg",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-between h-screen overflow-hidden items-center">
      <div className="flex justify-center items-center flex-col w-[411px] h-[322px] mx-auto gap-[72px]">
        <div className="h-[210px] flex flex-col">
          <h1 className="text-[24px] font-bold leading-[31.2px] text-center">
            <TypewriterText text="Welcome to HotelCrew" speed={70} />
          </h1>
          <h2 className="text-[18px] font-semibold leading-[25.2px] text-center text-neutral-950 mb-[48px]">
            <TypewriterText 
              text="Streamline Your Hotel Operations Today!" 
              speed={50}
              delay={1500} 
            />
          </h2>
          <p className="text-[16px] font-semibold leading-[24px] text-center text-[#5B6C78] p-4">
            <TypewriterText
              text="HotelCrew is your all-in-one solution for efficient hotel management. Join us to manage staff, communicate seamlessly, and enhance guest experiences."
              speed={30}
              delay={3000}
            />
          </p>
        </div>
        <div className="flex flex-row justify-between w-[411px]">
          <button
            className="w-[195px] h-[40px] px-[24px] py-[10px] font-semibold rounded-[8px] text-white bg-[#5663AC] opacity-100 hover:bg-[#4a5b9b] transition duration-200"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
          <button
            className="w-[195px] h-[40px] px-[10px] py-[10px] font-semibold rounded-[8px] text-white bg-[#5663AC] opacity-100 hover:bg-[#4a5b9b] transition duration-200 ml-[10px]"
            onClick={() => navigate("/signUp")}
          >
            Register
          </button>
        </div>
      </div>
      <div className="relative w-[50vw] h-full mr-9">
        <div className="relative h-full w-full">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-[#5663AC]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all"
        >
          <ChevronRight className="w-6 h-6 text-[#5663AC]" />
        </button>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-[#5663AC] w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;