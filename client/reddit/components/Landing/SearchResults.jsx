import { Stack } from "@mui/material";
import { useSearchParams } from 'react-router-dom';import SbtnList from "./SbtnList";
import MainBar from "../content/main-bar/MainBar";
import CommunityList from "./CommunityList";
import CommentList from "./CommentList";
import UserList from "./UserList";
import { useState } from "react";
export default function SearchResults(){
const [searchParams] = useSearchParams();
const q = searchParams.get('q');
const [current , setCurrent] = useState(1)
return(
    <Stack direction="column">
       <SbtnList setCurrent = {setCurrent}/>
      {current == 1 &&   <MainBar key = {q} search = {q}/>}
      {current == 2 &&   <CommunityList search= {q}/>}
      {current == 3 &&   <CommentList search = {q}/>}
      {current == 4 &&   <UserList key = {q} search = {q}/>}
    </Stack>
)
}