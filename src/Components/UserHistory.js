import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { LuFileSearch } from "react-icons/lu";


// const history = {
//     withdrawals: [
//       {
//         name: '',
//         date: new Date(),
//         amount: 0,
//         completed: false,
//       }
//     ],
//     deposits: [
//       {
//         name: '',
//         date: new Date(),
//         amount: 0,
//         completed: false,
//       }
//     ],
//     swaps: [
//       {
//         selectedAssetFromSymbol: 'SOL',
//         date: new Date(),
//         swapAmount: 142,
//         selectedAssetToSymbol: 'TON',
//         calculatedSwapValue: 3404.23,
//         completed: true,
        
//       },
//       {
//         selectedAssetFromSymbol: 'MAX',
//         date: new Date(),
//         swapAmount: 5000000,
//         selectedAssetToSymbol: 'TON',
//         calculatedSwapValue: 340334.23,
//         completed: true,
        
//       }
//     ],
//   }



const UserHistory = () => {
  const [selectedTab, setSelectedTab] = useState('withdrawals');
  const { withdrawals, deposits, swaps } = useUser();

  const formatDate = (dateInput) => {
    let date;
  
    // Check if dateInput is a Firestore Timestamp
    if (dateInput && dateInput.seconds) {
      date = new Date(dateInput.seconds * 1000); // Convert Firestore timestamp to JS Date object
    } else if (dateInput instanceof Date) {
      date = dateInput; // If it's already a JS Date object
    } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
      date = new Date(dateInput); // If it's an ISO string or a timestamp number
    } else {
      return 'Invalid Date'; // Return a placeholder if the dateInput is not valid
    }
  
    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    // Format the date as YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  

  const sortByDate = (array) => {
    return array.sort((a, b) => {
      const dateA = new Date(a.date.seconds ? a.date.seconds * 1000 : a.date).getTime();
      const dateB = new Date(b.date.seconds ? b.date.seconds * 1000 : b.date).getTime();
      return dateB - dateA; // Sort descending (most recent first)
    });
  };


  

  const renderWithdrawals = () => {
    if (withdrawals.length === 0) {
      return <div className="text-secondary text-[14px] text-center flex pt-6 flex-col items-center justify-center">

        <LuFileSearch size={60} className=''/>
        
        <span className='pt-2'>
            No records found
            </span>
        
        </div>;
    }

    const sortedWithdrawals = sortByDate(withdrawals);


    return (
        <div className="w-full flex flex-col space-y-3">
        {sortedWithdrawals.map((item, index) => (
            <>
                      <div key={index} className="w-full flex flex-col border-b-[1px] border-[#a4a4a423] pb-3">

<div className="text-[14px] font-medium text-white flex items-center justify-between pb-[2px]">
 <span> {item.name}</span>
 <span> <span className='text-red-500'>-{item.amount}</span> <span></span></span>
</div>


<div className="text-[12px] text-secondary flex items-center justify-between">
 <span> {formatDate(item.date)} </span>

 <span> {item.completed ? 'Completed' : 'Pending'}</span>
</div>

</div>
            </>
        ))}
      </div>
    );
  };

  const renderDeposits = () => {
    if (deposits.length === 0) {
      return <div className="text-secondary text-[14px] text-center flex pt-6 flex-col items-center justify-center">

      <LuFileSearch size={60} className=''/>
      
      <span className='pt-2'>
          No records found
          </span>
      
      </div>;
    }

    const sortedDeposits = sortByDate(deposits);

    return (
        <div className="w-full flex flex-col space-y-3 pt-2">
        {sortedDeposits.map((item, index) => (
            <>
                      <div key={index} className="w-full flex flex-col border-b-[1px] border-[#a4a4a423] pb-3">

<div className="text-[14px] font-medium text-white flex items-center justify-between pb-[2px]">
 <span> {item.name}</span>
 <span> <span className='text-green-500'>+{item.amount} TON</span> </span>
</div>


<div className="text-[12px] text-secondary flex items-center justify-between">
 <span> {formatDate(item.date)} </span>

 <span> {item.completed ? 'Completed' : 'Pending'}</span>
</div>

</div>
            </>
        ))}
      </div>
    );
  };

  const renderSwaps = () => {
    if (swaps.length === 0) {
      return <div className="text-secondary text-[14px] text-center flex pt-6 flex-col items-center justify-center">

      <LuFileSearch size={60} className=''/>
      
      <span className='pt-2'>
          No records found
          </span>
      
      </div>;
    }

    const sortedSwaps = sortByDate(swaps);

    return (
      <div className="w-full flex flex-col space-y-3">
        {sortedSwaps.map((item, index) => (
          <div key={index} className="w-full flex flex-col border-b-[1px] border-[#a4a4a423] pb-3">

            <div className="text-[12px] text-secondary flex items-center justify-between pb-3">
             <span> From</span>
             <span> To</span>
            </div>

            <div className="text-[14px] font-medium text-white flex items-center justify-between pb-[2px]">
             <span> {item.swapAmount} {item.selectedAssetFromSymbol}</span>
             <span> {(item.calculatedSwapValue).toFixed(6)} {item.selectedAssetToSymbol}</span>
            </div>


            <div className="text-[12px] text-secondary flex items-center justify-between">
             <span> {formatDate(item.date)} </span>

             <span> {item.completed ? 'Completed' : 'Pending'}</span>
            </div>

          </div>
        ))}
      </div>
    );
  };

  const renderData = () => {
    switch (selectedTab) {
      case 'withdrawals':
        return renderWithdrawals();
      case 'deposits':
        return renderDeposits();
      case 'swaps':
        return renderSwaps();
      default:
        return <div className="text-secondary text-[14px] text-center flex pt-6 flex-col items-center justify-center">

        <LuFileSearch size={60} className=''/>
        
        <span className='pt-2'>
            No records found
            </span>
        
        </div>;
    }
  };

  useEffect(() => {

    // console.log(history.swaps)

  },[])
  return (
    <div className="w-full flex flex-col">



      <div className="w-full flex items-center justify-between border-b-[1px] border-[#a4a4a423] px-5">
        <button
          className={`py-[10px] text-[13px] flex justify-start relative text-start font-medium w-[33%] transition-colors ${
            selectedTab === 'withdrawals'
              ? 'text-white after:absolute after:left-0 after:bottom-0 after:w-[85px] after:h-[3px] after:bg-btn4'
              : 'text-secondary'
          }`}
          onClick={() => setSelectedTab('withdrawals')}
        >
          Withdrawals
        </button>

        <button
          className={`py-[10px] text-[13px] font-medium w-[33%] relative flex justify-center transition-colors ${
            selectedTab === 'swaps'
              ? 'text-white after:absolute after:bottom-0 after:w-[45px] after:h-[3px] after:bg-btn4'
              : 'text-secondary'
          }`}
          onClick={() => setSelectedTab('swaps')}
        >
          Swaps
        </button>

        <button
          className={`py-[10px] text-[13px] flex justify-end text-end relative font-medium w-[33%] transition-colors ${
            selectedTab === 'deposits'
              ? 'text-white after:absolute after:right-0 after:bottom-0 after:w-[60px] after:h-[3px] after:bg-btn4'
              : 'text-secondary'
          }`}
          onClick={() => setSelectedTab('deposits')}
        >
          Deposits
        </button>
      </div>

      <div id="refer" className='w-full flex flex-col scroller h-[90vh] overflow-y-auto pb-[250px]'>
      <div className='w-full px-5 pt-4'>
        {renderData()}
        </div>
        </div>
    </div>
  );
};

export default UserHistory;