import './App.css';
import { useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import React from 'react';
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
  ); d
}

export default App;