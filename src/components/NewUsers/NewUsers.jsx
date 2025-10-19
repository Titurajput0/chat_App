



// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../../firebase/config';
// import { supabase } from '../../firebase/supabaseClient';
// import '../../components/NewUsers/NewUsers.css';
// import Chat from '../Chat/Chat';

// // Mock translations
// const translations = {
//   en: {
//     discoverPeople: 'Discover People',
//     noUsersFound: 'No users found',
//     tryAdjustingFilters: 'Try adjusting your filters or check back later for new users',
//     discoverFilters: 'Discover Filters',
//     status: 'Status',
//     interestedIn: 'Interested in',
//     selectCountry: 'Select Country',
//     age: 'Age',
//     maritalStatus: 'Marital Status',
//     reset: 'Reset',
//     applyFilters: 'Apply Filters',
//     filtersApplied: 'Filters Applied',
//     filtersReset: 'Filters Reset',
//     foundUsers: 'users matching your criteria',
//     allFiltersReset: 'All filters have been reset to default'
//   }
// };

// // Country data
// const countries = [
//   { code: 'IN', name: 'India' },
//   { code: 'US', name: 'United States' },
//   { code: 'CA', name: 'Canada' },
//   { code: 'GB', name: 'United Kingdom' },
//   { code: 'AU', name: 'Australia' },
// ];

// const genderOptions = ['Male', 'Female', 'Other'];
// const statusOptions = ['online', 'offline'];
// const maritalStatusOptions = [
//   'single', 'married', 'other', 'in a Relationship', 
//   'divorced', 'widowed', 'separated', 'single Mom', 'single Dad'
// ];

// export default function NewUsers() {
//   const [users, setUsers] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [existingChats, setExistingChats] = useState([]);
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [gender, setGender] = useState(null);
//   const [activeStatus, setActiveStatus] = useState(null);
//   const [country, setCountry] = useState(null);
//   const [countryCode, setCountryCode] = useState('IN');
//   const [age, setAge] = useState(28);
//   const [maritalStatus, setMaritalStatus] = useState(null);
//   const [isOnline, setIsOnline] = useState(false);
//   const [showIncomingCall, setShowIncomingCall] = useState(false);
//   const [callerInfo, setCallerInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const fadeIn = useRef(0);
//   const slideIn = useRef(30);

//   const t = (key) => translations.en[key] || key;

//   // Animation effects
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fadeIn.current = 1;
//       slideIn.current = 0;
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   // Real-time subscriptions
//   useEffect(() => {
//     const email = auth.currentUser?.email;
//     if (!email) {
//       setLoading(false);
//       return;
//     }

//     let usersChannel, chatsChannel;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all users except current
//         const { data: usersData, error: usersError } = await supabase
//           .from("users")
//           .select("id, email, name, age, avatar, isverifiedprofile, country, isactivestatus, about, gender, maritalstatus")
//           .neq("email", email)
//           .order("name", { ascending: true });

//         if (usersError) throw usersError;
//         setUsers(usersData || []);
//         setAllUsers(usersData || []);

//         // Fetch existing chats
//         const { data: chatsData, error: chatsError } = await supabase
//           .from("chats")
//           .select("id, users, participants, group_name")
//           .contains("participants", [email])
//           .eq("group_name", "");

//         if (chatsError) throw chatsError;

//         setExistingChats(
//           (chatsData || []).map((chat) => ({
//             chatId: chat.id,
//             userEmails: chat.users,
//           }))
//         );

//         // Real-time subscription for users
//         usersChannel = supabase
//           .channel("users-changes")
//           .on(
//             "postgres_changes",
//             { event: "*", schema: "public", table: "users" },
//             (payload) => {
//               if (payload.eventType === "INSERT") {
//                 setUsers(prev => [...prev, payload.new]);
//                 setAllUsers(prev => [...prev, payload.new]);
//               } else if (payload.eventType === "UPDATE") {
//                 setUsers(prev =>
//                   prev.map(u => u.id === payload.new.id ? payload.new : u)
//                 );
//                 setAllUsers(prev =>
//                   prev.map(u => u.id === payload.new.id ? payload.new : u)
//                 );
//               } else if (payload.eventType === "DELETE") {
//                 setUsers(prev => prev.filter(u => u.id !== payload.old.id));
//                 setAllUsers(prev => prev.filter(u => u.id !== payload.old.id));
//               }
//             }
//           )
//           .subscribe();

