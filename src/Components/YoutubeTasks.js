import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { useUser } from "../context/userContext";
import { IoCheckmarkCircleSharp, IoCheckmarkCircle, IoClose } from 'react-icons/io5';
import { CiNoWaitingSign } from 'react-icons/ci';

// const youtubeTasks = [
//     {
//         title: 'Watch youtube video',
//         description: 'Watch this video about generating income through cryptocurrency',
//         link: 'https://t.me/plutotapofficials',
//         icon: '/youtube2.svg',
//         thumb: '/thumb2.webp',
//         id: 1,
//         bonus: 100000,
//     }
// ];

const YouTubeTasks = () => {
    const [showVerifyButtons, setShowVerifyButtons] = useState({});
    const [countdowns, setCountdowns] = useState({});
    const [buttonText, setButtonText] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [claiming, setClaiming] = useState({});
    const [submittedYt, setSubmittedYt] = useState({});
    const { id: userId, youtubeTasks, userYoutubeTasks, setUserYoutubeTasks, setBalance } = useUser();
    const [claimedBonus, setClaimedBonus] = useState(0);
    const [congrats, setCongrats] = useState(false);
    const [openTask, setOpenTask] = useState(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        const handleBackButtonClick = () => {
            setOpenTask(false);
        };

        if (openTask) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
        } else {
            window.Telegram.WebApp.BackButton.hide();
            window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        }

        return () => {
            window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        };
    }, [openTask]);

    const performTask = (taskId) => {
        const task = youtubeTasks.find(task => task.id === taskId);
        if (task) {
            window.open(task.link, '_blank');
            setTimeout(() => {
                setShowVerifyButtons(prevState => ({ ...prevState, [taskId]: true }));
            }, 120000);
            setTimeout(() => {
                setActive(true)
            }, 2000);
        }
    };

    const startCountdown = (taskId) => {
        setCountdowns(prevState => ({ ...prevState, [taskId]: 5 }));
        setButtonText(prevState => ({ ...prevState, [taskId]: 'Verifying' }));

        const countdownInterval = setInterval(() => {
            setCountdowns(prevCountdowns => {
                const newCountdown = prevCountdowns[taskId] - 1;
                if (newCountdown <= 0) {
                    clearInterval(countdownInterval);
                    setCountdowns(prevState => ({ ...prevState, [taskId]: null }));
                    setButtonText(prevState => ({ ...prevState, [taskId]: 'Verifying' }));

                    const saveTaskToUser = async () => {
                        try {
                            const userDocRef = doc(db, 'telegramUsers', userId);
                            const updatedUserYoutubeTasks = [...userYoutubeTasks, { taskId: taskId, completed: false }];
                            await updateDoc(userDocRef, {
                                youtubeTasks: arrayUnion({ taskId: taskId, completed: false })
                            });
                            setUserYoutubeTasks(updatedUserYoutubeTasks); // Update state to reflect the saved task
                            console.log(`Task ${taskId} added to user's youtubeTasks collection`);
                        } catch (error) {
                            console.error("Error adding task to user's document: ", error);
                        }
                    };

                    saveTaskToUser();

                    setSubmittedYt(prevState => ({ ...prevState, [taskId]: true }));
                    localStorage.setItem(`submittedYt_${taskId}`, true);

                    return { ...prevCountdowns, [taskId]: null };
                }
                return { ...prevCountdowns, [taskId]: newCountdown };
            });
        }, 1000);
    };
    const claimTask = async (taskId) => {
        setClaiming(prevState => ({ ...prevState, [taskId]: true }));
        try {
            const task = youtubeTasks.find(task => task.id === taskId);
            const userDocRef = doc(db, 'telegramUsers', userId);
            await updateDoc(userDocRef, {
                youtubeTasks: userYoutubeTasks.map(task =>
                    task.taskId === taskId ? { ...task, completed: true } : task
                ),
                balance: increment(task.bonus)
            });
            setBalance(prevBalance => prevBalance + task.bonus);
            console.log(`Task ${taskId} marked as completed`);
            setUserYoutubeTasks(prevTasks =>
                prevTasks.map(task =>
                    task.taskId === taskId ? { ...task, completed: true } : task
                )
            );

            setModalMessage(
                <>
                <div className="w-full flex justify-center flex-col items-center space-y-3">
                    <div className="w-full items-center justify-center flex flex-col space-y-2">
                        <IoCheckmarkCircleSharp size={32} className="text-btn4" />
                        <p className='font-medium text-center'>Let's go!!</p>
                    </div>
                    <h3 className="font-medium text-[20px] text-[#ffffff] pt-2 pb-2">
                        <span className="text-btn4">+{formatNumber(task.bonus)}</span> NGT CLAIMED
                    </h3>
                    <p className="pb-6 text-[15px] w-full text-center">
                        Keep performing new tasks! something huge is coming! Perform more and earn more NGT now! 
                    </p>
                </div>
                <div className="w-full flex justify-center">
            <button
              onClick={closeModal}
              className={`bg-btn4 text-[#000]  w-full py-3 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[16px]`}
            >
              Continue tasks
            </button>
          </div>
                </>
            );
            setModalOpen(true);
            setClaimedBonus(task.bonus);
            setCongrats(true);

            setTimeout(() => {
                setCongrats(false);
            }, 4000);
        } catch (error) {
            console.error("Error updating task status to completed: ", error);
        }
        setClaiming(prevState => ({ ...prevState, [taskId]: false }));
    };

    const closeModal = () => {
        setModalOpen(false);
        setOpenTask(false);
    };

    const closeModal2 = () => {
        setModalOpen(false);
        setActive(false);
    };

    useEffect(() => {
        const submittedStatesYt = youtubeTasks.reduce((acc, task) => {
            const submittedStateYt = localStorage.getItem(`submittedYt_${task.id}`) === 'true';
            acc[task.id] = submittedStateYt;
            return acc;
        }, {});
        setSubmittedYt(submittedStatesYt);
        // eslint-disable-next-line
    }, []);

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
        <>
            {youtubeTasks
                .sort((a, b) => a.id - b.id)
                .map(task => {
                    const userTask = userYoutubeTasks.find(t => t.taskId === task.id);
                    const isTaskCompleted = userTask ? userTask.completed : false;
                    return (
                        <div key={task.id} onClick={() => setOpenTask(task)} className="w-full rounded-[16px] bg-cards p-4 pl-3 flex items-start space-x-2">
                            <div className='flex items-center justify-center'>
                                <img alt="engy" src={task.icon} className='w-[40px]' />
                            </div>
                            <div className="flex h-full w-full flex-col justify-center relative">
                                <div className='flex w-full flex-col justify-between h-full space-y-1'>
                                    <h1 className="text-[15px] text-nowrap line-clamp-1 mr-[5px] font-medium">
                                        {task.title}
                                    </h1>
                                    <span className='flex text-primary items-center w-fit space-x-1 text-[14px] font-semibold'>
                                        <span className="w-[10px] h-[10px] bg-btn4 rounded-full flex items-center" />
                                        <span className=''>
                                            +{formatNumber(task.bonus)}
                                        </span>
                                    </span>
                                    <div className='w-full flex items-center justify-between flex-wrap text-[14px] relative'>
                                        {isTaskCompleted ? (
                                            <>
                                                <span className="w-fit py-[6px] px-4 font-medium bg-[#494949] text-[#b8b8b8] rounded-[6px]">Completed</span>
                                                <span className='mr-[6px]'>
                                                    <IoCheckmarkCircleSharp size={24} className="text-btn4" />
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setOpenTask(task)}
                                                    className="w-fit py-[6px] px-4 font-medium bg-[#8f8f8f85] hover:bg-[#8a8a8a] text-[#fff] hover:text-[#000] ease-in duration-200 rounded-[6px]"
                                                >
                                                    Perform
                                                </button>
                                                <button
                                                    onClick={() => setOpenTask(task)}
                                                    className="w-fit py-[6px] px-4 font-medium bg-btn2 text-[#888] ease-in duration-200 rounded-[6px]"
                                                >
                                                    Pending
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            {openTask && (
                <TaskModal
                    task={openTask}
                    onClose={() => setOpenTask(null)}
                    performTask={performTask}
                    startCountdown={startCountdown}
                    claimTask={claimTask}
                    active={active}
                    setActive={setActive}
                    showVerifyButtons={showVerifyButtons}
                    countdowns={countdowns}
                    buttonText={buttonText}
                    submittedYt={submittedYt}
                    claiming={claiming}
                    userYoutubeTasks={userYoutubeTasks}
                    modalMessage={modalMessage}
                    setModalMessage={setModalMessage}
                    setModalOpen={setModalOpen}
                    modalOpen={modalOpen}
                    closeModal={closeModal}
                    closeModal2={closeModal2}
                    congrats='/congrats.gif'
                    claimedBonus={claimedBonus}
                />
            )}
            <div className='w-full absolute top-[50px] left-0 right-0 flex justify-center z-[60] pointer-events-none select-none'>
                {congrats ? (<img src='/celebrate.gif' alt="congrats" className="w-[80%]" />) : (<></>)}
            </div>
            <div
                className={`${modalOpen ? "visible" : "invisible"} fixed top-[-12px] bottom-0 left-0 z-50 right-0 h-[100vh] bg-[#00000042] flex justify-center items-center backdrop-blur-[6px] px-4`}
            >
                <div className={`${modalOpen ? "opacity-100 mt-0 ease-in duration-300" : "opacity-0 mt-[100px]"} w-full bg-modal relative rounded-[16px] flex flex-col justify-center p-8`}>
                    {modalMessage}
                </div>
            </div>
        </>
    );
};

const TaskModal = ({
    task,
    onClose,
    performTask,
    startCountdown,
    claimTask,
    showVerifyButtons,
    countdowns,
    buttonText,
    submittedYt,
    claiming,
    userYoutubeTasks,
    active,
    setActive,
    modalMessage,
    modalOpen,
    closeModal,
    setModalMessage,
    setModalOpen,
    closeModal2,
    congrats,
    claimedBonus
}) => {
    const isTaskSaved = !!userYoutubeTasks.find(t => t.taskId === task.id);
    const isTaskCompleted = isTaskSaved && userYoutubeTasks.find(t => t.taskId === task.id).completed;
    const formatNumber = (num) => {
        if (num < 100000) {
            return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else if (num < 1000000) {
            return new Intl.NumberFormat().format(num).replace(/,/g, " ");
        } else {
            return (num / 1000000).toFixed(3).replace(".", ".") + " M";
        }
    };

    const notVerified = () => {

        setModalOpen(true)
        setModalMessage(
            <>
            <div className="w-full flex justify-center flex-col items-center space-y-3">
                <div className="w-full items-center justify-center flex flex-col space-y-2">
                    <CiNoWaitingSign size={32} className="text-btn4" />
                    <p className='font-medium text-center'>You have not watched this video completely yet!</p>
                </div>
                <p className="pb-6 text-[#9a96a6] text-[15px] w-full text-center">
                   Click on the watch video button and ensure you watch the video completely before you come back to claim your reward.
                </p>
            </div>

            <div className="w-full flex justify-center">
<button
  onClick={closeModal2}
  className={`bg-btn4 text-[#000]  w-full py-3 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[16px]`}
>
  Okay, Understood!
</button>
</div>
            </>
        );
    }

    return (
        <div className="fixed z-50 left-0 right-0 top-[-12px] bottom-0 flex justify-center taskbg px-[16px]">
            <div className="w-full flex flex-col items-center justify-start pt-5">
                <div className="flex w-full flex-col">

                    <div className='w-full flex justify-end pt-4 pb-8'>
                    <button
  onClick={onClose}
   className="flex items-center justify-center h-[32px] w-[32px] rounded-full bg-[#383838] absolute right-6 top-4 text-center font-medium text-[16px]"
            >
             <IoClose size={20} className="text-[#9995a4]"/>
            </button>

                    </div>

                    <h1 className="text-[20px] font-semibold w-full text-center">{task.title}</h1>
                    <p className="text-secondary text-[15px] font-medium pt-1 pb-4 w-full text-center">
                        {task.description}
                    </p>
                    <div className="bg-cards rounded-[10px] p-[14px] flex items-center justify-between mb-3">
                        <div className='flex flex-1 items-center space-x-1'>
                            <div className="">
                                <img src="/coin.webp" className="w-[16px]" alt="Coin Icon" />
                            </div>
                            <div className="flex items-center space-x-1">
                                <span className="font-semibold text-secondary">Reward:</span>
                                <span className="font-semibold">+{formatNumber(task.bonus)}</span>
                            </div>
                        </div>
                        {isTaskSaved || isTaskCompleted ? (
                            <span className="text-center text-[14px] font-semibold text-[#49ee49] flex items-center space-x-1">
                                <span className=''>
                                    Done</span>
                                <IoCheckmarkCircle size={20} className='' />
                            </span>
                        ) : (
                            <span className="w-[14px] h-[14px] animate-pulse bg-btn4 rounded-full flex items-center" />
                        )}
                    </div>
                    <div className="bg-cards rounded-[10px] p-[14px] flex flex-col space-y-2 justify-center items-center">
                        <div className="flex justify-center items-center relative">
                            <img onClick={() => performTask(task.id)} src={task.thumb} alt='thumb' className='w-full aspect-video rounded-[8px]' />
                            <img onClick={() => performTask(task.id)} src='/youtube.svg' alt='rfcdsv' className='absolute w-[60px]' />
                        </div>
                      
                            <button
                                onClick={() => performTask(task.id)}
                                className="w-full py-[10px] px-4 font-medium bg-[#8f8f8f85] hover:bg-[#8a8a8a] text-[#fff] hover:text-[#000] ease-in duration-200 rounded-[6px]"
                            >
                                Watch video
                            </button>
                    


{isTaskSaved || isTaskCompleted ? (
                             <span className="w-full py-[10px] px-4 font-medium bg-[#8f8f8f85] text-center text-[#7cf47c] ease-in duration-200 rounded-[6px]">
                                Done</span>
                        ) : (
                            <>
                            </>
                        )}


                        <div className='w-full flex flex-col space-y-2 items-center justify-center'>
                            <div className='w-full flex items-center text-[14px] justify-center relative mt-1 mb-4'>
                                
                                
                                
                            {!showVerifyButtons[task.id] ? (
                                <button
                               onClick={notVerified}
                               disabled={!active}
                                className={`${active ? 'bg-btn4 text-[#000]' : 'bg-btn2 text-[#888]'} w-full py-3 px-4 font-semibold rounded-[6px] text-[17px]`}
                            >
                               Verify
                            </button>

                            ) : (
<>
                    {!isTaskSaved && !isTaskCompleted && (
                        <>
                            {countdowns[task.id] === undefined && (
                                <button
                                    onClick={() => startCountdown(task.id)}
                                    className={`${submittedYt[task.id] ? "bg-btn4 text-[#000]" : buttonText[task.id] || "bg-btn4 text-[#000]"} ${!showVerifyButtons[task.id] ? "!bg-btn2 !text-[#888]" : "bg-btn3 text-[#000]"} w-full py-3 px-4 font-semibold rounded-[6px] text-[17px]`}
                                    disabled={!showVerifyButtons[task.id]}
                                >
                                    {submittedYt[task.id] ? 'Verify' : 'Verify'}
                                </button>
                            )}
                        </>
                    )}
</>
                            )}



                                {countdowns[task.id] !== null && countdowns[task.id] !== undefined && (
                                    <span className="w-full py-3 px-4 font-medium text-center rounded-[6px] bg-btn2 text-[#fff]">
                                        checking {countdowns[task.id]}s
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => claimTask(task.id)}
                                className={`${isTaskSaved && !isTaskCompleted ? 'bg-btn4 text-[#000]' : 'bg-btn2 text-[#888]'} w-full py-4 px-3 mt-6 flex items-center rounded-[12px] justify-center text-center text-[18px] font-semibold`}
                                disabled={claiming[task.id] || !isTaskSaved || isTaskCompleted}
                            >
                              {!isTaskCompleted ? 'Finish Task' : 'Task Completed'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeTasks;
