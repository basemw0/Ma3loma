import { Stack } from "@mui/material";
import FilterBtn from "./FilterBtn";
import { useState } from "react";
import MockPost from "./mockPost";
export default function PostsSection(props){
    const {posts , getPosts} = props
    return(
        <Stack direction='column'>
            <FilterBtn getPosts = {getPosts}/>
            <Stack direction='column'>
                {posts.map((post)=>{
                    return <MockPost post = {post}/>
                })}
            </Stack>
        </Stack>
    )

}