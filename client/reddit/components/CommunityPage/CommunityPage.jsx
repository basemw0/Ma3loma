import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import CommunityDetails from "../CommunityPage/CommunityDetails";
import PostsSection from "./PostsSection";
import axios from "axios";
import {Button} from "@mui/material";
import { useParams } from "react-router-dom";

export default function CommunityPage() {
    const {communityId} = useParams()
    const [posts, setPosts] = useState([]);
    const [num , setNum] = useState(1)
    const [community, setCommunity] = useState(null);
    const [joined, setJoined] = useState('');

    const getCommunity = async (id) => {
        try {
            let response = await axios.get("http://localhost:3000/api/communities/" + id);
            let data = response.data;
            setCommunity(data); 
            setJoined(data.isMember? "Joined" : "Not Joined");
        } 
        catch (e) {
            alert("Error: " + e.message);
        }
    };

    const getPosts = async (id , num) => {
        let response = await axios.get("http://localhost:3000/api/posts/community/" + id + "?page=" + num);
        setPosts((prev)=>{
            return [...prev , ...response.data]
        });
        setNum((prev)=>{
            return prev+1
        })
    };

    useEffect(() => {
        getCommunity(communityId);
        getPosts(communityId , num);
    }, []);

    if (!community) return <div>Loading...</div>;
    if (!posts) return <div>Loading...</div>;
    return(
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Header community={community} setJoined={setJoined} joined={joined} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{display : 'flex' , flexDirection :'column', alignItems : 'center', justifyContent:'center'}}>
                <PostsSection posts={posts} />
                 <Button onClick={()=>{getPosts(communityId , num)}} variant="text">Show more</Button>
                </Box>
                <CommunityDetails community={community} />
            </Box>
        </Box>
    );
}