//         // Real-time subscription for chats
//         chatsChannel = supabase
//           .channel("chats-changes")
//           .on(
//             "postgres_changes",
//             { event: "*", schema: "public", table: "chats" },
//             (payload) => {
//               if (payload.eventType === "INSERT" && payload.new.participants.includes(email)) {
//                 setExistingChats(prev => [
//                   ...prev,
//                   {
//                     chatId: payload.new.id,
//                     userEmails: payload.new.users,
//                   },
//                 ]);
//               } else if (payload.eventType === "UPDATE") {
//                 setExistingChats(prev =>
//                   prev.map(chat =>
//                     chat.chatId === payload.new.id
//                       ? { chatId: payload.new.id, userEmails: payload.new.users }
//                       : chat
//                   )
//                 );
//               } else if (payload.eventType === "DELETE") {
//                 setExistingChats(prev =>
//                   prev.filter(chat => chat.chatId !== payload.old.id)
//                 );
//               }
//             }
//           )
//           .subscribe();

//       } catch (err) {
//         console.error("Error fetching chats/users:", err.message);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       if (usersChannel) supabase.removeChannel(usersChannel);
//       if (chatsChannel) supabase.removeChannel(chatsChannel);
//     };
//   }, []);

//   // Filter functions
//   const applyFilters = useCallback(() => {
//     let filteredUsers = [...allUsers];

//     if (gender) {
//       filteredUsers = filteredUsers.filter(
//         user => user.gender?.toLowerCase() === gender.toLowerCase()
//       );
//     }

//     if (age) {
//       filteredUsers = filteredUsers.filter(
//         user => user.age >= 18 && user.age <= age
//       );
//     }

//     if (country?.name) {
//       filteredUsers = filteredUsers.filter(
//         user => user.country?.toLowerCase() === country.name.toLowerCase()
//       );
//     }

//     if (maritalStatus) {
//       filteredUsers = filteredUsers.filter(
//         user => user.maritalstatus?.toLowerCase() === maritalStatus.toLowerCase()
//       );
//     }

//     if (activeStatus) {
//       if (activeStatus.toLowerCase() === "online") {
//         filteredUsers = filteredUsers.filter(user => user.isactivestatus === true);
//       } else if (activeStatus.toLowerCase() === "offline") {
//         filteredUsers = filteredUsers.filter(user => user.isactivestatus === false);
//       }
//     }

//     setUsers(filteredUsers);
//     setIsFilterVisible(false);

//     alert(`${t('filtersApplied')}: Found ${filteredUsers.length} ${t('foundUsers')}`);
//   }, [allUsers, gender, age, country, maritalStatus, activeStatus, t]);

//   const resetFilters = useCallback(() => {
//     setGender(null);
//     setAge(28);
//     setCountry(null);
//     setCountryCode('IN');
//     setMaritalStatus(null);
//     setActiveStatus(null);
//     setUsers(allUsers);
//     alert(t('filtersReset'));
//   }, [allUsers, t]);

//   // Navigation and chat functions
//   const handleNavigate = useCallback(async (user) => {
//     if (!auth.currentUser?.email) {
//       alert("Please log in to start chatting");
//       return;
//     }

//     try {
//       const email = user.email;
//       const currentUserEmail = auth.currentUser.email;

//       // Check if chat already exists
//       const { data: existingChat, error } = await supabase
//         .from("chats")
//         .select("*")
//         .contains("participants", [currentUserEmail, email])
//         .maybeSingle();

//       if (error) {
//         console.log("Error fetching chat:", error);
//         alert("Error checking existing chat");
//         return;
//       }

//       let chatId;

