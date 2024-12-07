import React, { useEffect, useRef, useState } from 'react';
import { useIsConnectionRestored, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TonConnectButton } from "@tonconnect/ui-react";
// import ErrorBoundary from "../Components/ErrorBoundary";
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase/firestore';
import { useUser } from '../context/userContext';

export const Address = () => {
  const {id, isAddressSaved, setWalletAddress, setIsAddressSaved} = useUser()
    const userFriendlyAddress = useTonAddress();
    // const rawAddress = useTonAddress(false);
    const [disconnect, setDisconnect] = useState(false);

    const [openInfoTwo, setOpenInfoTwo] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);

    const infoRefTwo = useRef(null);
    const infoRef = useRef(null);
  
    const handleClickOutside = (event) => {
  
      if (infoRefTwo.current && !infoRefTwo.current.contains(event.target)) {
        setOpenInfoTwo(false);
      }
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setOpenInfo(false);
      }
    };
  
    useEffect(() => {
      if (openInfoTwo || openInfo) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [openInfoTwo, openInfo]);
  
  
    const clearCache = () => {
      // Clear Local Storage
      localStorage.clear();
  
      // Clear Session Storage
      sessionStorage.clear();
  
      // Clear Service Worker Caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
    };
  // const connectionRestored = useIsConnectionRestored();
  
  
const [tonConnectUI] = useTonConnectUI();
const connectionRestored = useIsConnectionRestored();

useEffect(() => {
    if (!connectionRestored) {
        setTimeout(() => {
            clearCache();
        }, 8000)
    }
})

// Function to handle disconnection
const handleDisconnect = async () => {

    const userRef = doc(db, 'telegramUsers', id.toString());
    try {
      // Update Firestore document
      await updateDoc(userRef, {
        address: '',
        isAddressSaved: false,
      });
      setIsAddressSaved(false);
      setWalletAddress('');
      setDisconnect(!disconnect);
      setOpenInfo(false);
      console.log('Address disconnected successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
    }
    disconn();
  };
  
  

const disconn = async () => {
    try {
        // Disconnect from TonConnect
        await tonConnectUI.disconnect();
        console.log('Disconnected successfully');
      } catch (error) {
        console.error('Error during disconnection:', error);
      }
}

const disco = () => {
    setDisconnect(!disconnect)
}

 // Function to save address to Firestore
 const saveAddressToFirestore = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
      try {
        await updateDoc(userRef, {
          address: userFriendlyAddress,
          isAddressSaved: true,
        });
        setIsAddressSaved(true);
        setWalletAddress(userFriendlyAddress);
        console.log('Address saved successfully');
      } catch (error) {
        console.error('Error saving address:', error);
      }
};

// Use effect to save address whenever it changes
useEffect(() => {
  if (!isAddressSaved && userFriendlyAddress){
    saveAddressToFirestore();
  }
    // eslint-disable-next-line 
}, [userFriendlyAddress]);



    return (
        <>
        
        <div
 className="w-full rounded-[15px] flex flex-col justify-center items-end relative">
 
 {userFriendlyAddress !== '' ? (
 <button
      onClick={() => setOpenInfo(true)} className={`bg-[#a4a4a424] flex h-full w-fit rounded-full items-center py-[10px] px-3 relative space-x-1`}>

<img src='/wallet.webp' alt="connect"
className="w-[16px] -mt-[2px]"/>

<div className="text-[13px] small-text2 text-left pr-3 text-nowrap text-white flex flex-1 flex-col">
<h4 className='font-semibold text-[#d1d1d1] line-clamp-1 break-all text-wrap'>{userFriendlyAddress}</h4></div>
<IoCheckmarkCircle size={20} className='text-[#40863d]' />
</button>
 ): (
    <button
         onClick={() => setOpenInfoTwo(true)} className={`bsg-[#319cdf74] bg-[#319cdf] flex h-full w-fit rounded-full items-center py-[10px] px-3 relative space-x-1`}>
   
   <img src='/wallet.webp' alt="connect"
   className="w-[16px] -mt-[2px]"/>
   
   <div className="text-[13px] small-text2 text-left pr-6 text-nowrap text-white flex flesx-1 flex-col">
 Connect your wallet
   </div>
   <MdOutlineKeyboardArrowRight size={20} className='text-[#fff] absolute right-2' />
   </button>
 )}

 </div>




{/* <div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRefTwo} className={`${
          openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>

<div className="w-fit flex justify-center absolute right-6 top-6">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className="w-fit flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
            <IoCloseCircle size={32} className="text-[#8f8f8f]"/>
            </button>
          </div>


          <div className="w-full flex justify-center flex-col items-center space-y-3 pt-6">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <span className="w-[72px] flex items-center">
          <img src='/wallet.webp' alt="connect"
          className="w-full"/>
        </span>
              <h3 className='font-semibold text-[22px] w-full text-center'>Connect your TON wallet</h3>
              <p className="pb-6 text-[#bfbfbf] text-[14px] w-full text-center">
Connect your crypto wallet. If you don't have one, create one in your Telegram account             </p>
            </div>
            <ErrorBoundary>
          <TonConnectButton className="!w-full" />
        </ErrorBoundary>

          </div>


        </div>
      </div> */}

      <div 
        className={`${
          openInfo=== true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRef} className={`${
          openInfo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal absolute bottom-0 left-0 right-0 rounded-tr-[20px] rounded-tl-[20px] flex flex-col justify-center p-8`}>

<div className="w-fit flex justify-center absolute right-6 top-6">
            <button
              onClick={() => setOpenInfo(false)}
              className="w-fit flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
            <IoCloseCircle size={32} className="text-[#8f8f8f]"/>
            </button>
          </div>


          <div className="w-full flex justify-center flex-col items-center space-y-3 pt-6 pb-32">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <span className="w-[72px] flex items-center">
          <img src='/wallet.webp' alt="connect"
          className="w-full"/>
        </span>
              <h3 className='font-semibold text-green-500 text-[22px] w-full text-center'>Your wallet is connected</h3>
              <p className="pb-6 text-[#bfbfbf] text-[14px] w-full text-center">
              Continue performing tasks and await airdrop distribution! 
                </p>
               

<div className='w-full flex flex-col items-center justify-center space-y-4'>

    <div className='w-full flex flex-col items-center justify-center space-y-1'>

 
<button onClick={disco} className='bg-red-500 w-fit py-2 px-10 text-center rounded-[25px]'>
    Disconnect wallet
</button>
<div className={`${disconnect ? 'flex' : 'hidden'} px-4 py-2 text-[13px] text-center rounded-[8px] flex flex-col`}>

    <p className='text-[#ffffff] pb-2'>Are you sure you want to disconnect? Only connected wallets are eligible for airdrop</p>
   
   <div className='w-full flex justify-center'>
   <button onClick={handleDisconnect} className='font-medium bg-[#eb4848] w-fit rounded-[25px] px-4 py-1'>
       Yes Disconnect wallet
    </button>
    </div>

</div>
</div>

<button onClick={() => setOpenInfo(false)} className='bg-[#fff] text-[#000] py-2 px-8 text-center rounded-[25px]'>
   Go back
</button>

</div>
            </div>

          </div>


        </div>
      </div>



      <div 
        className={`${
          openInfoTwo=== true ? "visible" : "invisible"
        } fixed bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
  

    <div ref={infoRefTwo} className={`${
          openInfoTwo === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"
        } w-full bg-modal absolute bottom-0 left-0 right-0 rounded-tr-[20px] rounded-tl-[20px] flex flex-col justify-center p-8`}>

<div className="w-fit flex justify-center absolute right-6 top-6">
            <button
              onClick={() => setOpenInfoTwo(false)}
              className="w-fit flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]"
            >
            <IoCloseCircle size={32} className="text-[#8f8f8f]"/>
            </button>
          </div>


          <div className="w-full flex justify-center flex-col items-center space-y-3 pt-6 pb-32">
            <div className="w-full items-center justify-center flex flex-col space-y-2">
            <span className="w-[72px] flex items-center">
          <img src='/wallet.webp' alt="connect"
          className="w-full"/>
        </span>
              <h3 className='font-semibold text-[22px] w-full text-center'>Connect your TON wallet</h3>
              <p className="pb-6 text-[#bfbfbf] text-[14px] w-full text-center">
              Connect your crypto wallet to receive airdrop allocation. If you don't have one, create one in your Telegram account    
                </p>
<div className='w-full flex flex-col items-center justify-center space-y-4'>
<TonConnectButton className="!w-full" />
</div>
            </div>
            {/* <ErrorBoundary>
      <w3m-button label='Connect BSC Wallet' balance='show' size='md'/>
      </ErrorBoundary> */}

          </div>


        </div>
      </div>
        
        </>

    );
};