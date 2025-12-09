import { Stack } from "@mui/material";
import FilterBtn from "./FilterBtn";
import { useState } from "react";
import Posts from '../content/posts/Posts'
export default function PostsSection(props){
    const {posts , getPosts} = props
    return(
        <Stack direction='column'>
            <FilterBtn getPosts = {getPosts}/>
            <Stack direction='column'>
                <Posts posts = {posts}/>
            </Stack>
        </Stack>
    )

}