//       if (existingChat) {
//         chatId = existingChat.id;
//       } else {
//         // Create new chat
//         const { data: newChat, error: insertError } = await supabase
//           .from("chats")
//           .insert([
//             {
//               participants: [currentUserEmail, email],
//               users: [
//                 {
//                   email: currentUserEmail,
//                   name: auth.currentUser.displayName || currentUserEmail,
//                   deletedFromChat: false,
//                 },
//                 { 
//                   email: email, 
//                   name: user.name || email, 
//                   deletedFromChat: false 
//                 },
//               ],
//               last_updated: new Date().toISOString(),
//               last_access: [
//                 { email: currentUserEmail, date: new Date().toISOString() },
//                 { email: email, date: "" },
//               ],
//             },
//           ])
//           .select()
//           .single();

//         if (insertError) {
//           console.log("Error creating chat:", insertError);
//           alert("Error creating new chat");
//           return;
//         }

//         chatId = newChat.id;
//       }

  




//       navigate('/Chat', {
//   state: { 
//     id: chatId,
//     chatName: handleName(user),
//     email: email,
//     isactivestatus: user.isactivestatus,
//     avatar: user.avatar,
//     about: user.about,
//     name: user.name,
//     image: user.avatar,
//     country: user.country,
//     age: user.age,
//     gender: user.gender,
//     maritalstatus: user.maritalstatus
//   }
// });


//     } catch (err) {
//       console.error("Error in handleNavigate:", err);
//       alert("Error starting chat");
//     }
//   }, [navigate]);

//   const handleName = useCallback((user) => {
//     const { name, email } = user;
//     const currentUserEmail = auth.currentUser?.email;
    
//     if (name && name.trim()) {
//       return email === currentUserEmail ? `${name}*(You)` : name;
//     }
//     return email || '~ No Name or Email ~';
//   }, []);

//   const handleAcceptCall = useCallback(() => {
//     // Implement call acceptance logic here
//     console.log("Call accepted");
//     setShowIncomingCall(false);
//   }, []);

//   // Render user card
//   const UserCard = React.memo(({ user, index }) => {
//     return (
//       <div 
//         className={`user-card fade-in-up`}
//         style={{ animationDelay: `${index * 100}ms` }}
//         onClick={() => handleNavigate(user)}
//       >
//         <div className="card-image-container">
//           <img
//             src={user.avatar || '/default-avatar.png'}
//             alt={user.name}
//             className="card-image"
//             onError={(e) => {
//               e.target.src = '/default-avatar.png';
//             }}
//           />
          
//           {user.isNew && (
//             <div className="new-badge">
//               <span className="new-text">NEW</span>
//             </div>
//           )}
          
//           <div className="gradient-overlay">
//             <div className="card-info">
//               <div className="name-container">
//                 <span className="name">
//                   {user.name}, {user.age}
//                   {user.isverifiedprofile && (
//                     <span className="verified-badge">✓</span>
//                   )}
//                 </span>
//               </div>
              
//               <div className="details-row">
//                 <span 
//                   className={`status-indicator ${user.isactivestatus ? 'online' : 'offline'}`}
//                 >
//                   ●
//                 </span>
//                 <span className="location">
//                   {user.country}
//                 </span>
//               </div>

//               {user.about && (
//                 <div className="about-preview">
//                   {user.about.length > 50 
//                     ? `${user.about.substring(0, 50)}...` 
//                     : user.about
//                   }
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   });

//   // Loading State
//   const LoadingState = () => (
//     <div className="loading-state">
//       <div className="loading-spinner"></div>
//       <p>Loading users...</p>
//     </div>
//   );

//   // Error State
//   const ErrorState = () => (
//     <div className="error-state">
//       <div className="error-icon">⚠️</div>
//       <h3>Error Loading Users</h3>
//       <p>{error}</p>
//       <button 
//         className="retry-button"
//         onClick={() => window.location.reload()}
//       >
//         Retry
//       </button>
//     </div>
//   );

//   // Empty state component
//   const EmptyState = () => (
//     <div className="empty-state">
//       <div className="empty-animation">👥</div>
//       <h3 className="empty-text">{t('noUsersFound')}</h3>
//       <p className="empty-subtext">{t('tryAdjustingFilters')}</p>
//       <button 
//         className="reset-filters-button"
//         onClick={resetFilters}
//       >
//         Reset Filters
//       </button>
//     </div>
//   );

//   // Filter modal component
//   const FilterModal = () => {
//     if (!isFilterVisible) return null;

