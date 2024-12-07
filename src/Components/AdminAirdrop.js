import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firestore'; // adjust the path as needed
import { collection, doc, deleteDoc, query, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { MdOutlineContentCopy } from "react-icons/md";

const AdminAirdrop = () => {
   // eslint-disable-next-line 
  const [successMessage, setSuccessMessage] = useState('');
   // eslint-disable-next-line 
  const [errorMessage, setErrorMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [addresses, setAddresses] = useState({});
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (address) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userDoc = doc(db, "telegramUsers", userId);
      await deleteDoc(userDoc);
      setUsers(users.filter(user => user.id !== userId));
      setAddresses(prevAddresses => {
        const newAddresses = { ...prevAddresses };
        delete newAddresses[userId];
        return newAddresses;
      });
      setSuccessMessage('User successfully deleted!');
    } catch (error) {
      console.error("Error deleting user: ", error);
      setErrorMessage('Error deleting user');
    }
  };

  const fetchUsers = async (loadMore = false) => {
    setLoading(true);
    try {
      const usersRef = collection(db, "telegramUsers");
      const usersQuery = loadMore && lastVisible
        ? query(usersRef, orderBy("balance", "desc"), startAfter(lastVisible), limit(50))
        : query(usersRef, orderBy("balance", "desc"), limit(50));

      const userSnapshot = await getDocs(usersQuery);
      const lastVisibleDoc = userSnapshot.docs[userSnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      const fetchedUsers = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(user => user.address && user.address.trim() !== '');

      const newAddresses = fetchedUsers.reduce((acc, user) => {
        acc[user.id] = user.address;
        return acc;
      }, {});

      setUsers(loadMore ? [...users, ...fetchedUsers] : fetchedUsers);
      setAddresses(loadMore ? { ...addresses, ...newAddresses } : newAddresses);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setErrorMessage('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line 
  }, []);

  const toggleDropdown = (userId) => {
    setDropdownVisible(prevState => ({
      ...prevState,
      [userId]: !prevState[userId]
    }));
  };

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
    <div className="w-full flex flex-col space-y-4 h-[100vh] scroller pt-4 overflow-y-auto pb-[150px]">
      <div className="w-full sm:w-[50%] flex flex-col space-y-3">
        <h2 className="text-[20px] font-semibold">Eligible for Airdrop</h2>
        {users.map((user, index) => (
          <div key={user.id} className="bg-cards p-4 rounded-[10px] text-[13px] relative flex flex-col w-full space-y-2">
            <span className='flex w-full items-center space-x-1'>
              <span className='w-[16px] h-[16px] flex justify-center items-center rounded-full bg-[#000]'>
                <strong>{index + 1}</strong>
              </span> 
              <span className='line-clamp-1 font-semibold'>{user.username}</span>
            </span>

            <span className='flex items-center gap-1 psl-1'>
              <img src='/coins.webp' alt="balance" className="w-[14px] h-[14px] rounded-full" />
              <p><span className='font-semibold text-accent'>{formatNumber(user.balance)}</span></p>
            </span>
                    
            <span className='flex items-start w-full gap-1 pls-[1px]'>
              <img src='/binance.webp' alt="User Level" className="w-[14px] rounded-full h-[14px] mt-1" />
              <span className='text-secondary break-all text-wrap flex items-start w-full justify-between'>
                <span className='flex w-[80%]'>{user.address}</span>
                <MdOutlineContentCopy size={20} className='w-[20%]' onClick={() => copyToClipboard(user.address)} />
              </span>
            </span>

            <button 
              onClick={() => toggleDropdown(user.id)} 
              className="absolute top-2 right-2 bg-gray-900 text-white rounded-full p-2 h-[28px] w-[28px] flex items-center justify-center"
            >
              ⋮
            </button>

            {dropdownVisible[user.id] && (
              <div className="absolute z-10 top-8 right-2 bg-[#2e2e2e] text-primary rounded-md shadow-lg w-40">
                <button 
                  onClick={() => handleDeleteUser(user.id)} 
                  className="block w-full text-left px-4 py-2 hover:bg-[#7a7a7a33]"
                >
                  Delete User
                </button>
              </div>
            )}
          </div>
        ))}
        <button 
          onClick={() => fetchUsers(true)}
          disabled={loading}
          className="bg-[#f5bb5f] font-semibold text-[15px] rounded-[6px] w-full sm:w-[200px] h-fit px-4 py-3 text-[#000] mt-4"
        >
          {loading ? 'Loading...' : 'Load More Users'}
        </button>
      </div>

      <div className={`${copied === true ? "visible top-6" : "invisible top-[-10px]"} z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
        <div className="w-full text-[#54d192] flex items-center justify-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
          <span className="font-medium">Wallet address copied!</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAirdrop;
