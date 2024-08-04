// src/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword,signOut } from 'firebase/auth';
import { notification } from 'antd';
import UploadVideo from '../components/UploadVideo';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

const Login = (props) => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loggedIn, setLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
        const token = await user.getIdToken();
        setAuthToken(token);
      console.log("check token", token)  // Lấy token xác thực
        setError("");

      alert("login success");
        // Gọi hàm để truyền token lên component cha
    } catch (error) {
      setError(error.message);
    }
    };
     const handleLogout = async () => {
    try {
        await signOut(auth);
       notification.success({
            message: "Logout",
            description: "logout success"
        });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button onClick={handleLogout} className='btn btn-warning'> Logout</button>
 
          <>
              <ImageUpload authToken={authToken} />
          </>
      </div>

  );
};

export default Login;
