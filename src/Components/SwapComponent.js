import React, { useEffect, useState } from 'react'
import { useUser } from '../context/userContext';
import { IoMdArrowDropdown, IoMdCheckmark } from "react-icons/io";
import { MdOutlineSwapVert } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { PiArrowDownBold } from "react-icons/pi";
import { PiApproximateEquals } from "react-icons/pi";

const SwapComponent = ({openSwapModal, setOpenSwapModal}) => {
    const {balance, id, setBalance, setSwaps, walletAssets, setWalletAssets } = useUser();
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [openConfirmSwapModal, setOpenConfirmSwapModal] = useState(false);
    const [swapAmount, setSwapAmount] = useState('');
    const [calculatedSwapValue, setCalculatedSwapValue] = useState(0);
    const [balanceError, setBalanceError] = useState(false);
    const [openAssetSelectionModal, setOpenAssetSelectionModal] = useState(null);

    const [selectedAssetFrom, setSelectedAssetFrom] = useState(walletAssets.find(asset => asset.symbol === 'MAX'));
    const [selectedAssetTo, setSelectedAssetTo] = useState(walletAssets.find(asset => asset.symbol === 'USDT'));
  

    const handleSwap = () => {
        if (!selectedAssetFrom || !selectedAssetTo || swapAmount <= 0) {
          alert('Please select valid assets and enter a valid amount');
          return;
        }
    
        if (selectedAssetFrom.balance < swapAmount) {
          setBalanceError(true);
          return;
        }
    
        setOpenConfirmSwapModal(true);
      };
    
    
    
      const confirmSwap = async () => {
        const confirmButton = document.getElementById("confirmButton");
        if (confirmButton) {
            confirmButton.textContent = "Processing...";
            confirmButton.disabled = true;
        }
    
        // Swap fee calculation (0.5% fee)
        const swapFee = swapAmount * 0.005;
        const amountAfterFee = swapAmount - swapFee; // Deduct the fee once from the swapAmount
    
        // Equivalent value after the fee is deducted
        const equivalentValue = amountAfterFee * (selectedAssetFrom.price / selectedAssetTo.price);
    
        let newBalance = balance;
        const updatedAssets = walletAssets.map(asset => {
            if (asset.symbol === selectedAssetFrom.symbol) {
                if (selectedAssetFrom.symbol === 'MAX') {
                    newBalance -= parseFloat(swapAmount); // Deduct the swapAmount from the user's general balance
                }
                return {
                    ...asset,
                    balance: asset.balance - parseFloat(swapAmount),
                };
            }
            if (asset.symbol === selectedAssetTo.symbol) {
                // Add the equivalent value directly to the 'to' asset balance without subtracting the fee again
                return {
                    ...asset,
                    balance: asset.balance + equivalentValue, // No further deduction of the swap fee here
                };
            }
            return asset;
        });
    
        const userRef = doc(db, 'telegramUsers', id.toString());
      
        // Prepare swap history data
        const swapHistory = {
          selectedAssetFromSymbol: selectedAssetFrom.symbol,
          date: new Date(), // Save the current date and time
          swapAmount: parseFloat(swapAmount),
          selectedAssetToSymbol: selectedAssetTo.symbol,
          calculatedSwapValue: equivalentValue,
          completed: true,
        };
      
        try {
          await updateDoc(userRef, {
            walletAssets: updatedAssets,
            ...(selectedAssetFrom.symbol === 'MAX' && { balance: newBalance }),
            'history.swaps': arrayUnion(swapHistory), // Add the swap history to the user's history in Firestore
          });
      
          console.log('Swapped values, balance, and history updated successfully in Firestore');
          
          setWalletAssets(updatedAssets);
          if (selectedAssetFrom.symbol === 'MAX') {
            setBalance(newBalance);
          }
    
          setSwaps(prevSwaps => [...prevSwaps, swapHistory]);
    
            setTimeout(() => {
                if (confirmButton) {
                    confirmButton.textContent = "Confirm";
                    confirmButton.disabled = false;
                }
    
                setSwapAmount('');
                setSelectedAssetFrom(walletAssets.find(asset => asset.symbol === 'MAX'));
                setSelectedAssetTo(walletAssets.find(asset => asset.symbol === 'USDT'));
                setBalanceError(false);
    
                setOpenConfirmSwapModal(false);
                setOpenSwapModal(false);
                setOpenSuccessModal(true);
            }, 2000);
        } catch (error) {
            console.error('Error updating Firestore:', error);
    
            if (confirmButton) {
                confirmButton.textContent = "Confirm";
                confirmButton.disabled = false;
            }
        }
    };
    
      
      const handleSwapAmountChange = (e) => {
        const amount = parseFloat(e.target.value);
        setSwapAmount(amount);
    
        if (selectedAssetFrom && selectedAssetTo && amount > 0) {
          const equivalentValue = amount * (selectedAssetFrom.price / selectedAssetTo.price);
          setCalculatedSwapValue(equivalentValue);
        } else {
          setCalculatedSwapValue(0);
        }
    
        // Check for balance error
        if (selectedAssetFrom && amount > selectedAssetFrom.balance) {
          setBalanceError(true);
        } else {
          setBalanceError(false);
        }
      };
    
      const handleAssetSelection = (asset, type) => {
        if (type === 'from') {
          setSelectedAssetFrom(asset);
          // Automatically select the first asset in the list that's not Maxicoin as the 'to' asset
          if (asset.symbol === 'MAX') {
            const filteredAssets = walletAssets.filter(asset => asset.symbol !== 'MAX');
            setSelectedAssetTo(filteredAssets[0]); // Select the first non-Maxicoin asset by default
          }
        } else if (type === 'to') {
          // Ensure Maxicoin is not selectable as 'to' asset
          if (asset.symbol !== 'MAX') {
            setSelectedAssetTo(asset);
          }
        }
        setOpenAssetSelectionModal(null);
      };
      
      // When rendering the asset selection modal
      const filteredWalletAssets = openAssetSelectionModal === 'to' 
      ? walletAssets.filter(asset => asset.symbol !== 'MAX') 
      : walletAssets;
    
      const clearInput = () => {
        setSwapAmount('');
        setBalanceError(false);
      };
    
      const cancelSwap = () => {
        setOpenSwapModal(false);
        setSwapAmount('');
        setCalculatedSwapValue(0);
        setSelectedAssetFrom(walletAssets.find(asset => asset.symbol === 'MAX')); // Reset to default 'from' asset
        setSelectedAssetTo(walletAssets.find(asset => asset.symbol === 'USDT')); // Reset to default 'to' asset
        setBalanceError(false);
      }
    
      const closeSuccess = () => {
        setCalculatedSwapValue(0);
        setOpenSuccessModal(false);
        setSwapAmount('');
        setSelectedAssetFrom(walletAssets.find(asset => asset.symbol === 'MAX')); // Reset to default 'from' asset
        setSelectedAssetTo(walletAssets.find(asset => asset.symbol === 'USDT')); // Reset to default 'to' asset
      }
    
      const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === 'Return') {
          event.preventDefault();
          event.target.blur();
        }
      };
    
      useEffect(() => {
        if (selectedAssetFrom && selectedAssetTo && selectedAssetFrom.symbol === selectedAssetTo.symbol) {
          // Find the index of the selectedAssetFrom in the walletAssets array
          const fromIndex = walletAssets.findIndex(asset => asset.symbol === selectedAssetFrom.symbol);
      
          // Find the next asset in the list, or loop back to the start if at the end
          const nextIndex = (fromIndex + 1) % walletAssets.length;
      
          // Set the selectedAssetTo to the next asset
          setSelectedAssetTo(walletAssets[nextIndex]);
        }
      }, [selectedAssetFrom, selectedAssetTo, walletAssets]);

      useEffect(() => {

        // Attach a click event listener to handle the back navigation
        const handleBackButtonClick = () => {
                setOpenSwapModal(false);
                setSwapAmount('');
                setOpenAssetSelectionModal(false);
                setCalculatedSwapValue(0);
                setOpenConfirmSwapModal(false);
                setOpenSuccessModal(false);
                setSelectedAssetFrom(walletAssets.find(asset => asset.symbol === 'MAX')); // Reset to default 'from' asset
                setSelectedAssetTo(walletAssets.find(asset => asset.symbol === 'USDT')); // Reset to default 'to' asset
                setBalanceError(false);
              }
    
          
        if (openSwapModal || openSuccessModal) {
          window.Telegram.WebApp.BackButton.show();
          window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
        } else {
          window.Telegram.WebApp.BackButton.hide();
          window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        }
      
        // Cleanup handler when component unmounts
        return () => {
          window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
    
        };
        // eslint-disable-next-line
      }, [openSwapModal, setOpenSwapModal, openSuccessModal, setOpenSuccessModal]);

      
      
      const formatNumber = (num) => {
        if (typeof num !== "number") {
          return "Invalid number";
        }
        if (num < 1 && num.toString().split('.')[1]?.length > 3) {
          return num.toFixed(6).replace(/0+$/, '');
        }
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      };
    

  return (
    <>
          {/* Asset Selection Modal */}
          <div
        className={`${openAssetSelectionModal ? "visible opacity-100" : "invisible opacity-0"} ease-in duration-150 w-full left-0 right-0 fixed top-[-12px] bottom-0 z-[60] h-[100vh] taskbg flex px-5`}
      >
        <div className={`w-full h-full relative flex flex-col space-y-2 pt-4`}>

          <div className="w-full flex justify-between items-center">

<button className="bg-cards px-4 py-[10px] rounded-[25px] flex flex-1">

          <span className="text-[11px] text-secondary">Select your preferred pair</span>
</button>


<div className="flex justify-center items-center">
            <button onClick={() => setOpenAssetSelectionModal(null)} className="px-4 text-secondary text-[12px]">Cancel</button>
          </div>

      
          </div>


          <div className="border-b-[1px] border-cards w-full pt-2">

            <h3 className="text-[13px] border-b-[4px] border-btn4 w-fit pb-2">
              Crypto
            </h3>

          </div>
          <div className="flex flex-col">

{filteredWalletAssets.map(asset => (
  <div key={asset.symbol} onClick={() => handleAssetSelection(asset, openAssetSelectionModal)} className="w-full text-[14px] py-3 space-x-3 flex items-center justify-between">
    <span className="flex items-center justify-center mt-[1px]">
      <img src={asset.icon} alt={asset.name} className="w-[26px] rounded-full" />
    </span>
    <div className="flex flex-1 flex-col">
      <div className="flex w-full justify-between items-center font-medium">
        <h4 className="">{asset.symbol}</h4>
        <span className="">{formatNumber(asset.balance)}</span>
      </div>
      <div className="flex w-full justify-between items-center text-secondary">
        <h4 className="text-[11px]">{asset.name}</h4>
        <span className="text-[12px]">${formatNumber(asset.balance * asset.price)}</span>
      </div>
    </div>
  </div>
))}


          </div>

        </div>
      </div>

      {/* Swap Modal */}
      <div
        className={`${openSwapModal ? "visible right-0" : "invisible right-[-100%]"} ease-in duration-150 w-full fixed top-[-12px] bottom-0 z-50 h-[100vh] taskbg flex px-5`}
      >
        <div className={`w-full h-full relative flex flex-col space-y-2 pt-4`}>

          <div className="w-full flex justify-between items-center px-1">

          <h3 className="text-[14px] text-secondary pb-4">Account</h3>


          <h3 className="font-medium text-[15px] pb-4">Wallet Assets</h3>

      
          </div>
          
          <div className="w-full flex flex-col !mt-[-4px]">


            <div className={`${balanceError ? 'border-[1px] border-red-500' : ''} flex flex-col mb-[-10px]  space-y-[2px] bg-cards p-4 rounded-[8px]`}>

<div className="flex justify-between items-center">

  <span className="text-secondary text-[12px]">
    From
  </span>

 
  {selectedAssetFrom && (
                <span className="text-secondary text-[11px]">
                    Available: {formatNumber(selectedAssetFrom.balance)} {selectedAssetFrom.symbol}
                  </span>
                )}
 

</div>

                  <div className="w-full flex justify-between items-center">

              <div className="flex cursor-pointer" onClick={() => setOpenAssetSelectionModal('from')}>
                {selectedAssetFrom ? (
                  <div className="flex space-x-2">
                    <span className="flex items-center">
                    <img src={selectedAssetFrom.icon} alt={selectedAssetFrom.name} className="w-[28px] h-[28px] rounded-full" />
                    </span>
                    <span className="flex flex-col">
                    <span className="text-white text-[14px] font-medium flex items-center space-x-1">
                     <span> {selectedAssetFrom.symbol} </span>
                     <IoMdArrowDropdown size={16} className="text-secondary"/>
                      
                      </span>
                      <span className="text-secondary text-[11px]"> {selectedAssetFrom.name}</span>
                    </span>
                 
                  </div>
                ) : (
                  <span className="text-white">Select asset to swap from</span>
                )}
              </div>
              <div className="flex flex-col space-y-1">

                <input
                  type="number"
                  placeholder="0.00"
                  value={swapAmount}
                  onChange={handleSwapAmountChange}
                  onKeyDown={handleKeyDown}
                  className="w-[180px] text-[24px] h-[40px] border-none outline-none ring-0 font-semibold text-end flex justify-end rounded bg-transparent text-white"
                />
                <span className="flex items-center justify-end space-x-2">

                {balanceError && (
              <p className="text-red-500 text-[12px]">
                Insufficient Balance
              </p>
            )}
                <button
                  onClick={clearInput}
                  className="text-accent text-[12px] text-end flex justify-end"
                >
                  clear
                </button>
                </span>
              </div>

                  </div>



            </div>


            <div className="w-full flex justify-center items-center relative">
              <div className="w-[32px] h-[32px] rounded-full border-[2px] border-gray-700 bg-btn4 flex items-center justify-center">
                <MdOutlineSwapVert size={24} className="text-black"/>
              </div>

            </div>

            <div className="flex flex-col mt-[-10px] space-y-[2px] bg-cards p-4 rounded-[8px]">

<div className="flex justify-between items-center">

<span className="text-secondary text-[12px]">
  To
</span>
</div>


            <div className="w-full flex justify-between items-center">
              <div className="flex cursor-pointer" onClick={() => setOpenAssetSelectionModal('to')}>
                {selectedAssetTo ? (
                  <div className="flex space-x-2">
                  <span className="flex items-center">
                  <img src={selectedAssetTo.icon} alt={selectedAssetTo.name} className="w-[28px] h-[28px] rounded-full" />
                  </span>
                  <span className="flex flex-col">
                  <span className="text-white text-[14px] font-medium flex items-center space-x-1">
                   <span> {selectedAssetTo.symbol} </span>
                   <IoMdArrowDropdown size={16} className="text-secondary"/>
                    </span>
                    <span className="text-secondary text-[11px]"> {selectedAssetTo.name}</span>
                  </span>
               
                </div>
                ) : (
                  <span className="text-white">Select asset to swap to</span>
                )}
              </div>
              <div className="flex flex-col space-y-1">

                {selectedAssetFrom && selectedAssetTo && (
                 <span className={`${calculatedSwapValue === 0.00 ? 'text-gray-400' : 'text-primary'} w-[100px] text-[24px] h-[40px] border-none outline-none ring-0 font-semibold text-end flex justify-end rounded`}>
                  {formatNumber(calculatedSwapValue)}
                  </span>
            
                )}
              </div>


              </div>


            </div>

            <div className="w-full flex justify-between items-center gap-2 px-2 pt-6">

<div className="w-[45%] h-[2px] bg-cards2"></div>
<span className="text-nowrap text-white text-[12px] flex items-center space-x-1">
  {selectedAssetFrom && selectedAssetTo && (
            <>
             <span>1 {selectedAssetFrom.symbol} </span> <PiApproximateEquals size={10} className="" /> <span>{formatNumber(selectedAssetFrom.price / selectedAssetTo.price)} {selectedAssetTo.symbol}</span>
            </>
          
          )}
          </span>
<div className="w-[45%] h-[2px] bg-cards2"></div>

</div>

          </div>


          
          <div className="w-full left-0 right-0 flex flex-col absolute bottom-[4%] space-y-3">
           
            <button
            id="previewButton"
              onClick={handleSwap}
              className={`${!swapAmount || balanceError ? 'bg-[#5A4420]' : 'bg-btn4'} text-[#000] py-[12px] px-4 rounded-[8px] font-medium`}
              disabled={!swapAmount || balanceError}
            >
              Preview Conversion
            </button>

            <button onClick={cancelSwap} className="bg-[#111111b3] text-white py-2 px-4 rounded">Cancel</button>
           
         
          </div>



        </div>
      </div>

      {/* Confirm Swap Modal */}
      <div
        className={`${openConfirmSwapModal ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 right-0 z-50 h-[100vh] bg-[#000000c5] flex justify-center items-end`}
      >
        <div className={`${openConfirmSwapModal ? "opacity-100 mb-0 ease-in duration-75" : "opacity-0 mb-[-100px]"} w-full max-w-md bg-[#1f1f1f] rounded-[24px] flex flex-col justify-center pb-16`}>

<div className="flex justify-between items-center border-b-[1px] border-cards px-5 pt-5 pb-5">
          <h3 className="font-medium text-left flex justify-start text-[15px] text-[#ffffff]">Confirm Conversion</h3>

          <button onClick={() => setOpenConfirmSwapModal(false)} className="bg-gray-700 text-white h-[26px] w-[26px] rounded-full flex justify-center items-center">
            
            <IoCloseSharp size={18} className="text-white"/>
            
            </button>
          
          
</div>


<div className="w-full flex flex-col px-5 pt-5">

<div className={`flex flex-col mb-[-10px]  space-y-[2px] bg-cards p-4 rounded-[8px]`}>

<div className="flex flex-col space-y-3">

  <span className="text-secondary text-[12px]">
    From
  </span>

  <div className="flex space-x-2">
                  <span className="flex items-center mt-[-2px]">
                  <img src={selectedAssetFrom.icon} alt={selectedAssetFrom.name} className="w-[20px] h-[20px] rounded-full" />
                  </span>
                 
                  <span className="text-white text-[14px] font-medium flex items-center">
                   <span> {formatNumber(swapAmount)} {selectedAssetFrom.symbol} </span>
                    </span>
      
               
                </div>


  </div>
  </div>

  <div className="w-full flex justify-center items-center relative">
              <div className="w-[32px] h-[32px] rounded-full border-[2px] border-black bg-[#5a5a5a] flex items-center justify-center">
                <PiArrowDownBold size={20} className="text-secondary"/>
              </div>

            </div>


<div className={`flex flex-col mt-[-10px]  space-y-[2px] bg-cards p-4 rounded-[8px]`}>

<div className="flex flex-col space-y-3">

  <span className="text-secondary text-[12px]">
    To
  </span>

  <div className="flex space-x-2">
                  <span className="flex items-center mt-[-2px]">
                  <img src={selectedAssetTo.icon} alt={selectedAssetTo.name} className="w-[20px] h-[20px] rounded-full" />
                  </span>
                 
                  <span className="text-white text-[14px] font-medium flex items-center">
                   <span> {formatNumber(calculatedSwapValue)} {selectedAssetTo.symbol} </span>
                    </span>
      
               
                </div>


  </div>
  </div>
</div>


          <div className="w-full flex flex-col space-y-1 px-6 pt-3">

            <div className="text-white text-[12px] flex items-center space-x-1">
             <span> 1 {selectedAssetFrom.symbol}</span> <PiApproximateEquals size={10} className="" /> <span>{formatNumber(selectedAssetFrom.price / selectedAssetTo.price)} {selectedAssetTo.symbol}</span>
            </div>
            <div className="text-white text-[12px]">
              Fee: {formatNumber(calculatedSwapValue * 0.005)} {selectedAssetTo.symbol}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
  
          <div className="w-full px-5">

   
            <button
            id="confirmButton"
              onClick={confirmSwap}
              className="bg-btn4 w-full text-white py-3 font-medium text-center flex justify-center items-center px-4 rounded-[8px]"
            >
              Confirm
            </button>

            </div>


          </div>
        </div>
      </div>

      {/* Swap Success Modal */}
      <div
        className={`${openSuccessModal ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 w-full right-0 z-50 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px]`}
      >
        <div className={`${openSuccessModal ? "opacity-100 mb-0 ease-in duration-300" : "opacity-0"} w-full h-full taskbg flex flex-col items-center pt-[30%] p-5 relative`}>



          <div className="bg-[#122a22] w-[80px] h-[80px] flex justify-center items-center rounded-full border-[6px] border-[#143f2e] text-[#1fb36c]">
          <IoMdCheckmark size={55} className=""/>
          </div>

          <h3 className="font-medium text-center text-[18px] pt-3 text-[#ffffff] pb-4">Conversion Completed!</h3>
          <p className="text-center text-[14px] leading-6">{formatNumber(calculatedSwapValue - (calculatedSwapValue * 0.005))} {selectedAssetTo.symbol} have been successfully deposited to your wallet. Kindly note that you can be able to withdraw balances after listing and launch.</p>
          <div className="mt-4 flex justify-center">


         
          
          <div className="w-full left-0 right-0 flex flex-col absolute bottom-[4%] space-y-3 px-5">
           
            <button
              onClick={closeSuccess}
              className={`bg-btn4 text-[#000] py-[12px] px-4 rounded-[8px] font-medium`}
            >
              Back to Assets
            </button>

          
         
          </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default SwapComponent