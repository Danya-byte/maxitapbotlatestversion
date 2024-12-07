import React, { useEffect, useRef, useState } from 'react'
import Levels from '../Components/Levels'
import SettingsMenu from '../Components/SettingsMenu'
import { RiArrowRightSLine, RiSettings4Fill } from 'react-icons/ri'
import { useUser } from '../context/userContext'
import Animate from '../Components/Animate'
import SlotMachine from '../Components/Slot'
import { PiInfoFill } from 'react-icons/pi'
import Exchanges from '../Components/Exchanges'
import { IoIosWarning } from "react-icons/io";
import { IoClose } from 'react-icons/io5'
import BalanceInfo from '../Components/BalanceInfo'

    const Roulette= () => {
    const {userLevelss, tapBalance, fullName, balance, refBonus, openInfoThree, setOpenInfoThree, selectedExchange, selectedCharacter} = useUser();
    const [showLevel, setShowLevel] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [showExchange, setShowExchange] = useState(false);
    const infoRefThree = useRef(null);
    const [info, setInfo] = useState(false);


    const handleClickOutside = (event) => {
      if (infoRefThree.current && !infoRefThree.current.contains(event.target)) {
        setOpenInfoThree(false);
      }
    };

    useEffect(() => {
      if (openInfoThree) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
      // eslint-disable-next-line
    }, [openInfoThree]);
    

  const initialLevelIndex = userLevelss.findIndex(level => tapBalance < level.tapBalanceRequired);
  const currentLevelIndex = initialLevelIndex === -1 ? userLevelss.length - 1 : initialLevelIndex;

  const displayedLevelIndex = currentLevelIndex
  const currentLevel = userLevelss[displayedLevelIndex];

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else {
      return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    }
  };


  return (
     
    <Animate>
         
         <div className='w-full flex justify-center flex-col space-y-3'>
       {/* <Spinner /> */}
    <div className='w-full flex items-center space-x-[6px] px-5'>
          <div className='w-[30px] h-[30px] bg-cards rounded-[8px] p-[6px] overflow-hidden flex items-center justify-center relative'>
            <img src={selectedCharacter.avatar} className='w-[25px] mt-[6px]' alt={fullName || "user"}/>

          </div>

          <h1 className='text-[11px] font-semibold'>
            {fullName} (CEO)
          </h1>

        </div>

      <div className='w-full flex justify-between items-center px-4 z-10 pb-[2px] pt-1'>

        <div className='w-[32%] flex flex-col space-y-1 pr-4'>

          <div className='w-full flex justify-between text-[10px] font-medium items-center'>

            <span className='levelName flex items-center'>
               <span onClick={() => setShowLevel(true)} className=''>{currentLevel.name}</span> 
                <span className='flex items-center'>  <RiArrowRightSLine size={12} className='mt-[1px]'/> </span>
            </span>

            <span className=''>

          {currentLevel.id}/{userLevelss.length}
              

            </span>
          </div>

            <div className='flex w-full mt-2 items-center bg-[#56565630] rounded-[10px] border-[1px] border-[#49494952]'>
       

       <div className={`h-[6px] rounded-[8px] levelbar`} style={{ width: `${(tapBalance / currentLevel.tapBalanceRequired) * 100}%` }}/> 
       </div>

        </div>




        <div className='flex w-[60%] bg-[#5c5c5c52] border-[1px] border-[#434343] h-[40px] mb-[-4px] py-3 px-3 rounded-full items-center'>


            <button onClick={() => setShowExchange(true)} className=''>
                <img id={selectedExchange.id} src={selectedExchange.icon} alt={selectedExchange.name} className={`w-[22px]`}/>
            </button>

            <div className='w-[1px] h-[18px] mx-[10px] bg-divider2'/>
            <div className='flex flex-1 flex-col space-y-1 items-center justify-center'>
              <p className='text-[9px]'>
               Balance
              </p>
              <div className='flex items-center justify-center space-x-1 text-[11px]'>

              <span className='flex items-center justify-center'>
                <img src='/coin.webp' alt='ppf' className='w-[12px]'/>
                  </span>
                <span className='font-bold'>
                  {formatNumber(balance + refBonus)}
                </span>
                <span className='flex items-center justify-center'>
              <PiInfoFill onClick={() => setInfo(true)} size={14} className='text-info'/>
                </span>

              </div>

            </div>

            <div className='w-[1px] h-[18px] mx-[10px] bg-divider2'/>
            
            <button onClick={() => setShowSetting(true)} className=''>
              <RiSettings4Fill size={20} className=''/>
            </button>

        </div>


      </div>


      <div className='w-full relative h-screen bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px]'>
        <div id="refer" className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5'>

        <div className='w-full flex flex-col scroller h-[80vh] overflow-y-auto pb-[150px]'>
{/*  */}

<div className='w-full flex justify-center items-center pt-6'>
    <h1 className='font-semibold text-[20px]'>
        Lucky Spin & Win
    </h1>
</div>

<SlotMachine/>


</div>



</div>





      </div>









      <Levels showLevel={showLevel} setShowLevel={setShowLevel} />
      <Exchanges showExchange={showExchange} setShowExchange={setShowExchange} />

      <SettingsMenu showSetting={showSetting} setShowSetting={setShowSetting} />
      <BalanceInfo info={info} setInfo={setInfo} />

    </div>


    <div 
        className={`${
          openInfoThree=== true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-end backdrop-blur-[10px]`}
      >

<div ref={infoRefThree} className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>
      

      <div className="w-full flex bg-[#202020] rounded-tl-[40px] rounded-tr-[40px] mt-[2px] h-[85vh] justify-start relative flex-col items-center space-y-3 p-4 pb-24">

              <div className="w-full flex flex-col text-center space-y-5 justify-center items-center py-8 relative">

              <div className="w-full flex flex-col justify-between py-8 px-3">
              <button
                      onClick={() =>  setOpenInfoThree(false)}
                      className="flex items-center justify-center absolute right-6 top-6 text-center rounded-[12px] font-medium text-[16px]"
                    >
                      <IoClose size={24} className="text-[#9a96a6]"/>
                    </button>


                <div className="w-full flex justify-center flex-col items-center">
                  <div className="w-[70px] h-[70px] rounded-[15px] bg-cards3 flex items-center justify-center">
                  <IoIosWarning size={50} className="text-[#d03a2c]"/>
                  </div>
                  <h3 className="font-semibold text-[24px] py-4">
                  Hy 😎!
                  </h3>
                  <p className="pb-6 text-[#c3bfd2] text-[14px] text-center">
My name is Samuel and I developed this bot app. If you need to purchase the source code for
this project or you want to create similar projects like this, you can message me directly on telegram via <a href="https://t.me/conceptdevelopers" className="text-[#ffba4c]">t.me/conceptdevelopers</a>
                  </p>

 
                </div>

                <div className="w-full flex justify-center">
                  <button
                  onClick={()=> setOpenInfoThree(false)}
                    className={`bg-btn4 text-[#000] w-full py-4 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[18px]`}
                  >
                  Okay, Continue 🤙
                  </button>
                </div>
              </div>


</div>

              </div>
            </div>
            </div>


</Animate>
  )
}

export default Roulette