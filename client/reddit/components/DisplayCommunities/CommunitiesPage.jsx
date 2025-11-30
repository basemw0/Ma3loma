import { useState } from 'react';
import { generateMockCommunities } from '../../mockData/mockCommunities';
import Communities from './Communities';
import SearchBar from './SearchBar';
import PageNav from './PageNav';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect } from 'react';
export default function CommunitiesPage(){
    const fetchCommnities = async (filter = "All")=>{
        let response = 0
        try{
        if(filter == "All"){
        response = await axios.get("https://localhost:5000/api/communities")
        alert(response.data)
        }
        else{
            response = await axios.get(`https://localhost:5000/api/communities?q=${filter}`)
        }}
        catch(e){
            alert("Error : " + e.message)
        }
        setCommunitiesArr(response)
    }
    const [communitiesArr , setCommunitiesArr] = useState([])
    const [navPage , setNavPage] = useState(1)
    useEffect(() => {
        async function load() {
            await fetchCommnities(); 
        }
        load();
        }, []);
    return(
        <Box sx={{display : 'flex', width : '100%' , minHeight : '80vh' , flexDirection : 'column'  , alignItems : 'center'}}>
            <SearchBar setNavPage = {setNavPage} fetchCommnities = {fetchCommnities}/>
            <Communities communitiesArr = {communitiesArr} />
            <PageNav navPage = {navPage} setNavPage = {setNavPage} count ={1500} setCommunitiesArr = {setCommunitiesArr}/>
        </Box>
    )

}