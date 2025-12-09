import { Stack } from "@mui/material";
import FilterBtn from "./FilterBtn";
import { useState } from "react";
import Posts from '../content/posts/Posts'
export default function PostsSection(props){
    const {posts ,  getPosts ,setNum ,communityId , setCurrentFilter} = props
    return(
        <Stack direction='column'>
            <FilterBtn getPosts = {getPosts} setNum = {setNum} communityId = {communityId} setCurrentFilter = {setCurrentFilter}/>
            <Stack direction='column'>
                <Posts posts = {posts}/>
            </Stack>
        </Stack>
    )

}