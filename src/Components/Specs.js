import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from "react-icons/io5";
import { useUser } from '../context/userContext';
// import { RiTimerFlashLine } from "react-icons/ri";
import { AiTwotoneInfoCircle } from "react-icons/ai";
import { TonConnectButton, TonConnectError, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';

const specialCards = [
    {
      title: 'Airdrop Hunter',
      profit: 10,
      cost: '500000000',
      icon: '/hunter.webp',
      description: 'Withdrawal access',
      class: 'specials1',
    },
    {
      title: 'Early Access',
      profit: 5,
      cost: '200000000',
      icon: '/access.webp',
      description: 'Airdrop special',
      class: 'specials2',
    },
    {
      title: 'Balance Booster',
      profit: 50,
      cost: '1000000000',
      icon: '/booster.webp',
      description: 'Get more tokens',
      class: 'specials3',
    },
    {
      title: 'Token Swap Access',
      profit: 5,
      cost: '200000000',
      icon: '/swap.webp',
      description: 'Swap tokens special',
      class: 'specials4',
    },
  
  ]
  


const Specs = () => {
    const [openUpgrade, setOpenUpgrade] = useState(false);
    const infoRefTwo = useRef(null);
    const wallet = useTonWallet();
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const initializeTonConnect = async () => {
          try {
            // Attempt to initialize TonConnect
            await tonConnectUI.connectionRestored;
            setIsLoading(false);
          } catch (err) {
            console.error('TonConnect initialization error:', err);
            if (err instanceof TonConnectError) {
              setMessage(`TonConnect error: ${err.message}`);
            } else {
              setMessage("An error occurred while connecting to TON. Please refresh the page and try again.");
            }
            setMessageColor("red");
            setIsLoading(false);
          }
        };
    
        initializeTonConnect();
      }, [tonConnectUI]);
    
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
        messages: [
         {
        address: "UQBVG55fi3FjPFBprk6KVknXV4STHrWph08-cMlHgC3SBuG8",
        amount: '500000000', // 0.01 TON
         },
         ],
         };
        console.log('Transaction:', transaction);
    
      const handleClick = async () => {
        try {
          const response = await tonConnectUI.sendTransaction(transaction);
          console.log('Transaction sent successfully');
          console.log('Transaction response:', response);
          setMessage("Transaction sent successfully!");
          setMessageColor("green");
        } catch (err) {
          console.error('Transaction error:', err);
          
          if (err instanceof TonConnectError) {
            if (err.message.includes('Operation aborted')) {
              setMessage("Transaction was cancelled or timed out. Please try again.");
              setMessageColor("orange");
            } else {
              console.error(`TonConnect error: ${err.message}`);
            }
          } else {
            setMessage("An unexpected error occurred. Please try again.");
            setMessageColor("red");
          }
          
          if (err.response) {
            console.error('Error response data:', err.response.data);
          }
        }
      };

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

      const formatNumber = (num) => {
        if (num < 1000) {
          return num;
        } else if (num < 1000000) {
          return (num / 1000).toFixed(1).replace(/\.0$/, '') + "k";
        } else {
          return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
        }
      };

      
      const convertNanoToTon = (nanoString) => {
        // Convert the string to a number
        let nanoValue = parseFloat(nanoString);
    
        // Convert nanoTON to TON (1 TON = 10^9 nanoTON)
        let tonValue = nanoValue / 1000000000;
    
        // Convert the ton value to a string without unnecessary decimals
        return parseFloat(tonValue.toFixed(9)).toString();
    };
    

      
  return (
<>
      {specialCards.map((card, index) => (
         <button onClick={() => setOpenUpgrade(true)} key={index} className={`${card.class} w-[48%] py-3 rounded-[15px] [&:nth-child(2)]:!mt-0 text-[15px] flex flex-col items-center`}>

        <div className='w-[60%] pt-2 rounded-[4px]'>
          <img src={card.icon} alt={`${card.title} icon`} className="w-full rounded-[8px] object-cover h-[60px]" />
        </div>

          <h2 className='pt-1 font-medium'>{card.title}</h2>

          <p className='text-[12px] text-secondary'>{card.description}</p>




       
         
                      <div className="flex items-center space-x-1 pt-1">
                      <span className='text-[10px]'> 
                      Profit
                          </span>
                    <img src='/ton.png' alt='coin' className='w-[12px]' />
            <span className='text-[12px] font-semibold'>
                {formatNumber(card.profit)} TON
              </span>
              </div>
              <div className='w-[80%] h-[1px] bg-[#A5A5A529] mt-[10px]' />

    <div className='flex items-center justify-center px-3 text-[14px] text-secondary font-semibold py-[6px]'>
                 
                        <span className='flex items-center space-x-2'>
                              <img src='/coin.webp' alt='coin' className='w-[16px]' />
                              <span className=''>{convertNanoToTon(card.cost)} TON</span>
                        </span>
                    </div>
           
           
              



      


        
        </button>
      ))}



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
              <AiTwotoneInfoCircle size={80} className=''/>
            </div>
            <h3 className="font-semibold text-[32px]">
           Info
            </h3>
     
            <p className="pb-6 text-primary text-[14px] px-4 text-center">
           description
            </p>
            <div>


    </div>

          </div>

          {wallet ? (
                    <>
                        <div className="w-full flex justify-center items-center flex-col space-y-2 pb-7">
                        <button onClick={handleClick} className='bg-btn4 w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]'>
        Make Purchase
      </button>
  </div>
                    

  {message && (
        <p style={{ color: messageColor, marginTop: "10px" }}>
          {message}
        </p>
      )}
                    </>

                ) : (
                    <TonConnectButton/>
                )}


  </div>
  </div>
</div>
</>
        )}

</>
  )
}

export default Specs