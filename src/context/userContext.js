import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firestore'; // Adjust the path as needed
import { useLocation } from 'react-router-dom';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);


const userLevelss = [
  { id: 1, name: 'Bronze', icon: '/bronze.webp', tapBalanceRequired: 1000 },
  { id: 2, name: 'Silver', icon: '/silver.webp', tapBalanceRequired: 50000 },
  { id: 3, name: 'Gold', icon: '/gold.webp', tapBalanceRequired: 500000 },
  { id: 4, name: 'Platinum', icon: '/platinum.webp', tapBalanceRequired: 1000000 },
  { id: 5, name: 'Diamond', icon: '/diamond.webp', tapBalanceRequired: 2500000 },
  { id: 6, name: 'Master', icon: '/master.webp', tapBalanceRequired: 5000000 },
];


const prTeam = [
  {
    title: 'Patience',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 21000 },
    ],
    totalProfit: 0,
    icon: '/patience.webp',
    description: 'Develop the patience needed to navigate volatile markets, making informed decisions that lead to long-term trading success.'
  },
  {
    title: 'Discipline',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 100000 },
    ],
    totalProfit: 0,
    icon: '/discipline.webp',
    description: 'Cultivate the discipline to stick to your trading strategy, minimizing risks and maximizing consistent returns over time.'

  },
  {
    title: 'Adaptability',
    level: [
      { level: 1, profit: 240, cost: 2000 },
      { level: 2, profit: 480, cost: 10000 },
      { level: 3, profit: 960, cost: 100000 },
      { level: 4, profit: 1264, cost: 400000 },
    ],
    totalProfit: 0,
    icon: '/adaptability.webp',
     description: 'Enhance your ability to adapt to market changes, ensuring your trading strategy remains effective in fluctuating conditions.'
  },
  {
    title: 'Awareness',
    level: [
      { level: 1, profit: 70, cost: 750 },
      { level: 2, profit: 140, cost: 1400 },
      { level: 3, profit: 280, cost: 6600 },
      { level: 4, profit: 560, cost: 10000 },
    ],
    totalProfit: 0,
    icon: '/awareness.webp',
     description: 'Increase your market awareness, enabling you to anticipate trends and make informed trading decisions with confidence.'
  },
  {
    title: 'Technical Analysis',
    level: [
      { level: 1, profit: 75, cost: 550 },
      { level: 2, profit: 140, cost: 1000 },
      { level: 3, profit: 200, cost: 4000 },
      { level: 4, profit: 400, cost: 8000 },
    ],
    totalProfit: 0,
    icon: '/analysis.webp',
     description: 'Master technical analysis to predict market movements and make data-driven trading decisions with greater precision.'
  },
  {
    title: 'Networking',
    level: [
      { level: 1, profit: 90, cost: 1000 },
      { level: 2, profit: 180, cost: 4000 },
      { level: 3, profit: 360, cost: 12000 },
      { level: 4, profit: 720, cost: 24000 },
    ],
    totalProfit: 0,
    icon: '/networking.webp',
     description: 'Build a strong network within the crypto community, gaining insights and opportunities to enhance your trading performance.'
  },
]
const marketTeam = [
  {
    title: 'Leadership',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 21000 },
    ],
    totalProfit: 0,
    icon: '/leadership.webp',
    description: 'Guide your team in the crypto space, making strategic decisions that drive growth and secure exclusive market advantages.'
  },
  {
    title: 'Communication',
    level: [
      { level: 1, profit: 100, cost: 1000 },
      { level: 2, profit: 200, cost: 5000 },
      { level: 3, profit: 300, cost: 20000 },
      { level: 4, profit: 400, cost: 100000 },
    ],
    totalProfit: 0,
    icon: '/communication.webp',
    description: 'Master communication to effectively negotiate crypto trades, ensuring clarity and success in high-stakes market transactions.'

  },
  {
    title: 'Negotiation',
    level: [
      { level: 1, profit: 240, cost: 2000 },
      { level: 2, profit: 480, cost: 10000 },
      { level: 3, profit: 960, cost: 100000 },
      { level: 4, profit: 1264, cost: 400000 },
    ],
    totalProfit: 0,
    icon: '/negotiation.webp',
     description: 'Sharpen your negotiation skills to secure favorable trading terms and maximize profits in competitive cryptocurrency markets.'
  },
  {
    title: 'Financial management',
    level: [
      { level: 1, profit: 70, cost: 750 },
      { level: 2, profit: 140, cost: 1400 },
      { level: 3, profit: 280, cost: 6600 },
      { level: 4, profit: 560, cost: 10000 },
    ],
    totalProfit: 0,
    icon: '/finance.webp',
     description: 'Optimize your portfolio by managing assets effectively, ensuring sustainable growth in the volatile cryptocurrency landscape.'
  },
  {
    title: 'Risk management',
    level: [
      { level: 1, profit: 75, cost: 550 },
      { level: 2, profit: 140, cost: 1000 },
      { level: 3, profit: 200, cost: 4000 },
      { level: 4, profit: 400, cost: 8000 },
    ],
    totalProfit: 0,
    icon: '/risks.webp',
     description: 'Develop strategies to mitigate risks, protecting your investments while navigating the unpredictable crypto market.'
  },
  {
    title: 'Strategic planning',
    level: [
      { level: 1, profit: 90, cost: 1000 },
      { level: 2, profit: 180, cost: 4000 },
      { level: 3, profit: 360, cost: 12000 },
      { level: 4, profit: 720, cost: 24000 },
    ],
    totalProfit: 0,
    icon: '/planning.webp',
     description: 'Craft and execute plans that capitalize on market opportunities, positioning your assets for long-term success.'
  },
]


