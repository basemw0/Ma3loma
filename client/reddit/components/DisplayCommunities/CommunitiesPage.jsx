import { useState } from 'react';
import { generateMockCommunities } from '../../mockData/mockCommunities';
import Communities from './Communities';
import SearchBar from './SearchBar';
import PageNav from './PageNav';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect } from 'react';
export default function CommunitiesPage(){
    const fetchCommunities = async (filter = "All")=>{
        let response = 0
        try{
        if(filter == "All"){
        response = await axios.get("http://localhost:3000/api/communities"

)        }
        else{
            response = await axios.get(`http://localhost:3000/api/communities?q=${filter}`)
            alert(response.data)
        }}
        catch(e){
            alert("Error : " + e.message)
        }
        setCommunitiesArr(response.data)
    }
    const [communitiesArr , setCommunitiesArr] = useState([])
    const [navPage , setNavPage] = useState(1)
    useEffect(() => {
        async function load() {
            await fetchCommunities(); 
        }
        load();
        }, []);
    return(
        <Box sx={{display : 'flex', width : '100%' , minHeight : '80vh' , flexDirection : 'column'  , alignItems : 'center'}}>
            {/* <SearchBar setNavPage = {setNavPage} fetchCommunities = {fetchCommunities}/> */}
            <Communities communitiesArr = {communitiesArr} />
            <PageNav navPage = {navPage} setNavPage = {setNavPage} count ={communitiesArr.length} setCommunitiesArr = {setCommunitiesArr}/>
        </Box>
    )

}