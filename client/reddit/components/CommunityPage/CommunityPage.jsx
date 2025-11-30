import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import CommunityDetails from "../CommunityPage/CommunityDetails";
import PostsSection from "./PostsSection";
import axios from "axios";

export default function CommunityPage({ communityId }) {

    const [posts, setPosts] = useState([]);
    const [community, setCommunity] = useState(null);
    const [joined, setJoined] = useState('');

    const getCommunity = async (id) => {
        try {
            let response = await axios.get("http://localhost:3000/api/communities/" + id);
            let data = response.data;
            setCommunity(data);      // <<< IMPORTANT
            setJoined(data.isMember ? "Joined" : "Not Joined");
        } 
        catch (e) {
            alert("Error: " + e.message);
        }
    };

    const getPosts = async (id) => {
        let response = await axios.get("http://localhost:3000/api/posts/community/" + id);
        setPosts(response.data);
    };

    useEffect(() => {
        getCommunity(communityId);
        getPosts(communityId);
    }, []);

    if (!community) return <div>Loading...</div>;   // <<< IMPORTANT
    return(
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Header community={community} setJoined={setJoined} joined={joined} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* <PostsSection posts={posts} /> */}
                <CommunityDetails community={community} />
            </Box> 
        </Box>
    );
}
