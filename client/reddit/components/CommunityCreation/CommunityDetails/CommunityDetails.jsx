import { useState } from "react";
import CommunityDescription from "./CommunityDescription";
import CommunityName from "./CommunityName";
import { Stack } from "@mui/material";
import Preview from "./Preveiw";

export default function CommunitnyDetails(props){
    const {communityDetails , setCommunityDetails , communityVisuals} = props
    return(
        <>
         <h2 style={{marginBottom : 2}}>Tell us about your community</h2>
                <p style={{opacity : 0.6}}>A name and description help people understand what your community is all about.</p>
        <Stack direction='row' sx={{minHeight : "100%"}}>
            <Stack direction='column' justifyContent='space-between'>
                <CommunityName setCommunityDetails = {setCommunityDetails}/>
                <span style={{alignSelf : 'flex-end', marginRight : 23 , opacity : 0.7}}>{communityDetails.name.length}/21</span>
                <CommunityDescription  setCommunityDetails = {setCommunityDetails}/>
                <span style={{alignSelf : 'flex-end', marginRight : 23 , opacity : 0.7}}>{communityDetails.description.length}</span>
            </Stack>
            <Preview communityDetails = {communityDetails} communityVisuals = {communityVisuals}/>
        </Stack>

        </>
    )
    
}