//     return (
//       <div className="modal-overlay" onClick={() => setIsFilterVisible(false)}>
//         <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
//           <div className="modal-header">
//             <h3 className="modal-title">{t('discoverFilters')}</h3>
//             <button 
//               className="close-button"
//               onClick={() => setIsFilterVisible(false)}
//             >
//               ×
//             </button>
//           </div>

//           <div className="modal-content">
//             {/* Status Filter */}
//             <div className="filter-section">
//               <label className="filter-label">{t('status')}</label>
//               <div className="chip-row">
//                 {statusOptions.map((item) => (
//                   <button
//                     key={item}
//                     className={`chip ${activeStatus === item ? 'chip-selected' : ''}`}
//                     onClick={() => setActiveStatus(activeStatus === item ? null : item)}
//                   >
//                     {item.charAt(0).toUpperCase() + item.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Gender Filter */}
//             <div className="filter-section">
//               <label className="filter-label">{t('interestedIn')}</label>
//               <div className="chip-row">
//                 {genderOptions.map((item) => (
//                   <button
//                     key={item}
//                     className={`chip ${gender === item ? 'chip-selected' : ''}`}
//                     onClick={() => setGender(gender === item ? null : item)}
//                   >
//                     {item}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Country Filter */}
//             <div className="filter-section">
//               <label className="filter-label">{t('selectCountry')}</label>
//               <div className="country-selector">
//                 <select
//                   value={country?.code || ''}
//                   onChange={(e) => {
//                     const selectedCountry = countries.find(c => c.code === e.target.value);
//                     setCountry(selectedCountry);
//                     setCountryCode(selectedCountry?.code || 'IN');
//                   }}
//                   className="country-dropdown"
//                 >
//                   <option value="">Select a country</option>
//                   {countries.map(country => (
//                     <option key={country.code} value={country.code}>
//                       {country.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Age Filter */}
//             <div className="filter-section">
//               <label className="filter-label">{t('age')}: {age}</label>
//               <input
//                 type="range"
//                 min="18"
//                 max="120"
//                 value={age}
//                 onChange={(e) => setAge(parseInt(e.target.value))}
//                 className="age-slider"
//               />
//             </div>

//             {/* Marital Status Filter */}
//             <div className="filter-section">
//               <label className="filter-label">{t('maritalStatus')}</label>
//               <div className="chip-row marital-chips">
//                 {maritalStatusOptions.map((item) => (
//                   <button
//                     key={item}
//                     className={`chip ${maritalStatus === item ? 'chip-selected' : ''}`}
//                     onClick={() => setMaritalStatus(maritalStatus === item ? null : item)}
//                   >
//                     {item}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="filter-actions">
//               <button className="reset-button" onClick={resetFilters}>
//                 {t('reset')}
//               </button>
//               <button className="apply-button" onClick={applyFilters}>
//                 {t('applyFilters')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="new-users-container">
//       {/* Header */}
//       <div className="header">
//         <div className="header-content">
//           <h1 className="app-title">{t('discoverPeople')}</h1>
//           <button 
//             className="filter-button"
//             onClick={() => setIsFilterVisible(true)}
//           >
//             <span className="filter-icon">⚙️</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {loading ? (
//           <LoadingState />
//         ) : error ? (
//           <ErrorState />
//         ) : users.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <div className="users-grid">
//             {users.map((user, index) => (
//               <UserCard 
//                 key={user.id} 
//                 user={user} 
//                 index={index}
//               />
//             ))}
//           </div>
//         )}

//         {/* Ad placeholder - every 4th item */}
//         {users.length > 0 && users.length % 4 === 0 && (
//           <div className="ad-container">
//             <div className="ad-placeholder">
//               Advertisement
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Filter Modal */}
//       <FilterModal />

//       {/* Incoming Call Screen (placeholder) */}
//       {showIncomingCall && callerInfo && (
//         <div className="incoming-call-overlay">
//           <div className="incoming-call-modal">
//             <h3>Incoming Call</h3>
//             <p>From: {callerInfo.name}</p>
//             <div className="call-actions">
//               <button onClick={handleAcceptCall}>Accept</button>
//               <button onClick={() => setShowIncomingCall(false)}>Reject</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { supabase } from '../../firebase/supabaseClient';
import '../../components/NewUsers/NewUsers.css';