const specialCards = [
  {
    title: 'Airdrop Hunter',
    profit: 10,
    cost: '500000000',
    icon: '/hunter.webp',
    tagline: 'Withdrawal access',
    description: 'This is a special card that gives you special access benefits to some of the wallet features on Maxitap',
    class: 'specials1',
  },
  {
    title: 'Early Access',
    profit: 5,
    cost: '100000000',
    icon: '/access.webp',
    tagline: 'Withdrawal access',
    description: 'With this special card you will stand high airdrop qualification chances and be among early token holders.',
    class: 'specials2',
  },
  {
    title: 'Balance Booster',
    profit: 50,
    cost: '1000000000',
    icon: '/booster.webp',
    tagline: 'Get more tokens',
    description: 'Get special access to boost your total balance in the boosters section, never a dull moment!',
    class: 'specials3',
  },
  {
    title: 'Token Swap Access',
    profit: 5,
    cost: '200000000',
    icon: '/swap.webp',
    tagline: 'Swap tokens special',
    description: 'This special card gives you access to token swap and withdrawal features in your wallet section.',
    class: 'specials4',
  },
]



// const specialCards = [
//   {
//     title: 'Airdrop Hunter',
//     profit: 10,
//     cost: 0.5,
//     icon: '/hunter.webp',
//     description: 'Withdrawal access',
//     class: 'specials1',
//   },
//   {
//     title: 'Early Access',
//     profit: 5,
//     cost: 0.2,
//     icon: '/access.webp',
//     description: 'Airdrop special',
//     class: 'specials2',
//   },
//   {
//     title: 'Balance Booster',
//     profit: 50,
//     cost: 1,
//     icon: '/booster.webp',
//     description: 'Get more tokens',
//     class: 'specials3',
//   },
//   {
//     title: 'Token Swap Access',
//     profit: 5,
//     cost: 0.2,
//     icon: '/swap.webp',
//     description: 'Swap tokens special',
//     class: 'specials4',
//   },

// ]




// const history = {
//     withdrawals: [],
//     deposits: [],
//     swaps: [],
//   }




