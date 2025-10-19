


// import React, { useState } from "react";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { auth } from "../../firebase/config";
// import { supabase } from "../../firebase/supabaseClient";
// import { useNavigate, Link } from "react-router-dom";
// import './SignUp.css'; // New CSS file

// export default function SignUp() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [dob, setDob] = useState("");
//   const [genderValue, setGenderValue] = useState("");
//   const [maritalValue, setMaritalValue] = useState("");
//   const [country, setCountry] = useState("");
//   const [profileImage, setProfileImage] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");

//   const genderItems = [
//     { label: "Male", value: "male" },
//     { label: "Female", value: "female" },
//     { label: "Other", value: "other" },
//   ];

//   const maritalItems = [
//     { label: "Single", value: "single" },
//     { label: "Married", value: "married" },
//     { label: "Divorced", value: "divorced" },
//   ];

//   const pickImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setProfileImage(URL.createObjectURL(file));

//     try {
//       const filePath = `${Date.now()}_${file.name}`;
//       const { error } = await supabase.storage
//         .from("signUp_Images")
//         .upload(filePath, file, { upsert: true });
//       if (error) throw error;
//       const { data } = supabase.storage.from("signUp_Images").getPublicUrl(filePath);
//       setUploadedImageUrl(data.publicUrl);
//     } catch (err) {
//       console.error(err);
//       alert("Image upload failed");
//     }
//   };

//   const calculateAge = (birthDate) => {
//     const today = new Date();
//     const birth = new Date(birthDate);
//     let age = today.getFullYear() - birth.getFullYear();
//     const m = today.getMonth() - birth.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//     return age;
//   };

//   const onHandleSignup = async () => {
//     if (!email || !password || !username || !dob || !genderValue || !maritalValue || !country || !uploadedImageUrl) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (calculateAge(dob) < 18) {
//       alert("You must be at least 18 years old.");
//       return;
//     }

//     try {
//       const cred = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(cred.user, { displayName: username });

//       const { error } = await supabase.from("users").upsert([{
//         id: cred.user.uid,
//         email: cred.user.email,
//         password,
//         avatar: uploadedImageUrl,
//         name: username,
//         country,
//         gender: genderValue,
//         maritalstatus: maritalValue,
//         dateofbirth: dob,
//         age: calculateAge(dob),
//         about: "Available",
//         isverifiedprofile: true,
//       }]);
//       if (error) throw error;

//       alert("Signup successful!");
//       navigate("/");
//     } catch (err) {
//       alert("Signup failed: " + err.message);
//     }
//   };

//   return (
//     <div className="signup-page">
//       <div className="safe-area">
//         <div className="signup-container">
//           <h1 className="title">Sign Up</h1>
//           <p className="subtitle">Create your account and start your journey</p>

//           <div className="profile-upload">
//             <label htmlFor="profile-upload">
//               {profileImage ? (
//                 <img src={profileImage} alt="profile" className="profile-preview" />
//               ) : (
//                 <div className="placeholder">👤</div>
//               )}
//             </label>
//             <input
//               id="profile-upload"
//               type="file"
//               accept="image/*"
//               onChange={pickImage}
//               style={{ display: "none" }}
//             />
//           </div>

//           <div className="form-fields">
//             <input type="text" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} />
//             <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//             <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
//             <select value={genderValue} onChange={(e) => setGenderValue(e.target.value)}>
//               <option value="">Select Gender</option>
//               {genderItems.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
//             </select>
//             <select value={maritalValue} onChange={(e) => setMaritalValue(e.target.value)}>
//               <option value="">Select Marital Status</option>
//               {maritalItems.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
//             </select>
//             <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
//           </div>

//           <button onClick={onHandleSignup}>Sign Up</button>

//           <p className="login-link">
//             Already have an account? <Link to="/">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }






