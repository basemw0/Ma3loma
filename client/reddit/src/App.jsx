import './App.css';
import React from 'react';
import CommunityDetails from '../components/CommunityCreation/CommunityDetails/CommunityDetails';
import CommunitiesPage from '../components/DisplayCommunities/CommunitiesPage'
import CommunityPage from '../components/CommunityPage/CommunityPage';
import ExploreCommunities from '../components/ExploreCommunities/ExploreCommunities'
import { BrowserRouter } from "react-router-dom";
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Layout from '../components/Utils/Layout';
import Content from '../components/content/Content';



function App() {
  return (
    <>
     <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path="api/communities/:communityId" element={<CommunityPage />} />
        <Route path="api/home" element={<Content />} />
        <Route path="api/communities/best/:number" element= {<CommunitiesPage />} />
        <Route path="api/communities/category" element= {<ExploreCommunities />} />
      </Route>
      </Routes>
    </>
  );
}
export default App;
