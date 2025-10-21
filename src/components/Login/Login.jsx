// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth, db } from '../../firebase/config';
// import { supabase } from '../../firebase/supabaseClient';
// import { doc, updateDoc, getDoc } from 'firebase/firestore';
// import '../../components/Login/Login.css';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [fadeIn, setFadeIn] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     setFadeIn(true); // Trigger fade-in animation
//   }, []);

//   const setUserOnline = async (email) => {
//     try {
//       const userRef = doc(db, "users", email);
//       const docSnap = await getDoc(userRef);
//       if (docSnap.exists()) {
//         await updateDoc(userRef, { isActiveStatus: true });
//         console.log("User set online");
//       }
//     } catch (error) {
//       console.error("Error setting user online:", error);
//     }
//   };

//   const onHandleLogin = async (e) => {
//     e.preventDefault();
//     if (email && password) {
//       try {
//         const cred = await signInWithEmailAndPassword(auth, email, password);
//         const cleanedEmail = cred.user.email.trim().toLowerCase();
//         localStorage.setItem("email", cleanedEmail);

//         // Get admin status from Supabase
//         const { data, error } = await supabase
//           .from("users")
//           .select("isTypeAdmin")
//           .eq("email", cleanedEmail)
//           .single();

//         if (error) {
//           alert("Supabase error: " + error.message);
//           return;
//         }

//         localStorage.setItem("isTypeAdmin", JSON.stringify(data.isTypeAdmin));

//         // Update user active status
//         await supabase
//           .from("users")
//           .update({
//             isactivestatus: true,
//             iscallingfrom: "",
//             isoncallstatus: false,
//             password: password
//           })
//           .eq("email", cleanedEmail);

//         await setUserOnline(cleanedEmail);
//         navigate("/chats");
//       } catch (err) {
//         alert("Login error: " + err.message);
//       }
//     }
//   };

//   return (
//     <div className="gradient-background">
//       <div className="safe-area">
//         <div className={`login-container ${fadeIn ? 'fade-in' : ''}`}>

//           {/* Header */}
//           <div className="header">
//             <h1 className="title">Login</h1>
//             <p className="subtitle">Welcome back! Please sign in to continue</p>
//           </div>

//           {/* Login Form */}
//           <form className="login-form" onSubmit={onHandleLogin}>

//             {/* Email */}
//             <div className="input-container">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="form-input"
//               />
//             </div>

//             {/* Password */}
//             <div className="input-container">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="form-input"
//               />
//               <button
//                 type="button"
//                 className="eye-button"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>

//             {/* Forgot Password */}
//             <div className="forgot-password-container">
//               <Link to="/forgot-password" className="forgot-password">
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Submit */}
//             <button type="submit" className="login-button">
//               Login
//             </button>

//             {/* Signup Link */}
//             <div className="signup-container">
//               <span>Don't have an account? </span>
//               <Link to="/signup" className="signup-link">Sign Up</Link>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import { supabase } from '../../firebase/supabaseClient';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import '../../components/Login/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const setUserOnline = async (email) => {
    try {
      const userRef = doc(db, "users", email);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        await updateDoc(userRef, { isActiveStatus: true });
        console.log("User set online");
      }
    } catch (error) {
      console.error("Error setting user online:", error);
    }
  };

  const onHandleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const cleanedEmail = cred.user.email.trim().toLowerCase();
        localStorage.setItem("email", cleanedEmail);

        // Get admin status from Supabase
        const { data, error } = await supabase
          .from("users")
          .select("isTypeAdmin")
          .eq("email", cleanedEmail)
          .single();

        if (error) {
          alert("Supabase error: " + error.message);
          return;
        }

        localStorage.setItem("isTypeAdmin", JSON.stringify(data.isTypeAdmin));

        // Update user active status
        await supabase
          .from("users")
          .update({
            isactivestatus: true,
            iscallingfrom: "",
            isoncallstatus: false,
            password: password
          })
          .eq("email", cleanedEmail);

        await setUserOnline(cleanedEmail);
        navigate("/chats");
      } catch (err) {
        alert("Login error: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="modern-gradient-background">
      <div className="modern-safe-area">
        
        {/* Animated Background Elements */}
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>

        <div className={`modern-login-container ${fadeIn ? 'modern-fade-in' : ''}`}>
          
          {/* App Branding */}
          <div className="app-brand">
            <div className="logo-icon">
              <div className="logo-gradient"></div>
            </div>
            <h1 className="app-name">ChatApp</h1>
          </div>

          {/* Header */}
          <div className="modern-header">
            <h1 className="modern-title">Welcome Back</h1>
            <p className="modern-subtitle">Sign in to continue your conversation</p>
          </div>

          {/* Login Form */}
          <form className="modern-login-form" onSubmit={onHandleLogin}>
            
            {/* Email Input */}
            <div className="modern-input-group">
              <div className="input-icon">✉️</div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modern-form-input"
              />
            </div>

            {/* Password Input */}
            <div className="modern-input-group">
              <div className="input-icon">🔒</div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="modern-form-input"
              />
              <button
                type="button"
                className="modern-eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="modern-forgot-password-container">
              <Link to="/forgot-password" className="modern-forgot-password">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`modern-login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="button-spinner"></div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="divider">
              <span>or</span>
            </div>

            {/* Signup Link */}
            <div className="modern-signup-container">
              <span className="signup-text">New to ChatApp? </span>
              <Link to="/signup" className="modern-signup-link">Create Account</Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
