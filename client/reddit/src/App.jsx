import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import CommunityDetails from '../components/CommunityCreation/CommunityDetails/CommunityDetails';
import Login from '../components/Pages/Login';
import CommunitiesPage from '../components/DisplayCommunities/CommunitiesPage'
import Signup from "../components/Pages/Signup";
import CommunityPage from '../components/CommunityPage/CommunityPage';
import ExploreCommunities from '../components/ExploreCommunities/ExploreCommunities'
import CreationWizard from '../components/CommunityCreation/CreationWizard';
import Landing from "../components/Landing/Landing";
import CreatePost from '../components/create-post/CreatePost';
import EditPost from '../components/edit-post/EditPost';
import PostDetails from '../components/post-details/PostDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/post/:pid" element={<PostDetails />} />
      </Routes>
    </Router>
  );
}
export default App;
