// src/components/RegistrationModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationModal = () => {
  const navigate = useNavigate();

  return (
    <div className="registration-modal">
      <h2>Join Us to Access Courses</h2>
      <p>Please register or login to explore our courses.</p>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
      <button onClick={() => navigate('/login')}>Login</button>
    </div>
  );
};

export default RegistrationModal;