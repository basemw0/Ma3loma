import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "./Header";
import CommunityDetails from "../CommunityPage/CommunityDetails";
import PostsSection from "./PostsSection";
import api from "../../src/api/axios";
import {Button} from "@mui/material";
import { useParams } from "react-router-dom";

export default function CommunityPage() {
    const {communityId} = useParams()
    const [posts, setPosts] = useState([]);
    const [currentFilter , setCurrentFilter] = useState("best")
    const [num , setNum] = useState(1)
    const [community, setCommunity] = useState(null);
    const [joined, setJoined] = useState('');

    const getCommunity = async (id) => {
        try {
            let response = await api.get("http://localhost:3000/api/communities/" + id);
            let data = response.data;
            setCommunity(data); 
            setJoined(data.isMember? "Joined" : "Not Joined");
        } 
        catch (e) {
            alert("Error: " + e.message);
        }
    };

    const getPosts = async (id , num , filter) => {
        let response = await api.get("http://localhost:3000/api/posts/community/" + id + "?page=" + num + "&filter=" + filter);
        console.log(response.data)
        if(num ===1){
            setPosts(response.data);
        }
        else{
        setPosts((prev)=>{
            return [...prev , ...response.data]
        });
        }
    };
    const handleShowMore = () => {
        getPosts(communityId, num, currentFilter);
        setNum(prev => prev + 1); 
    };

    useEffect(() => {
        getCommunity(communityId);
        getPosts(communityId , num , currentFilter);
        setNum(2)
    }, []);

    if (!community) return <div>Loading...</div>;
    if (!posts) return <div>Loading...</div>;
    return(
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Header community={community} setJoined={setJoined} joined={joined} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{display : 'flex' , flexDirection :'column', alignItems : 'center', justifyContent:'center'}}>
                <PostsSection posts={posts} getPosts = {getPosts} setNum = {setNum} communityId = {communityId} setCurrentFilter = {setCurrentFilter}/>
                 <Button onClick={handleShowMore} variant="text">Show more</Button>
                </Box>
                <CommunityDetails community={community} />
            </Box>
        </Box>
    );
}