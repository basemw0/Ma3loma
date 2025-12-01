import { useState } from 'react';
import { generateMockCommunities } from '../../mockData/mockCommunities';
import Communities from './Communities';
import SearchBar from './SearchBar';
import PageNav from './PageNav';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useEffect } from 'react';
export default function CommunitiesPage(){
    const [nCommunities , setNcommunities] = useState(0)
    const fetchCommunities = async (number)=>{
        let response = await axios.get(`http://localhost:3000/api/communities/best/${number}`)
        let responseObject = response.data
        setNcommunities(responseObject.total)
        setCommunitiesArr(responseObject.communities)
    }
    const [communitiesArr , setCommunitiesArr] = useState([])
    const [navPage , setNavPage] = useState(1)
    useEffect(() => {
        async function load() {
            await fetchCommunities(1); 
        }
        load();
        }, []);
    return(
        <Box sx={{display : 'flex', width : '100%' , minHeight : '80vh' , flexDirection : 'column'  , alignItems : 'center'}}>
            {/* <SearchBar setNavPage = {setNavPage} fetchCommunities = {fetchCommunities}/> */}
            <Communities communitiesArr = {communitiesArr} />
            <PageNav navPage = {navPage} setNavPage = {setNavPage} count ={Math.ceil(nCommunities / 25)} fetchCommunities = {fetchCommunities}/>
        </Box>
    )

}