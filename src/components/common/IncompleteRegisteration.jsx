// import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import Skeleton from '@mui/material/Skeleton';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './carousel.css';
// import slide1 from '/public/slide1.svg';
// import slide2 from '/public/slide2.svg';
// import slide3 from '/public/slide3.svg';

function IncompleteRegisteration() {
  // const navigate = useNavigate();

  const handleClick = () => {
    // navigate('/signup/hoteldetails', { replace: true });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    appendDots: dots => (
      <ul className="custom-dots"> 
        {dots.map((dot, index) => (
          <li key={index}>
            {dot}
            <div className="timeline" />
          </li>
        ))}
      </ul>
    ),
    customPaging: i => (
      <button aria-label={`Go to slide ${i + 1}`}></button>
    )
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">

        <div className="flex-1 p-8">
                    <div className="grid grid-cols-12 gap-6 mb-8">
            {[
              { cols: 'col-span-4', height: 150 },
              { cols: 'col-span-8', height: 180 },
              { cols: 'col-span-12', height: 200 },
            ].map((item, index) => (
              <div key={index} className={`${item.cols} bg-white p-6 rounded-lg shadow`}>
                <Skeleton variant="rectangular" width="100%" height={item.height} />
                <div className="mt-4">
                  <Skeleton variant="text" width={`${Math.floor(Math.random() * 40 + 60)}%`} />
                  <Skeleton variant="text" width={`${Math.floor(Math.random() * 30 + 50)}%`} />
                </div>
              </div>
            ))}
          </div>
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-md overflow-hidden ">
              {/* <Slider {...settings}>
                <div>
                  <img src={slide1} alt="Slide 1" className="w-full h-full object-cover outline-none" />
                </div>
                <div>
                  <img src={slide2} alt="Slide 2" className="w-full h-full object-cover outline-none" />
                </div>
                <div>
                  <img src={slide3} alt="Slide 3" className="w-full h-full object-cover outline-none" />
                </div>
              </Slider> */}
              <div className="text-center p-8">
                <p className="text-xl font-semibold text-gray-700 mb-4">
                  Please complete your hotel registration
                </p>
                <button 
                  onClick={handleClick}
                  className="px-6 py-2 bg-[#5D69F8] text-white rounded-lg transition-colors"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncompleteRegisteration;