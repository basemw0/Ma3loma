import { Button, Stack } from "@mui/material";
import Community from "../DisplayCommunities/Community";
import api from "../../src/api/axios";
export default function CommunityBox(props){
    const {community , retrieveCommunities}  = props
    const handleClick = async()=>{
        if(community.isMember == 1){
            await api.post(`http://localhost:3000/api/communities/${community._id}/join`, {
                    action: 0
                });
            alert("Unjoined")
        }
        else{
            //Axios request
            await api.post(`http://localhost:3000/api/communities/${community._id}/join`, {
                    action: 1
                });
            alert("Joined")
        }
        await retrieveCommunities()
    }
    return(
        <Stack direction='row' justifyContent= 'space-between' sx={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "12px 16px",
            margin: 0.5,
            backgroundColor: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",   // subtle lift
            }}>
            <Community Cnum = 'no' communityName = {community.name}  communityDescription = {community.description} numOfMembers = {community.numberOfMembers} imgUrl = {community.icon} communityId = {community._id} />
            <Button 
            onClick={()=>{handleClick()}}
            sx={{
                backgroundColor: community.isMember == 1? '#e0e0e0' : '#fff', // grey if active, white if not
                color: '#000',
                border: community.isMember === 1 ? 'none' : '1px solid #000',   // no border if active
                borderRadius: '20px',                         // roundish
                padding: '4px 12px',                          // compact padding
                minWidth: 100,                                  // fit text
                width: 'auto',
                textTransform: 'none',
                fontSize: '14px',
                height : '30px',
                cursor: 'pointer',
                '&:hover': {
                backgroundColor: community.isMember == 1? '#d6d6d6' : '#f0f0f0', // subtle hover effect
                },
                }}>
                {community.isMember == 1? "Joined" :"Join"}
            </Button>

        </Stack>
    )

}