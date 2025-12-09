import './App.css';
import { useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import React from 'react';

// Import Pages
import Login from '../components/Pages/Login'; // Adjust path as needed
import Signup from "../components/Pages/Signup"; // Adjust path as needed
import ForgotPassword from "../components/Pages/ForgotPassword";
import ResetPassword from "../components/Pages/ResetPassword"; // <--- NEW IMPORT

// ... (Keep your other component imports like Landing, etc.) ...
import Landing from "../components/Landing/Landing";
import CommunitiesPage from '../components/DisplayCommunities/CommunitiesPage'
import CommunityPage from '../components/CommunityPage/CommunityPage';
import ExploreCommunities from '../components/ExploreCommunities/ExploreCommunities'
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Layout from '../components/Utils/Layout';
import CreatePost from '../components/create-post/CreatePost'
import Content from '../components/content/Content';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Google Auth Logic
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, "/");
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <>
     <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="api/communities/:communityId" element={<CommunityPage />} />
        <Route path="api/home" element={<Content />} />
        <Route path="api/communities/best/:number" element= {<CommunitiesPage />} />
        <Route path="api/communities/category" element= {<ExploreCommunities />} />
        <Route path="api/posts/:communityID/create" element= {<CreatePost />} />
      </Route>
      </Routes>
    </>
  );
    
}

export default App;