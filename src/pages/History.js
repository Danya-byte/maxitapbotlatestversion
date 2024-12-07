import React, { useEffect, useState } from 'react'
import Animate from '../Components/Animate'
import UserHistory from '../Components/UserHistory'
import { useNavigate } from "react-router-dom";

const History = () => {
    const location = useNavigate();
    const [backLo, setBackLo] = useState(true)

    useEffect(() => {

        // Attach a click event listener to handle the back navigation
        const handleBackButtonClick = () => {
            location('/wallet'); // Navigate to /home without refreshing the page
            setBackLo(false);
              }
    
          
        if (backLo) {
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
      }, [backLo, setBackLo, location]);

      


  return (
         
    <Animate>
         
         <div className='w-full flex justify-center flex-col space-y-2'>

     

            <div className='w-full justify-center flex items-center text-center'>
                <h1 className='font-medium'>
                    Assets History
                </h1>
            </div>

<UserHistory/>


       


         </div>
         </Animate>
  )
}

export default History