import { useEffect } from "react";
import { useState } from "react";
import "./MainBar.css";
import Posts from "../posts/Posts";
import api from "../../../src/api/axios";
import { Button } from "@mui/material";
import FilterBtn from '../../CommunityPage/FilterBtn'

export default function MainBar() {
  const [posts , setPosts] = useState([])
  const [currentFilter , setCurrentFilter] = useState("best")
  const [num , setNum] = useState(1)
  const getPosts = async (num , filter) => {
        let response = await api.get("/api/posts/home?page=" + num + "&filter=" + filter);
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
        getPosts(num, currentFilter);
        setNum(prev => prev + 1); 
    };

    useEffect(() => {
        getPosts(num , currentFilter);
        setNum(2)
    }, []);
  if (!posts) return <div>Loading...</div>;
  return (
    <div className="main-bar">
      <FilterBtn getPosts = {getPosts} setNum = {setNum} setCurrentFilter = {setCurrentFilter} community = "no"/>
      <Posts posts = {posts} />
      <Button onClick={handleShowMore} variant="text">Show more</Button>
    </div>
  );
}