export const UserProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [tapBalance, setTapBalance] = useState(0);
  const [level, setLevel] = useState({ id: 1, name: "Bronze", imgUrl: "/bronze.webp" });
  const [tapValue, setTapValue] = useState({level: 1, value: 1});
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [energy, setEnergy] = useState(0);
  const [battery, setBattery] = useState({level: 1, energy: 500});
  const [initialized, setInitialized] = useState(false);
  const [refBonus, setRefBonus] = useState(0);
  const [manualTasks, setManualTasks] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [userManualTasks, setUserManualTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [claimedMilestones, setClaimedMilestones] = useState([]);
  const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState({id: 'selectex', icon: '/exchange.svg', name: 'Select exchange'});
  const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
  const [tapGuru, setTapGuru] = useState(false);
  const [mainTap, setMainTap] = useState(true);
  const [freeGuru, setFreeGuru] = useState(3);
  const [time, setTime] = useState(22);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [lastTime, setLastTime] = useState(null);
  const [claimExchangePoint, setClaimExchangePoint] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState({name: '', avatar: ''});
  const [characterMenu, setCharacterMenu] = useState(false)
  const [fullName, setFullName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isAddressSaved, setIsAddressSaved] = useState(false); // State to track if address is saved
  const [coolDownTime, setCoolDownTime] = useState(0);
  const [tappingGuru, setTappingGuru] = useState(0);
  const location = useLocation();
  const [openInfoTwo, setOpenInfoTwo] = useState(true);
  const [openInfoThree, setOpenInfoThree] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [checkInDays, setCheckInDays] = useState([]);
  const [error, setError] = useState(null);
  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [userLevels, setUserLevels] = useState(prTeam.map(() => 0)); // Start at level 0
  const [userLevelsMarket, setUserLevelsMarket] = useState(marketTeam.map(() => 0)); // Start at level 0
  const [totalProfit, setTotalProfit] = useState([0,0,0,0,0,0]);
  const [totalMarketProfit, setTotalMarketProfit] = useState([0,0,0,0,0,0]);
  const [success, setSuccess] = useState(false);
  const [profitHour, setProfitHour] = useState(0);
  const [purchasedCards, setPurchasedCards] = useState([]);
  const [totalCardsProfits, setTotalCardsProfits] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [youtubeTasks, setYoutubeTasks] = useState([]);
  const [userYoutubeTasks, setUserYoutubeTasks] = useState([]);

  const assets = [
    {symbol: 'MAX', name: 'Maxicoin', balance: balance, icon: '/maxitap.webp',price: 0.0004348},
    {symbol: 'USDT', name: 'Tether US', balance: 0, icon: '/tether.webp', price: 1},
    {symbol: 'TON', name: 'Toncoin', balance: 0, icon: '/ton.png', price: 6.68},
    {symbol: 'NOT', name: 'Notcoin', balance: 0, icon: '/notcoin.jpg', price: 0.01075},
    {symbol: 'BNB', name: 'BNB', balance: 0, icon: '/bnb2.webp', price: 562.36},
    {symbol: 'SOL', name: 'Solana', balance: 0, icon: '/solana.png', price: 143.34}
  ]

  const spinnerLimit = 10;

  const [walletAssets, setWalletAssets] = useState(assets)
  
  const [spinLimit, setSpinLimit] = useState(spinnerLimit); // New state for spin limit
  
  useEffect(() => {
    let timerId;
    if (isTimerRunning && time > 0) {
      timerId = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setTapGuru(false);
      setMainTap(true);
    }
    return () => clearInterval(timerId);
  }, [isTimerRunning, time]);

  const startTimer = useCallback(() => {
    setTime(22);
    setTapGuru(true);
    setIsTimerRunning(true);
  }, []);




  

  const fetchData = async (userId) => {
    if (!userId) return;
    try {
      const userRef = doc(db, 'telegramUsers', userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setBalance(userData.balance);
        setTapBalance(userData.tapBalance);
        setTapValue(userData.tapValue);
        setClaimedMilestones(userData.claimedMilestones || []);
        setClaimedReferralRewards(userData.claimedReferralRewards || []);
        setSelectedExchange(userData.selectedExchange);
        setSelectedCharacter(userData.character)
        setLastCheckIn(userData.lastCheckIn?.toDate() || null);
        setCheckInDays(userData.checkInDays || []);
        const data = userDoc.data().history || {};
        setWithdrawals(data.withdrawals || []);
        setDeposits(data.deposits || []);
        setSwaps(data.swaps || []);
        setFreeGuru(userData.freeGuru);
        setProfitHour(userData.profitHour || 0);
        setUserYoutubeTasks(userData.youtubeTasks || []);
        setWalletAddress(userData.address)
        setShowBalance(userData.showBalance)
        setIsAddressSaved(userData.isAddressSaved)
        setWalletAssets(userData.walletAssets || assets)
        setPurchasedCards(userData.specialCards || []);
        setEnergy(userData.energy);
         // Calculate total profits
         const total = purchasedCards.reduce((acc, card) => acc + card.profit, 0);
         setTotalCardsProfits(total);
        setFullName(userData.fullName);
        const span = userDoc.data().spinLimit ?? 10;
        setSpinLimit(span);
        setBattery(userData.battery);
        setLevel(userData.level);
        setId(userData.userId);
        setRefBonus(userData.refBonus || 0);
        setCompletedTasks(userData.tasksCompleted || []);
        setUserManualTasks(userData.manualTasks || []);
        setReferrals(userData.referrals || []);
        await updateActiveTime(userRef)

      }

      const tasksQuerySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);

      const manualTasksQuerySnapshot = await getDocs(collection(db, 'manualTasks'));
      const manualTasksData = manualTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setManualTasks(manualTasksData);

      // Fetch youtubeTasks
      const youtubeTasksQuerySnapshot = await getDocs(collection(db, 'youtubeTasks'));
      const youtubeTasksData = youtubeTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setYoutubeTasks(youtubeTasksData);


    // Fetch settings data
    const settingsDocRef = doc(db, 'settings', '1q01CYx0LFmgLR4wiUxX'); // Replace with your actual document ID
    const settingsDocSnap = await getDoc(settingsDocRef);

    if (settingsDocSnap.exists()) {
      const settingsData = settingsDocSnap.data();
      setCoolDownTime(settingsData.coolDownTime);
      setTappingGuru(settingsData.tappingGuru);
    }

    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const sendUserData = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    let referrerId = queryParams.get("ref");
    if (referrerId) {
      referrerId = referrerId.replace(/\D/g, "");
    }

    if (telegramUser) {
      const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;
      const finalUsername = username || `${firstName}_${userId}`;
      const fullNamed = `${firstName} ${lastName}`

      try {
        const userRef = doc(db, 'telegramUsers', userId.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          fetchData(userId.toString());
          await updateEnergy(userRef, userDoc.data().battery.energy);
          await updateReferrals(userRef);
          setInitialized(true);
          return;
        }

        const userData = {
          userId: userId.toString(),
          username: finalUsername,
          firstName: firstName,
          lastName: lastName,
          fullName: fullNamed,
          totalBalance: 0,
          showBalance: true,
          profitHour: 0,
          spinLimit: 10,
          isAddressSaved: false,
          address: '',
          balance: 0,
          tapBalance: 0,
          lastActive: new Date(),
          character: {name: '', avatar: '/user.webp'},
          freeGuru: 3,
          tapValue: {level: 1, value: 1},
          level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
          selectedExchange: {id: 'selectex', icon: '/exchange.svg', name: 'Choose exchange'},
          energy: 500,
          battery: {level: 1, energy: 500},
          refereeId: referrerId || null,
          referrals: []
        };

        await setDoc(userRef, userData);
        setEnergy(500);
        setFreeGuru(userData.freeGuru);
        setSelectedCharacter(userData.character)
        setFullName(fullNamed)
        setCharacterMenu(true);
        setSelectedExchange({id: 'selectex', name: 'Choose exchange', icon: '/exchange.svg'});
        setId(userId.toString());

        if (referrerId) {
          const referrerRef = doc(db, 'telegramUsers', referrerId);
          const referrerDoc = await getDoc(referrerRef);
          if (referrerDoc.exists()) {
            await updateDoc(referrerRef, {
              referrals: arrayUnion({
                userId: userId.toString(),
                username: finalUsername,
                balance: 0,
                level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
              })
            });
          }
        }
        setInitialized(true);
        fetchData(userId.toString());
      } catch (error) {
        console.error('Error saving user in Firestore:', error);
      }
    }
  };

  const updateEnergy = async (userRef, batteryValue) => {
    const savedEndTime = localStorage.getItem('endTime');
    const savedEnergy = localStorage.getItem('energy');
    const endTime = new Date(savedEndTime);
    const newTimeLeft = endTime - new Date();
    if (newTimeLeft < 0 && savedEnergy <= 0) {
      try {
        await updateDoc(userRef, { energy: batteryValue });
        setEnergy(batteryValue);
      } catch (error) {
        console.error('Error updating energy:', error);
      }
    }
  };

  const updateActiveTime = async (userRef) => {

    try {
      await updateDoc(userRef, { 
        lastActive: new Date(),
      });
      console.log('Active Time Updated');
    } catch (error) {
      console.error('Error updating Active Time:', error);
    }
  }

  const updateSpins = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastDate = userData.slotTimeStamp.toDate(); // Convert Firestore timestamp to JS Date
      const formattedDates = lastDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      const currentDate = new Date(); // Get the current date
      const formattedCurrentDates = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
  
      if (formattedDates !== formattedCurrentDates && userData.spinLimit <= 0) {
        await updateDoc(userRef, {
          spinLimit: 10,
          slotTimeStamp: new Date()

        });
        setSpinLimit(10);
      }
    }
  };


  const updateReferrals = async (userRef) => {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const referrals = userData.referrals || [];

    const updatedReferrals = await Promise.all(referrals.map(async (referral) => {
      const referralRef = doc(db, 'telegramUsers', referral.userId);
      const referralDoc = await getDoc(referralRef);
      if (referralDoc.exists()) {
        const referralData = referralDoc.data();
        return {
          ...referral,
          balance: referralData.balance,
          level: referralData.level,
        };
      }
      return referral;
    }));

    await updateDoc(userRef, { referrals: updatedReferrals });

    const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
    const refBonus = Math.floor(totalEarnings * 0.1);
    const totalBalance = `${balance}` + refBonus;
    try {
      await updateDoc(userRef, { refBonus, totalBalance, lastActive: new Date() });
    } catch (error) {
      console.error('Error updating referrer bonus:', error);
    }
  };

  const updateUserLevel = async (userId, newTapBalance) => {
    let newLevel = { id: 1, name: "Bronze", imgUrl: "/bronze.webp" };

    if (newTapBalance >= 1000 && newTapBalance < 50000) {
      newLevel = { id: 2, name: "Silver", imgUrl: "/silver.webp" };
    } else if (newTapBalance >= 50000 && newTapBalance < 500000) {
      newLevel = { id: 3, name: "Gold", imgUrl: "/gold.webp" };
    } else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
      newLevel = { id: 4, name: "Platinum", imgUrl: "/platinum.webp" };
    } else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
      newLevel = { id: 5, name: "Diamond", imgUrl: "/diamond.webp" };
    } else if (newTapBalance >= 2500000) {
      newLevel = { id: 6, name: "Master", imgUrl: "/master.webp" };
    }

    if (newLevel.id !== level.id) {
      setLevel(newLevel);
      const userRef = doc(db, 'telegramUsers', userId);
      await updateDoc(userRef, { level: newLevel });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, 'telegramUsers', id.toString());
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
  
        // Handle prTeam
        if (userData.prTeam) {
          const updatedLevels = prTeam.map((team) => {
            const teamData = userData.prTeam.find(t => t.title === team.title);
            return teamData ? teamData.level : 0;
          });
  
          const updatedProfits = prTeam.map((team) => {
            const teamData = userData.prTeam.find(t => t.title === team.title);
            return teamData ? teamData.totalProfit : 0;
          });
  
          setUserLevels(updatedLevels);
          setTotalProfit(updatedProfits);
        }
  
        // Handle marketTeam
        if (userData.marketTeam) {
          const updatedLevelsMarket = marketTeam.map((market) => {
            const marketData = userData.marketTeam.find(t => t.title === market.title);
            return marketData ? marketData.level : 0;
          });
  
          const updatedMarketProfits = marketTeam.map((market) => {
            const marketData = userData.marketTeam.find(t => t.title === market.title);
            return marketData ? marketData.totalMarketProfit : 0;
          });
  
          setUserLevelsMarket(updatedLevelsMarket);
          setTotalMarketProfit(updatedMarketProfits);
        }
      } else {
        console.error('User document does not exist');
      }
    };
  
    fetchUserData();
  }, [id]);




  const checkAndUpdateFreeGuru = async () => {
    const userRef = doc(db, 'telegramUsers', id.toString());
    const userDoc = await getDoc(userRef);
  
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastDate = userData.timeSta.toDate(); // Convert Firestore timestamp to JS Date
      const formattedDates = lastDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
      const currentDate = new Date(); // Get the current date
      const formattedCurrentDates = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
  
      if (formattedDates !== formattedCurrentDates && userData.freeGuru <= 0) {
        await updateDoc(userRef, {
          freeGuru: 3,
          timeSta: new Date()

        });
        setFreeGuru(3);
      }
    }
  };


  useEffect(() => {
    const rewards = document.getElementById('reelsActivities');
    const rewardsTwo = document.getElementById('reels2Activities');

    if (location.pathname === '/rewards' || location.pathname === '/checkin') {
      rewards.style.background = "#a4a4a433";
      rewards.style.color = "#fff";
      rewardsTwo.style.color = "#fff";
      rewards.style.height = "60px";
      rewards.style.marginTop = "4px";
      rewards.style.paddingLeft = "6px";
      rewards.style.paddingRight = "6px";
    } else {
      rewards.style.background = "";
      rewards.style.color = "";
      rewards.style.height = "";
      rewards.style.marginTop = "";
      rewardsTwo.style.color = "";
      rewards.style.paddingLeft = "";
      rewards.style.paddingRight = "";
    }
  }, [location.pathname]);


  useEffect(() => {
    // Fetch the remaining clicks from Firestore when the component mounts
    const fetchRemainingClicks = async () => {
      if (id) {
        const userRef = doc(db, 'telegramUsers', id.toString());
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFreeGuru(userData.freeGuru || 0);
        }
      }
    };

    fetchRemainingClicks();
  }, [id]);

  useEffect(() => {
    // Calculate the new balance by adding balance and refBonus
    const newBalance = balance + refBonus;
  
    // Find the current 'MAX' token in walletAssets
    const maxToken = walletAssets.find(asset => asset.symbol === 'MAX');
  
    // Check if maxToken exists and if its balance is different from the newBalance
    if (maxToken && maxToken.balance !== newBalance) {
      // Update the balance for the 'MAX' token
      setWalletAssets(prevAssets =>
        prevAssets.map(asset =>
          asset.symbol === 'MAX' ? { ...asset, balance: newBalance } : asset
        )
      );
    }
  }, [balance, refBonus, walletAssets]);
  

  useEffect(() => {
    const checkLastCheckIn = async () => {
      if (!id) return;

      try {
        const userDocRef = doc(db, 'telegramUsers', id);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const now = new Date();

          const lastCheckInDate = userData.lastCheckIn?.toDate();

          if (lastCheckInDate) {
            const lastCheckInMidnight = new Date(lastCheckInDate);
            lastCheckInMidnight.setHours(0, 0, 0, 0);

            const todayMidnight = new Date(now);
            todayMidnight.setHours(0, 0, 0, 0);

            const daysSinceLastCheckIn = Math.floor((todayMidnight - lastCheckInMidnight) / (1000 * 60 * 60 * 24));

            if (daysSinceLastCheckIn === 1) {
              // Last check-in was yesterday, prompt user to claim today's bonus
              setShowClaimModal(true);
            } else if (daysSinceLastCheckIn > 1) {
              // User missed a day, show the start over modal
              setShowStartOverModal(true);
            }
          } else {
            // First time check-in, set the check-in modal to be shown
            setShowClaimModal(true);
          }
        }
      } catch (err) {
        console.error('Error during initial check-in:', err);
        setError('An error occurred while checking your last check-in.');
      }
    };

    checkLastCheckIn();
  }, [id, setCheckInDays, setError]);



  useEffect(() => {
    if (id) {
    checkAndUpdateFreeGuru();
    }
    if (selectedCharacter.name === '') {
      setCharacterMenu(true)
    } else {
      setCharacterMenu(false);
    }
    updateSpins();
      // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    sendUserData();
    // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
      // eslint-disable-next-line 
  }, [id]);

  useEffect(() => {
    if (id) {
      updateUserLevel(id, tapBalance);
    }
    // eslint-disable-next-line 
  }, [tapBalance, id]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <UserContext.Provider value={{ balance, specialCards, fullName, youtubeTasks, setYoutubeTasks, userYoutubeTasks, setUserYoutubeTasks, purchasedCards, withdrawals, setWithdrawals, deposits, setDeposits, swaps, setSwaps, walletAssets, setWalletAssets, setPurchasedCards, totalCardsProfits, setTotalCardsProfits, userLevelss, success, setSuccess, userLevels, setUserLevels, totalMarketProfit, setTotalMarketProfit, userLevelsMarket, setUserLevelsMarket, prTeam, marketTeam, totalProfit, setTotalProfit, profitHour, setProfitHour, showStartOverModal, setShowStartOverModal, showClaimModal, setShowClaimModal, spinLimit, setSpinLimit, lastCheckIn, setLastCheckIn, checkInDays, setCheckInDays, error, setError, showBalance, setShowBalance, openInfoTwo, setOpenInfoTwo, openInfoThree, setOpenInfoThree, setFullName, coolDownTime, setCoolDownTime, tappingGuru, setTappingGuru, lastTime, walletAddress, setWalletAddress, isAddressSaved, setIsAddressSaved, selectedCharacter, setSelectedCharacter, characterMenu, setCharacterMenu, setLastTime, claimExchangePoint, setClaimExchangePoint, battery, freeGuru, setFreeGuru, isTimerRunning, setIsTimerRunning, time, setTime, startTimer, setBattery, tapGuru, setTapGuru, mainTap, setMainTap, selectedExchange, setSelectedExchange, tapValue, setTapValue, tapBalance, setTapBalance, level, energy, setEnergy, setBalance, setLevel, loading, setLoading, id, setId, sendUserData, initialized, setInitialized, refBonus, setRefBonus, manualTasks, setManualTasks, userManualTasks, setUserManualTasks, tasks, setTasks, completedTasks, setCompletedTasks, claimedMilestones, setClaimedMilestones, referrals, claimedReferralRewards, setClaimedReferralRewards }}>
      {children}
    </UserContext.Provider>
  );
};
