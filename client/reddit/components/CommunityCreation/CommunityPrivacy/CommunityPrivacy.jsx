import { useState } from "react";
import { Stack } from "@mui/material";
import PrivacyRadioButtons from "./PrivacyRadioButtons";
export default function CommunityPrivacy(){
    const [privacy , setPrivacy] = useState('public')
    return(
        <Stack direction='column'>
            <Stack direction='column'>
                <h2 style={{marginBottom : 2}}>What kind of community is this?</h2>
                <p style={{opacity : 0.6}}>Decide who can view and contribute in your community. Only public communities show up in search. Important: Once set, you will need to submit a request to change your community type.</p>
            </Stack>
            <PrivacyRadioButtons privacy = {privacy} setPrivacy = {setPrivacy}/>
        </Stack>
    )



}