import React, { useEffect, useRef, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore'; // Adjust the path as needed
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkCircleSharp, IoClose } from "react-icons/io5";
import { PiLockFill } from "react-icons/pi";
import { useUser } from '../context/userContext';

const Business = () => {
    const {userLevelsMarket, marketTeam, success, totalMarketProfit, setTotalMarketProfit, setSuccess, setUserLevelsMarket, balance, setBalance, refBonus, id, profitHour, setProfitHour } = useUser();
    const [upgrading, setUpgrading] = useState(false);
    const [upgradeStatus, setUpgradeStatus] = useState('');
    const [openUpgrade, setOpenUpgrade] = useState(false);
    const [selectedUpgrade, setSelectedUpgrade] = useState({});
    const infoRefTwo = useRef(null);
    const [openClaim, setOpenClaim] =  useState(false);



    const handleClickOutside = (event) => {
        if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
          setOpenUpgrade(false);
        }
      };
    
      useEffect(() => {
        if (openUpgrade) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [openUpgrade]);
    
    
      const handleUpgrade = (index) => {
        const currentMarketLevel = userLevelsMarket[index];
        const nextMarketLevelData = marketTeam[index].level.find(l => l.level === currentMarketLevel + 1);
      
        if (!nextMarketLevelData) return;
      
        setSelectedUpgrade({ index, nextMarketLevelData, currentMarketLevel });
        setOpenUpgrade(true);
      };
      
      const confirmUpgrade = async () => {
        const { index, nextMarketLevelData, currentMarketLevel } = selectedUpgrade;
      
        if (index === 4 && userLevelsMarket[3] < 3) {
          setUpgradeStatus(
            <div className='w-full bg-modal rounded-[20px] py-[6px] flex items-center text-[#ffe253] px-4'>
              <span>Upgrade to level 3 of finance management required</span>
            </div>
          );
          setTimeout(() => {
            setUpgrading(false);
            setUpgradeStatus('');
          }, 3000);
          return;
        }
        if (index === 5 && userLevelsMarket[4] < 1) {
          setUpgradeStatus(
            <div className='w-full bg-modal rounded-[20px] py-[6px] flex items-center text-[#ffe253] px-4'>
              <span>Upgrade to level 1 of risk management required</span>
            </div>
          );
          setTimeout(() => {
            setUpgrading(false);
            setUpgradeStatus('');
          }, 3000);
          return;
        }
      
        if ((balance + refBonus) < nextMarketLevelData.cost) {
          setUpgrading(true);
          setUpgradeStatus(
            <div className='w-full bg-modal rounded-[20px] py-[6px] flex items-center text-[#ffe253] px-4'>
              <span>Insufficient balance</span>
            </div>
          );
          setTimeout(() => {
            setUpgrading(false);
            setUpgradeStatus('');
          }, 3000);
          return;
        }
      
        setUpgrading(true);
        setUpgradeStatus(
          <div className='w-full bg-modal rounded-[20px] py-[6px] flex items-center text-secondary px-6 space-x-2'>
            <AiOutlineLoading3Quarters size={14} className='animate-spin'/>
            <span>Processing... please wait!</span>
          </div>
        );
      
        const userRef = doc(db, 'telegramUsers', id.toString());
        const userDoc = await getDoc(userRef);
      
        if (!userDoc.exists()) {
          console.error('User document does not exist');
          return;
        }
      
        const userData = userDoc.data();
        const updatedmarketTeam = userData.marketTeam ? [...userData.marketTeam] : marketTeam.map(() => ({
          title: '',
          level: 0,
          profit: 0,
          cost: 0,
          totalMarketProfit: 0, // Initialize totalProfit if it doesn't exist
        }));
      
        const newMarketLevel = currentMarketLevel + 1;
        const newMarketProfit = nextMarketLevelData.profit;
        const newTotalMarketProfit = (updatedmarketTeam[index].totalMarketProfit || 0) + newMarketProfit;
      
        updatedmarketTeam[index] = {
          title: marketTeam[index].title,
          level: newMarketLevel,
          profit: newMarketProfit,
          cost: nextMarketLevelData.cost,
          totalMarketProfit: newTotalMarketProfit,
        };
      
        const updatedBalance = balance - nextMarketLevelData.cost;
        const updatedProfitHour = profitHour + newMarketProfit;
      
        const updatedUserData = {
          balance: updatedBalance,
          profitHour: updatedProfitHour,
          marketTeam: updatedmarketTeam,
        };
      
        await updateDoc(userRef, updatedUserData);
      
        setTimeout(() => {
          setUserLevelsMarket((prevMarketLevels) => prevMarketLevels.map((level, i) => (i === index ? newMarketLevel : level)));
          setTotalMarketProfit((prevTotalMarketProfits) => prevTotalMarketProfits.map((profit, i) => (i === index ? newTotalMarketProfit : profit))); // Update total profits
          setProfitHour(updatedProfitHour);
          setBalance(updatedBalance);
          setUpgradeStatus('');
          setSuccess(true);
          setOpenClaim(true);
        }, 1000);
      
        setTimeout(() => {
          setUpgrading(false);
          setUpgradeStatus('');
          setSuccess(false);
        }, 3000);
      
        setOpenUpgrade(false);
      };
      
      const formatNumber = (num) => {
        if (num < 1000) {
          return num;
        } else if (num < 1000000) {
          return (num / 1000).toFixed(1).replace(/\.0$/, '') + "k";
        } else {
          return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
        }
      };


      const formatNumberCi = (num) => {
        if (num < 100000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 1000000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else {
          return (num / 1000000).toFixed(3).replace(".", ".") + " M";
        }
      };
    

      
  return (
<>
{marketTeam.map((market, index) => {
                const currentMarketLevel = userLevelsMarket[index];
                const marketProfitsTotal = totalMarketProfit[index];
                const nextMarketLevelData = market.level.find(l => l.level === currentMarketLevel + 1);
                     // eslint-disable-next-line
                const currentMarketLevelData = market.level.find(l => l.level === currentMarketLevel);
                     // eslint-disable-next-line
                const maxMarketLevelReached = currentMarketLevel === market.level.length;

                const getLockMessage = () => {
                  if (index === 4 && userLevelsMarket[3] < 3) {
                    return 'finance mngmt lvl 3';
                  } else if (index === 5 && userLevelsMarket[4] < 1) {
                    return 'risk mngmt lvl 1';
                  }
                  return 'Locked';
                }

                return (
                    <div key={market.title} className='bg-cards w-[48%] pt-4 pb-2 rounded-[15px] [&:nth-child(2)]:!mt-0 text-[13px] flex flex-col justify-between'>
                    <button
                      disabled={upgrading === true}
                      onClick={() => handleUpgrade(index)} className='flex cursor-pointer w-full h-full items-center flex-col px-3 pb-2'>
                    <div className='relative w-[60px] flex items-center pb-2 justify-center'>
                        <img src={market.icon} alt={market.title} className='w-[54px] h-[54px] rounded-full' />
                        {(index === 4 && userLevelsMarket[3] < 3) || (index === 5 && userLevelsMarket[4] < 1) ? (
                          <div className={`flex h-[64px] w-[64px] absolute bg-[#52657dc1] rounded-full items-center justify-center`}>
                            <PiLockFill size={24} className='text-[#fff]'/>
                          </div>
                        ) : (
                          <>
                          </>
                        )}
                      </div>

                      <div className='flex flex-col items-center justify-center'>
                        <h3 className='font-medium'>{market.title}</h3>

                        <span className='flex items-center space-x-1'>
                        <span className='text-nowrap text-[10px]'>Profit per hour</span>
                          {currentMarketLevel === 0 ? (
                            <img src='/coingrey.webp' alt='coingray' className='w-[10px]' />
                          ) : (
                            <img src='/coin.webp' alt='coingray' className='w-[10px]' /> 
                          )}
                          <span className={`${currentMarketLevel === 0 ? 'text-secondary' : 'text-primary'} font-semibold text-[12px]`}>
                            {currentMarketLevel === 0 ? (
                              <>
                             +{nextMarketLevelData.profit}
                              </>
                            ) : (
                              <>
                            {marketProfitsTotal}
                              </>
                            )}
                          </span>
                        </span>
                      </div>
                    </button>
                    <div className='w-full h-[1px] bg-[#4141417b]' />

                    <div className='flex items-center justify-center px-3 text-[14px] font-semibold py-[6px]'>
                      <span className='text-secondary text-nowrap'>lvl {currentMarketLevel}</span>
                      <div className='w-[1px] h-[14px] mx-[10px] bg-[#4141417b]' />
                      {nextMarketLevelData ? (
                        <span className='flex items-center space-x-2'>
                          {(index === 4 && userLevelsMarket[3] < 3) || (index === 5 && userLevelsMarket[4] < 1) ? (
                            <>
                              <img src='/coingrey.webp' alt='coin' className='w-[16px]' />
                              <span className='text-[10px]'>{getLockMessage()}</span>
                            </>
                          ) : (
                            <>
                              <img src='/coin.webp' alt='coin' className='w-[16px]' />
                              <span className=''>{formatNumber(nextMarketLevelData.cost)}</span>
                            </>
                          )}
                        </span>
                      ) : (
                        <>
                          <span className='text-secondary'>Max profit</span>
                        </>
                      )}
                    </div>
                  </div>
                );
    
              })}

<div className={`${upgrading ? 'visible top-1' : 'invisible top-[-12px] ease-out'} ease-in transition-all duration-300 w-full flex absolute left-0 right-0 px-8`}>
          {upgradeStatus}
        </div>


        <div className={`${success ? 'visible top-[-6%] right-6' : 'invisible top-[-12px] ease-out'} ease-in z-[60] transition-all duration-300 w-full flex justify-end absolute px-8`}>
          <img src='/profithour.gif' alt='fgdsfc' className='w-[150px]'/>
        </div>

        {openUpgrade && (
<>

<div className={`${openUpgrade ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>


<div ref={infoRefTwo} className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>


  <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
 
  <button
  onClick={() => setOpenUpgrade(false)}
   className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
            >
             <IoClose size={20} className="text-[#9995a4]"/>
            </button>

            <div className="w-full flex justify-center flex-col items-center">
            <div className="w-[80px] h-[80px] rounded-[25px] flex items-center justify-center">
              <img alt="claim" src={marketTeam[selectedUpgrade.index].icon} className="w-[80px] rounded-full" />
            </div>
            <h3 className="font-semibold text-[28px] text-center w-full">
            {marketTeam[selectedUpgrade.index].title}
            </h3>
            <p className="pb-6 text-primary text-[14px] px-4 text-center">
            {marketTeam[selectedUpgrade.index].description}
            </p>

            <div className="flex flex-col">
              <span className='text-[13px]'>
                  Profit per hour
              </span>
            <div className="flex flex-1 items-center justify-center space-x-1">

              <div className="">
                <img
                  src='/coin.webp'
                  className="w-[12px]"
                  alt="Coin Icon"
                />
              </div>
              <div className="font-bold text-[13px] flex items-center">+{formatNumber(selectedUpgrade.nextMarketLevelData.profit)} 
                   </div>
            </div>
            </div>

            <div className="flex flex-1 items-center space-x-2 pt-3">
              <div className="">
                <img
                  src='/coin.webp'
                  className="w-[30px]"
                  alt="Coin Icon"
                />
              </div>
              <div className="font-bold text-[24px] flex items-center">{formatNumberCi(selectedUpgrade.nextMarketLevelData.cost)} 
                   </div>
            </div>
          </div>

          <div className="w-full flex justify-center pb-6 pt-4">
          {(balance + refBonus) >= selectedUpgrade.nextMarketLevelData.cost ? (
                   <button
           onClick={confirmUpgrade}
           disabled={upgrading === true}
          className={`${((selectedUpgrade.index === 4 && userLevelsMarket[3] < 3) || (selectedUpgrade.index=== 5 && userLevelsMarket[4] < 1)) ? 'bg-[#42424264] text-[#979797]' : 'bg-btn4 text-[#000]'} w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[18px]`}
            >
 {((selectedUpgrade.index === 4 && userLevelsMarket[3] < 3) || (selectedUpgrade.index=== 5 && userLevelsMarket[4] < 1)) ? (
                      <>
               Unlock required level first
                 
                      </>
                    ) : (
                      <>
                  
                  Go ahead
                      </>
                    )}
            </button>
      ) : (
          <button
          disabled={upgrading === true}
         className={`bg-[#42424264] text-[#979797] w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[18px]`}
           >
                    {((selectedUpgrade.index === 4 && userLevelsMarket[3] < 3) || (selectedUpgrade.index=== 5 && userLevelsMarket[4] < 1))  ? (
                      <>
                Unlock required level first
               
                      </>
                    ) : (
                      <>
                  
                  Insufficient balance
                      </>
                    )}
           </button>
      )}

          </div>




  </div>
  </div>
</div>

      </>
        )}

<div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {success ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>



      <div
        className={`${
          openClaim === true ? "visible" : "invisible"
        } fixed top-[-12px] claimdiv bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex flex-col justify-center items-center px-4`}
      >
 
        <div className={`${
          openClaim === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal rounded-[16px] relative flex flex-col justify-center p-8`}>
      

          <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
              <IoCheckmarkCircleSharp size={32} className='text-accent'/>
              <p className='font-medium'>Let's go!!</p>
            </div>
            <h3 className="font-medium text-center w-full text-[18px] text-[#ffffff] pt-2 pb-2">
              <span className='text-accent'>PPH UPGRADE SUCCESSFUL!</span> 
            </h3>
            <p className="pb-6 text-[#bfbfbf] text-[15px] w-full text-center">
              Keep grinding! something huge is coming! Get more PPH now! 
            </p>

            <div className="w-full flex justify-center">
            <button
              onClick={() => setOpenClaim(false)}
              className="bg-btn4 text-[#000] w-full py-[12px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
              Continue
            </button>
          </div>
          </div>
          </div>

        </div>

</>
  )
}

export default Business