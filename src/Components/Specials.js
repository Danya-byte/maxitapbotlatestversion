import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmarkCircle, IoCheckmarkCircleSharp, IoClose } from "react-icons/io5";
import { AiTwotoneInfoCircle } from "react-icons/ai";
import { TonConnectButton, TonConnectError, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useUser } from '../context/userContext';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../firebase/firestore';


const Specials = () => {
    const {id, purchasedCards, specialCards, setPurchasedCards, walletAssets, setWalletAssets, deposits, setDeposits} = useUser();
    const [openUpgrade, setOpenUpgrade] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null); // State to store selected card
    const infoRefTwo = useRef(null);
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const [message, setMessage] = useState("");
    const [messageColor, setMessageColor] = useState("");
    // eslint-disable-next-line 
    const [isLoading, setIsLoading] = useState(true);
    const [congrats, setCongrats] = useState(false);
    const [showCongratsModal, setShowCongratsModal] = useState(false);
    const [congratsMessage, setCongratsMessage] = useState("");
    const [buttonText, setButtonText] = useState("Make Purchase");
const [buttonDisabled, setButtonDisabled] = useState(false);
    

    

    useEffect(() => {
        const initializeTonConnect = async () => {
            try {
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

    const transaction = (cost) => ({
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
        messages: [
            {
                address: "UQBVG55fi3FjPFBprk6KVknXV4STHrWph08-cMlHgC3SBuG8",
                amount: cost, // Cost of the selected card
            },
        ],
    });



    const handleClick = async () => {
        setButtonText("Processing...");
        setButtonDisabled(true);
    
        try {
            // Send the transaction
            const response = await tonConnectUI.sendTransaction(transaction(selectedCard.cost));
            console.log('Transaction sent successfully');
            console.log('Transaction response:', response);
    
            // Update TON balance in the state
            const updatedWalletAssets = walletAssets.map(asset => 
                asset.symbol === 'TON' 
                    ? { ...asset, balance: asset.balance + selectedCard.profit } 
                    : asset
            );
    
            // Add a new deposit to the deposits state
            const newDeposit = {
                name: `${selectedCard.title} Card`,
                date: new Date(),
                amount: selectedCard.profit,
                completed: true,
            };
    
            const updatedDeposits = [...deposits, newDeposit];
        
            // Update the user's Firestore document with the purchased card
            const userRef = doc(db, 'telegramUsers', id.toString());
            await updateDoc(userRef, {
                specialCards: arrayUnion({
                    title: selectedCard.title,
                    profit: selectedCard.profit,
                    cost: selectedCard.cost,
                    icon: selectedCard.icon,
                    description: selectedCard.description,
                    class: selectedCard.class,
                }),
                walletAssets: updatedWalletAssets,
                'history.deposits': updatedDeposits
            });
    
            // Update local states
            setWalletAssets(updatedWalletAssets);
            setDeposits(updatedDeposits);
            setPurchasedCards(prev => [...prev, selectedCard]);
    
            setCongratsMessage(
                <div className="w-full flex justify-center flex-col items-center space-y-3">
                    <div className="w-full items-center justify-center flex flex-col space-y-2">
                        <IoCheckmarkCircleSharp size={32} className={`text-accent`}/>
                        <p className='font-medium text-center'>Congratulations!</p>
                    </div>
                    <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex items-center space-x-1">
                        <img src='/ton.png' alt='refd' className='w-[22px]'/>
                        <span className={`text-accent`}>{selectedCard.profit}</span> <span>TON CLAIMED</span>
                    </span>
                    <p className="pb-6 text-[15px] w-full text-center">
                        Your claimed TON will be kept safe in your wallet till token launch. You can also swap your TON for more MAX tokens or other listed assets in the wallets menu.
                    </p>
                </div>
            );
    
            // Show the congrats modal
            setShowCongratsModal(true);
            setOpenUpgrade(false);
            setCongrats(true);
            setTimeout(() => {
                setCongrats(false);
            }, 3000);
    
            // Show a success message
            setMessage("Transaction sent successfully and card purchased!");
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
        } finally {
            // Re-enable the button and reset the text
            setButtonText("Make Purchase");
            setButtonDisabled(false);
        }
    };
    

    
    // const handleClick = async () => {
    //     setButtonText("Processing...");
    //     setButtonDisabled(true);
    //     try {
    //         // Send the transaction
    //         const response = await tonConnectUI.sendTransaction(transaction(selectedCard.cost));
    //         console.log('Transaction sent successfully');
    //         console.log('Transaction response:', response);

    //                 // Update TON balance in the state
    //     const updatedWalletAssets = walletAssets.map(asset => 
    //         asset.symbol === 'TON' 
    //             ? { ...asset, balance: asset.balance + selectedCard.profit } 
    //             : asset
    //     );

    //     // Add a new deposit to the deposits state
    //     const newDeposit = {
    //         name: `${selectedCard.title} Card`,
    //         date: new Date(),
    //         amount: selectedCard.profit,
    //         completed: true,
    //     };

    //     const updatedDeposits = [...deposits, newDeposit];
    
    //         // Update the user's Firestore document with the purchased card
    //         const userRef = doc(db, 'telegramUsers', id.toString());
    //         await updateDoc(userRef, {
    //             specialCards: arrayUnion({
    //                 title: selectedCard.title,
    //                 profit: selectedCard.profit,
    //                 cost: selectedCard.cost,
    //                 icon: selectedCard.icon,
    //                 description: selectedCard.description,
    //                 class: selectedCard.class,
    //             }),
    //             walletAssets: updatedWalletAssets,
    //             'history.deposits': updatedDeposits
    //         });

    //                  // Update local states
    //                 setWalletAssets(updatedWalletAssets);
    //                 setDeposits(updatedDeposits);
    //                 setPurchasedCards(prev => [...prev, selectedCard]);

    //                 setCongratsMessage(
    //                     <div className="w-full flex justify-center flex-col items-center space-y-3">
    //                     <div className="w-full items-center justify-center flex flex-col space-y-2">
    //                       <IoCheckmarkCircleSharp size={32} className={`text-accent`}/>
    //                       <p className='font-medium text-center'>congratulations!</p>
    //                     </div>
    //                     <span className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2 flex items-center space-x-1">
    //                     <img src='/ton.png' alt='refd' className='w-[22px]'/>
    //                       <span className={`text-accent`}>{selectedCard.profit}</span> <span>TON CLAIMED</span>
    //                     </span>
    //                     <p className="pb-6 text-[15px] w-full text-center">
    //                       Your claimed TON will be kept safe in your wallet till token launch. You can also swap your TON for more MAX tokens or other listed assets in the wallets menu.
    //                     </p>
    //                   </div>
    //                 );

    //                 // Show the congrats modal
    //                 setShowCongratsModal(true);
    //                 setOpenUpgrade(false);
    //                 setCongrats(true);
    //                 setTimeout(() => {
    //                     setCongrats(false)
    //                 }, 3000);
    
    //         // Show a success message
    //         setMessage("Transaction sent successfully and card purchased!");
    //         setMessageColor("green");
    
    //     } catch (err) {
    //         console.error('Transaction error:', err);
    
    //         if (err instanceof TonConnectError) {
    //             if (err.message.includes('Operation aborted')) {
    //                 setMessage("Transaction was cancelled or timed out. Please try again.");
    //                 setMessageColor("orange");
    //             } else {
    //                 console.error(`TonConnect error: ${err.message}`);
    //             }
    //         } else {
    //             setMessage("An unexpected error occurred. Please try again.");
    //             setMessageColor("red");
    //         }
    
    //         if (err.response) {
    //             console.error('Error response data:', err.response.data);
    //         }
    //     }
    // };


    

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
        let nanoValue = parseFloat(nanoString);
        let tonValue = nanoValue / 1000000000;
        return parseFloat(tonValue.toFixed(9)).toString();
    };

    return (
        <>
{specialCards.map((card, index) => {
    const isPurchased = purchasedCards.some(purchasedCard => purchasedCard.title === card.title);

    return (
        <button 
            onClick={() => {
                if (!isPurchased) {
                    setSelectedCard(card);
                    setOpenUpgrade(true);
                }
            }} 
            key={index} 
            className={`${card.class} w-[48%] py-3 relative rounded-[15px] [&:nth-child(2)]:!mt-0 text-[15px] flex flex-col items-center`}
            disabled={isPurchased}
            style={{ 
                opacity: isPurchased ? 0.5 : 1, 
                cursor: isPurchased ? 'not-allowed' : 'pointer' 
            }}
        >
            <div className='w-[60%] pt-2 rounded-[4px]'>
                <img src={card.icon} alt={`${card.title} icon`} className="w-full rounded-[8px] object-cover h-[60px]" />
            </div>

            <h2 className='pt-1 font-medium'>{card.title}</h2>
            <p className='text-[12px] text-secondary'>{card.tagline}</p>

            <div className="flex items-center space-x-1 pt-1">
                <span className='text-[10px]'>Profit</span>
                <img src='/ton.png' alt='coin' className='w-[12px]' />
                <span className='text-[12px] font-semibold'>
                    {formatNumber(card.profit)} TON
                </span>
            </div>
            <div className='w-[80%] h-[1px] bg-[#A5A5A529] mt-[10px]' />

            <div className='flex items-center justify-center px-3 text-[14px] text-secondary font-semibold py-[6px]'>
                <span className='flex items-center space-x-2'>
                    <img src='/ton.png' alt='coin' className='w-[16px]' />
                    <span className=''>{convertNanoToTon(card.cost)} TON</span>
                </span>
            </div>
                {isPurchased && (

            <div className={`absolute p${card.class} rounded-[15px] left-0 right-0 top-0 bottom-0 flex justify-center flex-col items-center text-center`}>

                <IoCheckmarkCircle size={40} className='text-green-500'/>
                <h2 className='font-medium text-[13px] text-white px-4'>
                    You now own this special card 😎
                </h2>

            </div>
                )}
        </button>
    );
})}



            {openUpgrade && selectedCard && (
                <>
                    <div className="fixed flex bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#303030c4] flex-col justify-end items-center">
                        <div ref={infoRefTwo} className="w-full bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px] relative flex flex-col ease-in duration-300 transition-all justify-center">
                            <div className="w-full flex taskbg rounded-tl-[40px] rounded-tr-[40px] mt-[2px] justify-center relative flex-col items-center space-y-3 p-4 pt-20 pb-10">
                                <button
                                    onClick={() => setOpenUpgrade(false)}
                                    className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
                                >
                                    <IoClose size={20} className="text-[#9995a4]" />
                                </button>

                                <div className="w-full flex justify-center flex-col items-center">
                                    <div className="w-[80px] h-[80px] rounded-[25px] flex items-center justify-center">
                                        <AiTwotoneInfoCircle size={80} className='' />
                                    </div>
                                    <h3 className="font-semibold text-[32px]">
                                        {selectedCard.title}
                                    </h3>
                                    <p className="pb-6 text-primary text-[14px] px-4 text-center">
                                        {selectedCard.description}
                                    </p>
                                    <div className="pb-1 text-primary flex items-center justify-center w-full space-x-1 font-semibold text-[15px] px-4 text-center">
                                       <span> Price:</span> <span className='pl-1'><img src='ton.png' alt='dfd' className='w-[14px] h-[14px]'/></span> <span>{convertNanoToTon(selectedCard.cost)}</span>  <span> TON</span> 
                                    </div>
                                    <div className="pb-6 text-primary flex items-center justify-center w-full space-x-1 font-semibold text-[15px] px-4 text-center">
                                       <span> Profit:</span> <span className='pl-1'><img src='ton.png' alt='dfd' className='w-[14px] h-[14px]'/></span> <span className='text-green-500 '>+{(selectedCard.profit)} TON</span> 
                                    </div>
                                </div>

                                {wallet ? (
                                    <>
                                        <div className="w-full flex justify-center items-center flex-col space-y-2 pb-7">
                                        <button 
    onClick={handleClick} 
    className={`${buttonDisabled ? 'bg-[#5A4420]' : 'bg-btn4'} text-[#000] w-full py-[18px] px-6 text-nowrap flex items-center justify-center text-center rounded-[12px] font-semibold text-[17px]`}
    disabled={buttonDisabled}
>
    {buttonText}
</button>

                                        </div>

                                        {message && (
                                            <p style={{ color: messageColor, marginTop: "10px" }}>
                                                {message}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <div className='w-full flex flex-col items-center justify-center space-y-4'>
                                    <TonConnectButton className="!w-full" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}


<div className='w-full absolute top-[50px] flex justify-center z-50 pointer-events-none select-none'>
      {congrats ? (<img src='/congrats.gif' alt="congrats" className="w-[80%]"/>) : (<></>)}
      </div>



      <div
        className={`${showCongratsModal === true ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 z-40 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
      >
        <div className={`${showCongratsModal === true ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"} w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
          
          
            {congratsMessage}

        

          <div className="w-full flex justify-center">
            <button
              onClick={() => setShowCongratsModal(false)}
              className={`bg-btn4 w-full py-[16px] px-6 flex items-center justify-center text-center rounded-[12px] font-medium text-[16px]`}
            >
              Continue mining
            </button>
          </div>
        </div>
      </div>
        </>
    )
}

export default Specials;
