import React, { useEffect, useState, useRef } from "react";
import Animate from "../Components/Animate";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/userContext";
import { PiEyeBold, PiEyeSlash } from "react-icons/pi";
import { PiApproximateEquals } from "react-icons/pi";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';

import { Address } from "../Components/Address";
import axios from "axios";

import { LuFileClock } from "react-icons/lu";
import SwapComponent from "../Components/SwapComponent";
import { IoClose } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";


const Wallet = () => {
  const { id, walletAssets, purchasedCards, showBalance, setShowBalance} = useUser();
  const [openInfo, setOpenInfo] = useState(false);
  const [bitData, setBitData] = useState({ price: 59781.25 });
  // const [walletAssets, setWalletAssets] = useState([
  //   { symbol: 'USDT', name: 'Tether US', balance: 0, icon: '/tether.webp', price: 1 },
  //   { symbol: 'MAX', name: 'Maxicoin', balance: balance, icon: '/maxitap.webp', price: 0.0004348 },
  //   { symbol: 'TON', name: 'Toncoin', balance: 0, icon: '/ton.png', price: 6.68 },
  //   { symbol: 'NOT', name: 'Notcoin', balance: 0, icon: '/notcoin.jpg', price: 0.01075 },
  //   { symbol: 'BNB', name: 'BNB', balance: 8, icon: '/bnb2.webp', price: 562.36 },
  //   { symbol: 'SOL', name: 'Solana', balance: 0, icon: '/solana.png', price: 143.34 }
  // ]);


  // const history = {
  //   withdrawals: [
  //     {
  //       name: '',
  //       date: new Date(),
  //       amount: 0,
  //       completed: false,
  //     }
  //   ],
  //   deposits: [
  //     {
  //       name: '',
  //       date: new Date(),
  //       amount: 0,
  //       completed: false,
  //     }
  //   ],
  //   swaps: [
  //     {
  //       selectedAssetFromSymbol: '',
  //       date: new Date(),
  //       swapAmount: 0,
  //       selectedAssetToSymbol: '',
  //       calculatedSwapValue: 0,
  //       completed: true,
  //     }
  //   ],
  // }

  // const history = {
  //   withdrawals: [
  //     {
  //       name: '',
  //       date: '',
  //       amount: 0,
  //       completed: false,
  //     }
  //   ],
  //   swaps: [
  //     {
  //       selectedAssetFromSymbol: '',
  //       date: '',
  //       swapAmount: 0,
  //       selectedAssetToSymbol: '',
  //       calculatedSwapValue: 0,
  //       completed: true,
  //     }
  //   ],
  // }

  // Set default selections for from and to assets

  const [openSwapModal, setOpenSwapModal] = useState(false);

  console.log('cards number is', purchasedCards.length)

  // const maxPrice = 0.0004348;

  const calculateTotalUSDTValue = () => {
    return walletAssets.reduce((total, asset) => {
      return total + asset.balance * asset.price;
    }, 0);
  };

  const totalUSDTValue = calculateTotalUSDTValue();

  // const ngtUsdt = (balance + refBonus) * maxPrice;

  const [openInfoTwo, setOpenInfoTwo] = useState(false);

  const infoRefTwo = useRef(null);

  const handleClickOutside = (event) => {
    if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
      setOpenInfoTwo(false);
    }
  };

  const cryptoData = async () => {
    await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin', {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-QswLJD734cRx6UJd1xpamcXX'
      }
    }).then(response => setBitData({ price: response.data.market_data.current_price.usd }))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cryptoData();
  }, []);

  useEffect(() => {
    if (openInfoTwo) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openInfoTwo]);

  const formatNumber = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }
    if (num < 1 && num.toString().split('.')[1]?.length > 3) {
      return num.toFixed(6).replace(/0+$/, '');
    }
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const toggleBalance = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    setShowBalance(!showBalance);
    try {
      await updateDoc(userRef, {
        showBalance: !showBalance,
      });
      console.log('Toggled visibility successfully');
    } catch (error) {
      console.error('Error updating tap value:', error);
    }
  };

  return (
    <>
      <Animate>
        <div className="w-full pt-1 justify-center flex-col space-y-3 px-5">
          <div className="w-full text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-full text-left flex justify-between items-center">
              <h1 className="font-semibold text-[17px] text-center">My Assets</h1>
              <div className="w-[60%]">
                <Address />
              </div>
            </div>
            <div className="w-full flex flex-col bg-cards p-4 rounded-[12px] items-start text-left space-y-3">

              <div className="w-full flex justify-between items-center">

              <span className="flex items-center text-[13px] space-x-3 text-[#a4a4a4]">
                <h2 className="text-[#a4a4a4]">Total Assets</h2>
                {showBalance ? (
                  <PiEyeBold size={16} className="mt-[2px]" onClick={toggleBalance} />
                ) : (
                  <PiEyeSlash size={16} className="" onClick={toggleBalance} />
                )}
              </span>

                  <NavLink to='/history' className="flex items-center space-x-[2px] text-[12px] mt-2 text-[#a4a4a4]">
                    <LuFileClock size={14} className=""/>
                    <span className="">History</span>
                  </NavLink>

              </div>
              <h3 className="flex items-center space-x-3">
                <span className="font-bold text-[30px] leading-[0]">
                  {showBalance ? formatNumber(totalUSDTValue) : '******'}
                </span>
                <span className="text-[13px] mt-2">USDT</span>
              </h3>
              <span className="flex items-center space-x-1 text-[13px]">
                <PiApproximateEquals size={10} className="" />
                <span className="">
                  {showBalance ? formatNumber(totalUSDTValue / bitData.price) : '******'} BTC
                </span>
              </span>
            </div>
            <div className="flex space-x-4 pt-[2px] justify-between items-center w-full">
              <button onClick={() => setOpenInfo(true)} className="w-[32%] bg-cards px-4 py-[10px] text-primary text-[12px] space-y-1 rounded-[8px] flex flex-col items-center justify-center">
                <img src="/withdraw.svg" alt="withdraw" className="w-[24px] h-[24px]" />
                <span className="">Withdraw</span>
              </button>

              <button onClick={() => setOpenSwapModal(true)} className="w-[32%] bg-cards px-4 py-[10px] text-primary text-[12px] space-y-1 rounded-[8px] flex flex-col items-center justify-center">
                <img src="/convert.webp" alt="convert" className="w-[20px] h-[20px]" />
                <span className="">Swap</span>
              </button>

              <NavLink to='/qualify' className="w-[32%] bg-cards px-4 py-[10px] text-primary text-[12px] space-y-1 rounded-[8px] flex flex-col items-center justify-center">
                <img src="/gift.svg" alt="tarnsfer" className="w-[24px] h-[24px]" />
                <span className="">Airdrop</span>
              </NavLink>
            </div>
            <div className="w-full pt-5 text-left flex justify-start">
              <h1 className="font-semibold text-[17px] text-center">Balances</h1>
            </div>
            <div id="refer" className="w-full flex flex-col space-y-[10px] scroller overflow-y-auto h-[50vh] pb-[150px]">
              {walletAssets.map((data, index) => (
                <div key={index} className="w-full bg-cards text-[14px] rounded-[6px] px-4 py-4 space-x-2 flex items-start justify-between">
                  <span className="flex items-center justify-center mt-[1px]">
                    <img src={data.icon} alt={data.name} className="w-[30px] rounded-full" />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex w-full justify-between items-center font-medium">
                      <h4 className="">{data.symbol}</h4>
                     
                      <span className=""> {showBalance ? (<>{formatNumber(data.balance)}</>) : '******'}</span>
                    </div>
                    <div className="flex w-full justify-between items-center text-secondary">
                      <h4 className="text-[11px]">{data.name}</h4>

                      <span className="text-[12px]">
                      {showBalance ? (<>${formatNumber(data.balance * data.price)}</>) : '******'}

                        
                        
                        </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      

        {openInfo && (
<>

<div className={`${openInfo ? 'flex' : 'hidden'} fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center`}>


<div ref={infoRefTwo} className={`w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center`}>


  <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
 
  <button
  onClick={() => setOpenInfo(false)}
   className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
            >
             <IoClose size={20} className="text-[#9995a4]"/>
            </button>


          {purchasedCards.length < 2 ? (
            <div className="w-full flex flex-col justify-center items-center">
           
            <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <span className="w-[50px] flex items-center">
          <CiNoWaitingSign size={50} className="text-bronze"/>
        </span>
            </div>
            <h3 className="font-medium text-center text-[18px] text-[#ffffff] pt-2 pb-2 uppercase">
         WITHDRAWAL ACCESS LOCKED!
            </h3>
            <p className="pb-6 text-[14px] w-full text-center">
          You need to purchase atleast 2 Special Cards in mine activity to unlock withdrawal access! </p>
          </div>
          <div className="w-full flex justify-center pb-6 pt-4">

          <NavLink to='/mine'
              className={`bg-btn4 text-[#000] w-full py-[12px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Purchase Special Cards
            </NavLink>
          </div>
          </div>
          ) : (
            <div className="w-full flex flex-col justify-center items-center">
           
            <div className="w-full flex justify-center flex-col items-center space-y-3">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <span className="w-[50px] flex items-center">
          <CiNoWaitingSign size={50} className="text-bronze"/>
        </span>
            </div>
            <h3 className="font-medium text-center text-[18px] text-[#ffffff] pt-2 pb-2 uppercase">
         LAUNCING SOON.. ANTICIPATE!
            </h3>
            <p className="pb-6 text-[14px] w-full text-center">
         Congratulations you have withdrawal access granted! Keep performing tasks and accumulate more tokens. Withdrawal will be unlocked after listing and token launch.
           </p>
          </div>
          <div className="w-full flex justify-center pb-6 pt-4">

          <button
          onClick={() => setOpenInfo(false)}
              className={`bg-btn4 text-[#000] w-full py-[12px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
             Okay, Continue
            </button>
          </div>
          </div>
          )}





  </div>
  </div>
</div>


{/*  */}


</>



        )}
              <SwapComponent openSwapModal={openSwapModal} setOpenSwapModal={setOpenSwapModal}/>

      </Animate>


    </>
  );
};

export default Wallet;
