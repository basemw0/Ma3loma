import { useState } from "react";
import CommunityDescription from "./CommunityDescription";
import CommunityName from "./CommunityName";
import { Stack } from "@mui/material";
import Preview from "./Preveiw";

export default function CommunityDetails(){
    const [communityDetails , setCommunityDetails] = useState({name : '' , description : ''})
    return(
        <>
         <h2 style={{marginBottom : 2}}>Tell us about your community</h2>
                <p style={{opacity : 0.6}}>A name and description help people understand what your community is all about.</p>
        <Stack direction='row'>
            <Stack direction='column' justifyContent='space-between'>
                <CommunityName setCommunityDetails = {setCommunityDetails}/>
                <CommunityDescription  setCommunityDetails = {setCommunityDetails}/>
            </Stack>
            <Preview communityDetails = {communityDetails}/>
        </Stack>

        </>
        
    )
    
}