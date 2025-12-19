import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../src/api/axios";

import UserHeader from "./UserHeader";
import UserDetails from "./UserDetails";
import PostsSection from "./PostsSection";
import EditPost from "../edit-post/EditPost";

import ChatWindow from "../Chat/ChatWindow"; 

export default function UserProfile() {
    const params = useParams(); 
    const { userId } = params;
    
    const [posts, setPosts] = useState([]);
    const [currentFilter, setCurrentFilter] = useState("best");
    const [num, setNum] = useState(1);
    const [user, setUser] = useState(null);

    const [isChatOpen, setIsChatOpen] = useState(false);

    const getUser = async (id) => {
        try {
            let response = await api.get("/api/users/" + id);
            setUser(response.data);
        } catch (e) {
            console.error("Error fetching user:", e);
        }
    };

    const getPosts = async (id, pageNum, filter) => {
        try {
            let response = await api.get("/api/posts/user/" + id + "?page=" + pageNum + "&filter=" + filter);
            
            if (pageNum === 1) {
                setPosts(response.data);
            } else {
                setPosts((prev) => [...prev, ...response.data]);
            }
        } catch (e) {
            console.error("Error fetching posts:", e);
        }
    };

    const handleShowMore = () => {
        setNum((prev) => prev + 1);
    };

    useEffect(() => {
        if(userId){
            getUser(userId);
            setNum(1); 
            setIsChatOpen(false); 
        }
    }, [userId]);

    useEffect(() => {
        if(userId){
            getPosts(userId, num, currentFilter);
        }
    }, [userId, num]); 

    if (!user) return <Box sx={{p:4}}>Loading Profile...</Box>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <UserHeader user={user} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, p: {xs:0, md:3} }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
                    <PostsSection 
                        posts={posts} 
                        getPosts={getPosts} 
                        setNum={() => {}} 
                        communityId={userId} 
                        setCurrentFilter={setCurrentFilter} 
                        community="no" 
                    />
                    <Button onClick={handleShowMore} variant="text" sx={{my: 2}}>
                        Show more
                    </Button>
                </Box>

                {}
                <UserDetails 
                    user={user} 
                    onChatClick={() => setIsChatOpen(prev => !prev)} 
                />
            </Box>

            {}
            {isChatOpen && (
                <ChatWindow 
                    recipient={user} 
                    onClose={() => setIsChatOpen(false)} 
                />
            )}
        </Box>
    );
}