import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { supabase } from "../../firebase/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { 
  IoCamera, 
  IoPerson, 
  IoMail, 
  IoLockClosed, 
  IoCalendar, 
  IoMaleFemale, 
  IoHeart, 
  IoGlobe,
  IoArrowBack 
} from "react-icons/io5";
import './SignUp.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [maritalValue, setMaritalValue] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const genderItems = [
    { label: "Male", value: "male", icon: "👨" },
    { label: "Female", value: "female", icon: "👩" },
    { label: "Other", value: "other", icon: "😊" },
  ];

  const maritalItems = [
    { label: "Single", value: "single", icon: "💫" },
    { label: "Married", value: "married", icon: "💑" },
    { label: "Divorced", value: "divorced", icon: "💔" },
    { label: "In a Relationship", value: "relationship", icon: "💕" },
  ];

  const countries = [
    "India", "United States", "Canada", "United Kingdom", "Australia", 
    "Germany", "France", "Japan", "Brazil", "South Africa"
  ];

  const pickImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }
    
    setProfileImage(URL.createObjectURL(file));

    try {
      const filePath = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("signUp_Images")
        .upload(filePath, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("signUp_Images").getPublicUrl(filePath);
      setUploadedImageUrl(data.publicUrl);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const validateStep1 = () => {
    return username && email && password && profileImage;
  };

  const validateStep2 = () => {
    return dob && genderValue && maritalValue && country;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const onHandleSignup = async () => {
    if (!validateStep1() || !validateStep2()) {
      alert("Please fill all required fields");
      return;
    }

    if (calculateAge(dob) < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { 
        displayName: username,
        photoURL: uploadedImageUrl 
      });

      const { error } = await supabase.from("users").upsert([{
        id: cred.user.uid,
        email: cred.user.email,
        password,
        avatar: uploadedImageUrl,
        name: username,
        country,
        gender: genderValue,
        maritalstatus: maritalValue,
        dateofbirth: dob,
        age: calculateAge(dob),
        about: "Hey there! I'm new here! 👋",
        isverifiedprofile: true,
        isactivestatus: true,
        totalgold: 100, // Starting bonus
        totaldiamond: 10,
        created_at: new Date().toISOString(),
      }]);
      
      if (error) throw error;

      alert("🎉 Welcome aboard! Your account has been created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === 'auth/email-already-in-use') {
        alert("This email is already registered. Please try logging in.");
      } else if (err.code === 'auth/weak-password') {
        alert("Password is too weak. Please choose a stronger password.");
      } else if (err.code === 'auth/invalid-email') {
        alert("Please enter a valid email address.");
      } else {
        alert("Signup failed: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = () => (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: currentStep === 1 ? '50%' : '100%' }}
        ></div>
      </div>
      <div className="progress-steps">
        <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</span>
        <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</span>
      </div>
    </div>
  );

  const Step1 = () => (
    <div className="step-content">
      <h2 className="step-title">Create Your Profile</h2>
      <p className="step-subtitle">Let's start with the basics</p>

      {/* Profile Upload */}
      <div className="profile-upload-section">
        <label htmlFor="profile-upload" className="profile-upload-label">
          <div className="profile-image-container">
            {profileImage ? (
              <img src={profileImage} alt="profile" className="profile-preview" />
            ) : (
              <div className="profile-placeholder">
                <IoCamera className="camera-icon" />
                <span>Add Photo</span>
              </div>
            )}
            <div className="profile-overlay">
              <IoCamera className="overlay-icon" />
            </div>
          </div>
        </label>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          onChange={pickImage}
          style={{ display: "none" }}
        />
        <p className="upload-hint">Click to upload your profile picture</p>
      </div>

      {/* Form Fields */}
      <div className="form-fields">
        <div className="input-group">
          <IoPerson className="input-icon" />
          <input 
            type="text" 
            placeholder="Full Name" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="modern-input"
          />
        </div>

        <div className="input-group">
          <IoMail className="input-icon" />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="modern-input"
          />
        </div>

        <div className="input-group">
          <IoLockClosed className="input-icon" />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="modern-input"
          />
          <button 
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <button 
        className="next-button"
        onClick={nextStep}
        disabled={!validateStep1()}
      >
        Continue
        <span className="button-arrow">→</span>
      </button>
    </div>
  );

  const Step2 = () => (
    <div className="step-content">
      <h2 className="step-title">Personal Details</h2>
      <p className="step-subtitle">Tell us more about yourself</p>

      <div className="form-fields">
        {/* Date of Birth */}
        <div className="input-group">
          <IoCalendar className="input-icon" />
          <input 
            type="date" 
            value={dob} 
            onChange={(e) => setDob(e.target.value)}
            className="modern-input"
            max={new Date().toISOString().split('T')[0]}
          />
          {dob && (
            <span className="age-badge">{calculateAge(dob)} years old</span>
          )}
        </div>

        {/* Gender Selection */}
        <div className="selection-group">
          <label className="selection-label">
            <IoMaleFemale className="label-icon" />
            Gender
          </label>
          <div className="option-grid">
            {genderItems.map((item) => (
              <button
                key={item.value}
                className={`option-button ${genderValue === item.value ? 'selected' : ''}`}
                onClick={() => setGenderValue(item.value)}
                type="button"
              >
                <span className="option-icon">{item.icon}</span>
                <span className="option-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Marital Status */}
        <div className="selection-group">
          <label className="selection-label">
            <IoHeart className="label-icon" />
            Relationship Status
          </label>
          <div className="option-grid">
            {maritalItems.map((item) => (
              <button
                key={item.value}
                className={`option-button ${maritalValue === item.value ? 'selected' : ''}`}
                onClick={() => setMaritalValue(item.value)}
                type="button"
              >
                <span className="option-icon">{item.icon}</span>
                <span className="option-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Country Selection */}
        <div className="input-group">
          <IoGlobe className="input-icon" />
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            className="modern-input"
          >
            <option value="">Select Country</option>
            {countries.map((countryName) => (
              <option key={countryName} value={countryName}>{countryName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="step-actions">
        <button 
          className="back-button"
          onClick={prevStep}
          type="button"
        >
          <IoArrowBack className="back-icon" />
          Back
        </button>
        <button 
          className="signup-button"
          onClick={onHandleSignup}
          disabled={!validateStep2() || loading}
        >
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              Complete Sign Up
              <span className="button-sparkle">✨</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="modern-signup-page">
      {/* Animated Background */}
      <div className="background-gradient">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
      </div>

      <div className="safe-area">
        <div className="modern-signup-container">
          {/* Header */}
          <div className="signup-header">
            <button 
              className="back-home-button"
              onClick={() => navigate("/")}
            >
              <IoArrowBack />
            </button>
            <div className="header-content">
              <h1 className="main-title">Join Our Community</h1>
              <p className="main-subtitle">Start your journey with amazing people</p>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressBar />

          {/* Form Steps */}
          <div className="form-container">
            {currentStep === 1 ? <Step1 /> : <Step2 />}
          </div>

          {/* Footer */}
          <div className="signup-footer">
            <p className="footer-text">
              Already have an account? 
              <Link to="/" className="login-link"> Sign In</Link>
            </p>
            <p className="terms-text">
              By signing up, you agree to our 
              <a href="#" className="terms-link"> Terms & Conditions</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}