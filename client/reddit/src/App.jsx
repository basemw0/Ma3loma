import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from 'react'
import './App.css'
<<<<<<< Updated upstream
import CreationWizard from '../components/CommunityCreation/CreationWizard'
=======
import CommunityDetails from '../components/CommunityCreation/CommunityDetails/CommunityDetails'
import Login from '../components/Pages/Login';
import Signup from "../components/Pages/Signup";
>>>>>>> Stashed changes

function App() {
    return(
        <>
<<<<<<< Updated upstream
        <CreationWizard/>
=======
        <CommunityDetails/>
        <Login/>
        <Signup/>
>>>>>>> Stashed changes
        </>

    )
  
}

export default App
