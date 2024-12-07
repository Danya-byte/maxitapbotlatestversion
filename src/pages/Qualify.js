import React, { useEffect, useState } from 'react'
import Animate from '../Components/Animate'
import { useUser } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const Qualify = () => {
    const {balance, refBonus, purchasedCards, profitHour} = useUser()

    const locations = useNavigate();
    const [backLos, setBackLos] = useState(true)

    useEffect(() => {

        // Attach a click event listener to handle the back navigation
        const handleBackButtonClick = () => {
            locations('/wallet'); // Navigate to /home without refreshing the page
            setBackLos(false);
              }
    
          
        if (backLos) {
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
      }, [backLos, setBackLos, locations]);

      

    const formatNumber = (num) => {
        if (num < 100000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 1000000) {
          return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else {
          return (num / 1000000).toFixed(3).replace(".", ".") + " M";
        }
      };

      const qualifications = [
        {
            title: "Tasks & activities earn",
            totalBalance: balance,
            icon: '/coin.webp',
            id: 1,
        },
        {
            title: "Referral activities earn",
            totalBalance: refBonus,
            icon: '/frens2.webp',
            id: 2,
        },
        {
            title: "Mining profits per hour",
            totalBalance: profitHour,
            icon: '/mine.webp',
            id: 3,
        },
        {
            title: "Special cards purchased",
            totalBalance: purchasedCards.length,
            icon: '/hunter.webp',
            id: 4,
        },
      ]

  return (
    <Animate>


    <div className='w-full flex justify-center items-center flex-col space-y-3'>


<div className='w-full flex items-center justify-center py-8'>
    <img alt="daxy" src="/maxitap.webp" 
            className="w-[160px] h-[160px] animate-spin spinso"
            />
</div>


      <div className='w-full relative h-screen bg-divider shadowtop rounded-tl-[40px] rounded-tr-[40px]'>
        <div className='w-full h-screen homescreen rounded-tl-[40px] rounded-tr-[40px] mt-[2px] px-5'>

        <div id="refer" className='w-full flex flex-col scroller h-[70vh] overflow-y-auto pb-[250px]'>
{/*  */}

<div className='w-full flex flex-col text-center justify-center items-center pt-6'>
    <h1 className='font-semibold text-[20px]'>
        Airdrop Qualifiers
    </h1>

    <p className='text-[14px] text-[#c6c6c6] leading-[24px] px-3 pb-8'>
            Listing and launching soon, all activities are important for qualification!
            </p>


</div>


<div className='w-full flex flex-col space-y-[10px]'>

{qualifications.map((data, index) => (

<div key={index} className="w-full bg-cards text-[14px] rounded-[6px] px-4 py-4 space-x-2 flex items-center justify-between">
                  <span className="flex items-center justify-center mt-[1px]">
                    <img src={data.icon} alt={data.title} className={`${data.id === 3 ? 'brightness-[100]' : ''} w-[34px] h-[34px] rounded-full`} />
                  </span>
                  <div className="flex flex-1 flex-col">
                    <div className="flex w-full justify-between items-center font-medium">
                      <h4 className="">
                       {data.title}
                      </h4>
                      <span className="">
                      {data.totalBalance <= 0 ? (
                        <span className='text-secondary'>{formatNumber(data.totalBalance)}</span>
                      ) : (
                        <span className='text-accent font-semibold'>
                        +{formatNumber(data.totalBalance)}
                        </span>
                      )}
                      
                      
                      </span>
                    </div>
                    <div className="flex w-full justify-between items-center text-secondary">
                      {/* <h4 className="text-[11px]">{balance}</h4> */}
                      {/* <span className="text-[12px]">${formatNumber(data.balance * data.price)}</span> */}
                    </div>
                  </div>
                </div>

))}
</div>



</div>

</div>

      </div>
    </div>
    </Animate>
  )
}

export default Qualify