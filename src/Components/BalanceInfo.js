import React, { useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5';

const BalanceInfo = ({info, setInfo}) => {

    const infoRef = useRef(null);


  const handleClickOutside = (event) => {
    if (infoRef.current && !infoRef.current.contains(event.target)) {
      setInfo(false);
    }
  };


  useEffect(() => {
    if (info) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [info]);

  const closeInfo = () => {
    setInfo(false);
  }

  return (
        <div className={`${info ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>


        <div ref={infoRef} className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>
      

          <div className="w-full flex bg-[#202020] rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
         
          <button
          onClick={closeInfo}
           className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
                    >
                     <IoClose size={20} className="text-[#9995a4]"/>
                    </button>

         <div className='w-full rounded-[16px] relative px-4 flex flex-col justify-center items-center'>

            <div className="w-[72px] h-[72px] -mt-[34px] rounded-full border-[2px] border-[#1F1F1F] bg-[#3b3b3b] items-center justify-center flex flex-col space-y-2">
             <img src='/coin.webp' alt='wfd' className='w-[34px]'/>
           
            </div>
            <div className='w-full items-center flex pt-1 justify-center space-x-[6px]'>
      
            <h3 className="font-bold text-[22px] text-[#ffffff] pt-2 pb-3 mt-[4px]">
              <span className='text-primary'>Boost your profit</span>
            </h3>
            </div>

            <p className="pb-6 text-[#bfbfbf] px-4 text-[14px] w-full text-center">
        Perform daily activities to increase your total balance and qualify for airdrop distribution and other benefits
            </p>
            </div>
            <div className="w-full flex justify-center pb-7">
            <button onClick={() => setInfo(false)}
              className="bg-[#1857ca] text-primary w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]"
            >
              Start earning <img src='/coin.webp' alt='fd' className='mt-[2px] w-[20px] pl-1'/>
            </button>
          </div>
          </div>
          </div>
        </div>
  )
}

export default BalanceInfo