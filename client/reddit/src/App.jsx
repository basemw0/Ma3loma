import './App.css';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import CommunitiesPage from '../components/DisplayCommunities/CommunitiesPage'
import CommunityPage from '../components/CommunityPage/CommunityPage';
import ExploreCommunities from '../components/ExploreCommunities/ExploreCommunities'
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Layout from '../components/Utils/Layout';
import CreatePost from '../components/create-post/CreatePost'
import Content from '../components/content/Content';
import Login from '../components/Pages/Login';
import Signup from '../components/Pages/Signup';
import ForgotPassword from '../components/Pages/ForgotPassword';
import ResetPassword from '../components/Pages/ResetPassword';
import Landing from '../components/Landing/Landing';
import EditPost from '../components/edit-post/EditPost';
import PostDetails from '../components/post-details/PostDetails';
import CreationWizard from '../components/CommunityCreation/CreationWizard';

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
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/" element={<Layout/>}>
        <Route index element={<Content />} />
        <Route path="api/home" element={<Content />} />
        <Route path="api/communities/:communityId" element={<CommunityPage />} />
        <Route path="api/communities/best/:number" element={<CommunitiesPage />} />
        <Route path="api/communities/category" element={<ExploreCommunities />} />
        <Route path="api/posts/:communityID/create" element={<CreatePost />} />
        <Route path="api/posts/:postId/edit" element={<EditPost />} />
        <Route path="api/posts/:postId" element={<PostDetails />} />
        <Route path="api/communities/create" element={<CreationWizard />} />
      </Route>
      </Routes>
    </>
  ); 
}
export default App;