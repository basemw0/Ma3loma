import React, { createContext, useState, useContext } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("login"); // 'login' or 'signup'

  const openLogin = () => {
    setView("login");
    setIsOpen(true);
  };

  const openSignup = () => {
    setView("signup");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ isOpen, view, setView, openLogin, openSignup, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);