import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../App.css";
import "../fire.scss";
import { AnimatePresence } from "framer-motion";
import Footer from "../Components/Footer";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { UserProvider } from "../context/userContext";
import { browserName, isIOS, isMobile } from "react-device-detect";


const tele = window.Telegram.WebApp;
const Home = () => {
const [loading, setLoading] = useState(true)
const location = useLocation();
const [restrictAccess, setRestrictAccess] = useState(false)


useEffect(() => {
  const handleContextMenu = (event) => event.preventDefault();
  const handleKeyDown = (event) => {
    if ((event.ctrlKey && (event.key === 'u' || event.key === 's')) || (event.ctrlKey && event.shiftKey && event.key === 'i')) {
      event.preventDefault();
    }
  };

  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keydown', handleKeyDown);
  };
}, []);

    useEffect(() => {
        tele.ready();
        tele.expand();
        setTimeout(() => {
          setLoading(false);
        }, 3000);
        
        // window.Telegram.WebApp.setHeaderColor('#29162c'); // Set header color to red
        window.Telegram.WebApp.setHeaderColor('#1b1b1b'); // Set header color to red

              // Haptic feedback
      if (tele.HapticFeedback) {
        tele.HapticFeedback.impactOccurred("medium");
      }
      if (navigator.vibrate) {
        navigator.vibrate(100); // Vibrate for 100ms
    }


    }, []);


    const overflow = 100;
    const scrollableEl = useRef(null);
  
    useEffect(() => {

      const isDashboardRoute = location.pathname.startsWith('/dashboardAdx') || location.pathname.startsWith('/dashboard');
      const restrictedBrowsers = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Thor', 'Brave'];


      if (
        (!isMobile && !isDashboardRoute) || (!isDashboardRoute && restrictedBrowsers.includes(browserName))) {
        setRestrictAccess(true);
      } 


      if (isDashboardRoute) {
        document.getElementById('footermain').style.display = 'none';
      }

      if (!isDashboardRoute) {
      document.body.style.overflowY = 'hidden';
      document.body.style.marginTop = `${overflow}px`;
      document.body.style.height = `${window.innerHeight + overflow}px`;
      document.body.style.paddingBottom = `${overflow}px`;
      window.scrollTo(0, overflow);
  
      let ts;
  
      const onTouchStart = (e) => {
        ts = e.touches[0].clientY;
      };
  
      const onTouchMove = (e) => {
        const el = scrollableEl.current;
        if (el) {
          const scroll = el.scrollTop;
          const te = e.changedTouches[0].clientY;
          if (scroll <= 0 && ts < te) {
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      };
      const onTouchMoveWithException = (e) => {
        const target = e.target.closest('#refer');
        if (!target) {
          onTouchMove(e);
        }
      };
    
      document.documentElement.addEventListener('touchstart', onTouchStart, { passive: false });
      document.documentElement.addEventListener('touchmove', onTouchMoveWithException, { passive: false });
    
      // Cleanup event listeners on component unmount
      return () => {
        document.documentElement.removeEventListener('touchstart', onTouchStart);
        document.documentElement.removeEventListener('touchmove', onTouchMoveWithException);
      };
    }
  }, [location.pathname, overflow]); 
   

  return (
<>

<div className="w-full flex justify-center">
{/* <div className="bg-[#efc26999] blur-[50px] select-none pointer-events-none absolute rotate-[35deg] w-[400px] h-[160px] -left-40 rounded-full"></div> */}
            
        <div className="w-full flex justify-center">
          <div className="flex flex-col pt-3 space-y-3 w-full">


            

          <TonConnectUIProvider manifestUrl="https://maxitaps939v.netlify.app/tonconnect-manifest.json">
        
          <UserProvider>
            <AnimatePresence mode="wait">



            {restrictAccess ? (
  <>
        <div className='w-full flex h-full justify-center px-5 items-center font-medium text-[20px]'>
        <div className='w-full pt-24 text-center flex flex-col space-y-3 justify-center items-center'>
          <p className='text-[28px] font-semibold'>
            Mobile rocks for gaming 😎 Open on your mobile device to play now!
          </p>
          <img 
            src='/maxitapqr.webp'
            alt="plutotaps"
            className='w-[250px] rounded-[25px] border-[2px] border-[#d9d9d9]'
          />
        </div>
      </div>
  </>
) : (
  <>

            <Outlet />
  <div id="footermain" className={`${loading ? 'invisible' : 'visible'} bg-[#171717] z-30 flex flex-col rounded-tr-[20px] rounded-tl-[20px] fixed bottom-0 ${isIOS ? 'pb-6' : 'pb-3'} left-0 right-0 justify-center items-center px-3`}>


  <Footer/>
  <div className="bg-[#171717] z-20 h-[67px] w-full fixed bottom-0 left-0 right-0 ">
  </div>
  </div>
  </>
)}
  


            </AnimatePresence>
            </UserProvider>
            </TonConnectUIProvider>
    
          
          


        </div>
           </div>
           </div>
           </>
  );
};

export default Home;
