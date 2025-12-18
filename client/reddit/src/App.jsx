
import './App.css';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import CommunitiesPage from '../components/DisplayCommunities/CommunitiesPage'
import CommunityPage from '../components/CommunityPage/CommunityPage';
import ExploreCommunities from '../components/ExploreCommunities/ExploreCommunities'
import EditPost from '../components/edit-post/EditPost'; // keep only this one
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Utils/Layout';
import CreatePost from '../components/create-post/CreatePost'
import Content from '../components/content/Content';
import Login from '../components/Pages/Login/'
import Signup from '../components/Pages/Signup';
import ForgotPassword from '../components/Pages/ForgotPassword';
import ResetPassword from '../components/Pages/ResetPassword';
import Landing from '../components/Landing/Landing';
import PostDetails from '../components/post-details/PostDetails';
import CreationWizard from '../components/CommunityCreation/CreationWizard';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext';
import AuthModal from '../components/Utils/AuthModal';
import api from '../src/api/axios';
import SearchResults from '../components/Landing/SearchResults';
import UserProfile from '../components/UserPage/UserProfile';

import Saved from '../components/Saved';
const AxiosInterceptor = ({ children }) => {
  const { openLogin } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          openLogin();
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [openLogin, navigate]);

  return children;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();



  return (
    <>
      <AuthModalProvider>
        <AxiosInterceptor>
          <AuthModal />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Content />} />
              <Route path="api/home" element={<Content />} />
              <Route path="api/posts/saved" element={<Saved />} />
              <Route path="api/search" element={<SearchResults />} />
              <Route path="api/communities/:communityId" element={<CommunityPage />} />
              <Route path="api/communities/best/:number" element={<CommunitiesPage />} />
              <Route path="api/communities/category" element={<ExploreCommunities />} />
              <Route path="api/posts/:communityID/create" element={<CreatePost />} />
              <Route path="api/posts/:postId/edit" element={<EditPost />} /> {/* EDIT POST */}
              <Route path="api/posts/:postId" element={<PostDetails />} />
              <Route path="api/communities/create" element={<CreationWizard />} />
              <Route path="api/profile/:userId" element={<UserProfile />} />
            </Route>
          </Routes>
        </AxiosInterceptor>
      </AuthModalProvider>
    </>
  );
}

export default App;
