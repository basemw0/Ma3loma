import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../../src/api/axios";

import UserHeader from "./UserHeader";
import UserDetails from "./UserDetails";
import PostsSection from "./PostsSection";
import EditPost from "../edit-post/EditPost";

export default function UserProfile() {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    // 1. FIX: Default to "best" to match FilterBtn.jsx default
    const [currentFilter, setCurrentFilter] = useState("best");
    const [num, setNum] = useState(1);
    const [user, setUser] = useState(null);

    const getUser = async (id) => {
        try {
            console.log(id)
            let response = await api.get("/api/users/" + id);
            setUser(response.data);
        } catch (e) {
            console.error("Error fetching user:", e);
        }
    };

    // Fetch User Posts
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

    // Initial Load (User Info)
    useEffect(() => {
        if(userId){
            getUser(userId);
            setNum(1); 
            // We can do an initial fetch here if needed, 
            // but the useEffect below handles num=1
        }
    }, [userId]);

    // Fetch posts loop
    useEffect(() => {
        if(userId){
            getPosts(userId, num, currentFilter);
        }
        // 2. FIX: Remove 'currentFilter' from dependency array.
        // FilterBtn.jsx calls getPosts() manually when filter changes.
        // We only want THIS effect to run when 'num' changes (Pagination) or 'userId' changes.
    }, [userId, num]); 


    if (!user) return <Box sx={{p:4}}>Loading Profile...</Box>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <UserHeader user={user} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, p: {xs:0, md:3} }}>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
                    <PostsSection 
                        posts={posts} 
                        getPosts={getPosts} 
                        // 3. FIX: Pass a dummy function for setNum.
                        // FilterBtn tries to setNum(2) which causes skips/race conditions.
                        // We ignore that, so num stays 1. "Show More" will verify updates to 2 later.
                        setNum={() => {}} 
                        communityId={userId} 
                        setCurrentFilter={setCurrentFilter} 
                        community="no" 
                    />
                    <Button onClick={handleShowMore} variant="text" sx={{my: 2}}>
                        Show more
                    </Button>
                </Box>

                <UserDetails user={user} />
            </Box>
        </Box>
    );
}