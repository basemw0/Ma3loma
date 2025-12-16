import { Stack } from "@mui/material";
import { useSearchParams } from 'react-router-dom';import SbtnList from "./SbtnList";
import MainBar from "../content/main-bar/MainBar";
import CommunityList from "./CommunityList";
import CommentList from "./CommentList";
export default function SearchResults(){
const [searchParams] = useSearchParams();
const q = searchParams.get('q');
return(
    <Stack direction="column">
       <SbtnList/>
       {/* <MainBar key={q} search = {q}/> */}
       {/* <CommunityList search = {q}/> */}
       <CommentList search = {q}/>
    </Stack>

)
}