// Mock translations
const translations = {
  en: {
    discoverPeople: 'Discover People',
    noUsersFound: 'No users found',
    tryAdjustingFilters: 'Try adjusting your filters or check back later for new users',
    discoverFilters: 'Discover Filters',
    status: 'Status',
    interestedIn: 'Interested in',
    selectCountry: 'Select Country',
    age: 'Age',
    maritalStatus: 'Marital Status',
    reset: 'Reset',
    applyFilters: 'Apply Filters',
    filtersApplied: 'Filters Applied',
    filtersReset: 'Filters Reset',
    foundUsers: 'users matching your criteria',
    allFiltersReset: 'All filters have been reset to default',
    startChatting: 'Start Chatting',
    onlineNow: 'Online Now',
    newUsers: 'New Users'
  }
};

// Country data
const countries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
];

const genderOptions = ['Male', 'Female', 'Other'];
const statusOptions = ['online', 'offline'];
const maritalStatusOptions = [
  'single', 'married', 'other', 'in a Relationship', 
  'divorced', 'widowed', 'separated', 'single Mom', 'single Dad'
];

export default function NewUsers() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [existingChats, setExistingChats] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [gender, setGender] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [country, setCountry] = useState(null);
  const [countryCode, setCountryCode] = useState('IN');
  const [age, setAge] = useState(28);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const fadeIn = useRef(0);
  const slideIn = useRef(30);

  const t = (key) => translations.en[key] || key;

  // Animation effects
  useEffect(() => {
    const timer = setTimeout(() => {
      fadeIn.current = 1;
      slideIn.current = 0;
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Real-time subscriptions
  useEffect(() => {
    const email = auth.currentUser?.email;
    if (!email) {
      setLoading(false);
      return;
    }

    let usersChannel, chatsChannel;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all users except current
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, email, name, age, avatar, isverifiedprofile, country, isactivestatus, about, gender, maritalstatus")
          .neq("email", email)
          .order("name", { ascending: true });

        if (usersError) throw usersError;
        
        // Add new flag for demo purposes
        const usersWithNewFlag = (usersData || []).map((user, index) => ({
          ...user,
          isNew: index < 3 // First 3 users marked as new
        }));
        
        setUsers(usersWithNewFlag);
        setAllUsers(usersWithNewFlag);

        // Fetch existing chats
        const { data: chatsData, error: chatsError } = await supabase
          .from("chats")
          .select("id, users, participants, group_name")
          .contains("participants", [email])
          .eq("group_name", "");

        if (chatsError) throw chatsError;

        setExistingChats(
          (chatsData || []).map((chat) => ({
            chatId: chat.id,
            userEmails: chat.users,
          }))
        );

        // Real-time subscription for users
        usersChannel = supabase
          .channel("users-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "users" },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setUsers(prev => [...prev, payload.new]);
                setAllUsers(prev => [...prev, payload.new]);
              } else if (payload.eventType === "UPDATE") {
                setUsers(prev =>
                  prev.map(u => u.id === payload.new.id ? payload.new : u)
                );
                setAllUsers(prev =>
                  prev.map(u => u.id === payload.new.id ? payload.new : u)
                );
              } else if (payload.eventType === "DELETE") {
                setUsers(prev => prev.filter(u => u.id !== payload.old.id));
                setAllUsers(prev => prev.filter(u => u.id !== payload.old.id));
              }
            }
          )
          .subscribe();

        // Real-time subscription for chats
        chatsChannel = supabase
          .channel("chats-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "chats" },
            (payload) => {
              if (payload.eventType === "INSERT" && payload.new.participants.includes(email)) {
                setExistingChats(prev => [
                  ...prev,
                  {
                    chatId: payload.new.id,
                    userEmails: payload.new.users,
                  },
                ]);
              } else if (payload.eventType === "UPDATE") {
                setExistingChats(prev =>
                  prev.map(chat =>
                    chat.chatId === payload.new.id
                      ? { chatId: payload.new.id, userEmails: payload.new.users }
                      : chat
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setExistingChats(prev =>
                  prev.filter(chat => chat.chatId !== payload.old.id)
                );
              }
            }
          )
          .subscribe();

      } catch (err) {
        console.error("Error fetching chats/users:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (usersChannel) supabase.removeChannel(usersChannel);
      if (chatsChannel) supabase.removeChannel(chatsChannel);
    };
  }, []);

  // Filter functions
  const applyFilters = useCallback(() => {
    let filteredUsers = [...allUsers];

    if (gender) {
      filteredUsers = filteredUsers.filter(
        user => user.gender?.toLowerCase() === gender.toLowerCase()
      );
    }

    if (age) {
      filteredUsers = filteredUsers.filter(
        user => user.age >= 18 && user.age <= age
      );
    }

    if (country?.name) {
      filteredUsers = filteredUsers.filter(
        user => user.country?.toLowerCase() === country.name.toLowerCase()
      );
    }

    if (maritalStatus) {
      filteredUsers = filteredUsers.filter(
        user => user.maritalstatus?.toLowerCase() === maritalStatus.toLowerCase()
      );
    }

    if (activeStatus) {
      if (activeStatus.toLowerCase() === "online") {
        filteredUsers = filteredUsers.filter(user => user.isactivestatus === true);
      } else if (activeStatus.toLowerCase() === "offline") {
        filteredUsers = filteredUsers.filter(user => user.isactivestatus === false);
      }
    }

    if (searchQuery) {
      filteredUsers = filteredUsers.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.about?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setUsers(filteredUsers);
    setIsFilterVisible(false);

    alert(`${t('filtersApplied')}: Found ${filteredUsers.length} ${t('foundUsers')}`);
  }, [allUsers, gender, age, country, maritalStatus, activeStatus, searchQuery, t]);

  const resetFilters = useCallback(() => {
    setGender(null);
    setAge(28);
    setCountry(null);
    setCountryCode('IN');
    setMaritalStatus(null);
    setActiveStatus(null);
    setSearchQuery('');
    setUsers(allUsers);
    alert(t('allFiltersReset'));
  }, [allUsers, t]);

  // Navigation and chat functions
  const handleNavigate = useCallback(async (user) => {
    if (!auth.currentUser?.email) {
      alert("Please log in to start chatting");
      return;
    }

    try {
      const email = user.email;
      const currentUserEmail = auth.currentUser.email;

      // Check if chat already exists
      const { data: existingChat, error } = await supabase
        .from("chats")
        .select("*")
        .contains("participants", [currentUserEmail, email])
        .maybeSingle();

      if (error) {
        console.log("Error fetching chat:", error);
        alert("Error checking existing chat");
        return;
      }

      let chatId;

      if (existingChat) {
        chatId = existingChat.id;
      } else {
        // Create new chat
        const { data: newChat, error: insertError } = await supabase
          .from("chats")
          .insert([
            {
              participants: [currentUserEmail, email],
              users: [
                {
                  email: currentUserEmail,
                  name: auth.currentUser.displayName || currentUserEmail,
                  deletedFromChat: false,
                },
                { 
                  email: email, 
                  name: user.name || email, 
                  deletedFromChat: false 
                },
              ],
              last_updated: new Date().toISOString(),
              last_access: [
                { email: currentUserEmail, date: new Date().toISOString() },
                { email: email, date: "" },
              ],
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.log("Error creating chat:", insertError);
          alert("Error creating new chat");
          return;
        }

        chatId = newChat.id;
      }

      navigate('/Chat', {
        state: { 
          id: chatId,
          chatName: handleName(user),
          email: email,
          isactivestatus: user.isactivestatus,
          avatar: user.avatar,
          about: user.about,
          name: user.name,
          image: user.avatar,
          country: user.country,
          age: user.age,
          gender: user.gender,
          maritalstatus: user.maritalstatus
        }
      });

    } catch (err) {
      console.error("Error in handleNavigate:", err);
      alert("Error starting chat");
    }
  }, [navigate]);

  const handleName = useCallback((user) => {
    const { name, email } = user;
    const currentUserEmail = auth.currentUser?.email;
    
    if (name && name.trim()) {
      return email === currentUserEmail ? `${name}*(You)` : name;
    }
    return email || '~ No Name or Email ~';
  }, []);

  const handleAcceptCall = useCallback(() => {
    console.log("Call accepted");
    setShowIncomingCall(false);
  }, []);

  // Stats calculation
  const onlineUsersCount = users.filter(user => user.isactivestatus).length;
  const newUsersCount = users.filter(user => user.isNew).length;

  // Render user card
  const UserCard = React.memo(({ user, index }) => {
    return (
      <div 
        className={`modern-user-card fade-in-up`}
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={() => handleNavigate(user)}
      >
        <div className="modern-card-image-container">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={user.name}
            className="modern-card-image"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
          
          {/* Status Badges */}
          <div className="modern-card-badges">
            {user.isNew && (
              <div className="modern-new-badge">
                <span className="modern-new-text">NEW</span>
              </div>
            )}
            
            {user.isactivestatus && (
              <div className="modern-online-badge">
                <span className="modern-online-text">LIVE</span>
              </div>
            )}
            
            {user.isverifiedprofile && (
              <div className="modern-verified-badge">
                <span className="modern-verified-icon">✓</span>
              </div>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="modern-gradient-overlay">
            <div className="modern-card-info">
              <div className="modern-name-container">
                <h3 className="modern-name">
                  {user.name}, {user.age}
                </h3>
              </div>
              
              <div className="modern-details-row">
                <span className={`modern-status-indicator ${user.isactivestatus ? 'online' : 'offline'}`}>
                  {user.isactivestatus ? '● Online' : '○ Offline'}
                </span>
                <span className="modern-location">
                  {user.country}
                </span>
              </div>

              {user.about && (
                <div className="modern-about-preview">
                  {user.about.length > 60 
                    ? `${user.about.substring(0, 60)}...` 
                    : user.about
                  }
                </div>
              )}

              <div className="modern-action-button">
                <span className="modern-chat-text">{t('startChatting')}</span>
                <span className="modern-chat-icon">💬</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="modern-card-footer">
          <div className="modern-tags">
            {user.gender && (
              <span className="modern-tag">{user.gender}</span>
            )}
            {user.maritalstatus && (
              <span className="modern-tag">{user.maritalstatus}</span>
            )}
          </div>
        </div>
      </div>
    );
  });

  // Loading State
  const LoadingState = () => (
    <div className="modern-loading-state">
      <div className="modern-loading-spinner"></div>
      <p>Discovering amazing people...</p>
    </div>
  );

  // Error State
  const ErrorState = () => (
    <div className="modern-error-state">
      <div className="modern-error-icon">⚠️</div>
      <h3>Connection Error</h3>
      <p>{error}</p>
      <button 
        className="modern-retry-button"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="modern-empty-state">
      <div className="modern-empty-animation">
        <div className="modern-empty-gradient">👥</div>
      </div>
      <h3 className="modern-empty-text">{t('noUsersFound')}</h3>
      <p className="modern-empty-subtext">{t('tryAdjustingFilters')}</p>
      <button 
        className="modern-reset-filters-button"
        onClick={resetFilters}
      >
        Reset All Filters
      </button>
    </div>
  );

  // Filter modal component
  const FilterModal = () => {
    if (!isFilterVisible) return null;

    return (
      <div className="modern-modal-overlay" onClick={() => setIsFilterVisible(false)}>
        <div className="modern-filter-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modern-modal-header">
            <div className="modern-modal-title-section">
              <h3 className="modern-modal-title">{t('discoverFilters')}</h3>
              <p className="modern-modal-subtitle">Refine your search</p>
            </div>
            <button 
              className="modern-close-button"
              onClick={() => setIsFilterVisible(false)}
            >
              <span className="modern-close-icon">×</span>
            </button>
          </div>

          <div className="modern-modal-content">
            {/* Search Filter */}
            <div className="modern-filter-section">
              <label className="modern-filter-label">Search</label>
              <div className="modern-search-input-container">
                <span className="modern-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, location, or bio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="modern-search-field"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="modern-filter-section">
              <label className="modern-filter-label">{t('status')}</label>
              <div className="modern-chip-row">
                {statusOptions.map((item) => (
                  <button
                    key={item}
                    className={`modern-chip ${activeStatus === item ? 'modern-chip-selected' : ''}`}
                    onClick={() => setActiveStatus(activeStatus === item ? null : item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="modern-filter-section">
              <label className="modern-filter-label">{t('interestedIn')}</label>
              <div className="modern-chip-row">
                {genderOptions.map((item) => (
                  <button
                    key={item}
                    className={`modern-chip ${gender === item ? 'modern-chip-selected' : ''}`}
                    onClick={() => setGender(gender === item ? null : item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Filter */}
            <div className="modern-filter-section">
              <label className="modern-filter-label">{t('selectCountry')}</label>
              <div className="modern-country-selector">
                <select
                  value={country?.code || ''}
                  onChange={(e) => {
                    const selectedCountry = countries.find(c => c.code === e.target.value);
                    setCountry(selectedCountry);
                    setCountryCode(selectedCountry?.code || 'IN');
                  }}
                  className="modern-country-dropdown"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age Filter */}
            <div className="modern-filter-section">
              <label className="modern-filter-label">{t('age')}: <span className="modern-age-value">{age}</span></label>
              <input
                type="range"
                min="18"
                max="120"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="modern-age-slider"
              />
              <div className="modern-age-labels">
                <span>18</span>
                <span>120</span>
              </div>
            </div>

            {/* Marital Status Filter */}
            <div className="modern-filter-section">
              <label className="modern-filter-label">{t('maritalStatus')}</label>
              <div className="modern-chip-row modern-marital-chips">
                {maritalStatusOptions.map((item) => (
                  <button
                    key={item}
                    className={`modern-chip ${maritalStatus === item ? 'modern-chip-selected' : ''}`}
                    onClick={() => setMaritalStatus(maritalStatus === item ? null : item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modern-filter-actions">
              <button className="modern-reset-button" onClick={resetFilters}>
                <span className="modern-reset-icon">↺</span>
                {t('reset')}
              </button>
              <button className="modern-apply-button" onClick={applyFilters}>
                <span className="modern-apply-icon">✓</span>
                {t('applyFilters')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modern-new-users-container">
      {/* Animated Background */}
      <div className="modern-background-gradient">
        <div className="modern-floating-shape shape1"></div>
        <div className="modern-floating-shape shape2"></div>
        <div className="modern-floating-shape shape3"></div>
      </div>

      {/* Header */}
      <div className="modern-header">
        <div className="modern-header-content">
          <div className="modern-header-text">
            <h1 className="modern-app-title">{t('discoverPeople')}</h1>
            <p className="modern-app-subtitle">Connect with amazing people around you</p>
          </div>
          <div className="modern-header-stats">
            <div className="modern-stat">
              <span className="modern-stat-number">{users.length}</span>
              <span className="modern-stat-label">Total</span>
            </div>
            <div className="modern-stat">
              <span className="modern-stat-number">{onlineUsersCount}</span>
              <span className="modern-stat-label">{t('onlineNow')}</span>
            </div>
            <div className="modern-stat">
              <span className="modern-stat-number">{newUsersCount}</span>
              <span className="modern-stat-label">{t('newUsers')}</span>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="modern-search-filter-bar">
          <div className="modern-search-container">
            <div className="modern-search-input-wrapper">
              <span className="modern-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="modern-search-input"
              />
              {searchQuery && (
                <button 
                  className="modern-clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <button 
            className="modern-filter-toggle"
            onClick={() => setIsFilterVisible(true)}
          >
            <span className="modern-filter-icon">⚙️</span>
            <span className="modern-filter-text">Filters</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="modern-main-content">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : users.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="modern-users-grid">
            {users.map((user, index) => (
              <UserCard 
                key={user.id} 
                user={user} 
                index={index}
              />
            ))}
          </div>
        )}

        {/* Ad placeholder */}
        {users.length > 0 && users.length % 4 === 0 && (
          <div className="modern-ad-container">
            <div className="modern-ad-placeholder">
              <div className="modern-ad-gradient">✨ Premium Features Available</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal />

      {/* Incoming Call Screen (placeholder) */}
      {showIncomingCall && callerInfo && (
        <div className="modern-incoming-call-overlay">
          <div className="modern-incoming-call-modal">
            <h3>Incoming Call</h3>
            <p>From: {callerInfo.name}</p>
            <div className="modern-call-actions">
              <button onClick={handleAcceptCall}>Accept</button>
              <button onClick={() => setShowIncomingCall(false)}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}