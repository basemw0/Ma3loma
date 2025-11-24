import { useState } from 'react';
import { generateMockCommunities } from '../../mockData/mockCommunities';
import Communities from './Communities';
import SearchBar from './SearchBar';
import PageNav from './PageNav';
import Box from '@mui/material/Box';

export default function CommunitiesPage(){
    const initial =  generateMockCommunities(1)
    const [communitiesArr , setCommunitiesArr] = useState(initial)
    const [navPage , setNavPage] = useState(1)
    return(
        <Box sx={{display : 'flex', width : '100%' , minHeight : '80vh' , flexDirection : 'column'  , alignItems : 'center'}}>
            <SearchBar setNavPage = {setNavPage} setCommunitiesArr = {setCommunitiesArr}/>
            <Communities communitiesArr = {communitiesArr} />
            <PageNav navPage = {navPage} setNavPage = {setNavPage} count ={1500} setCommunitiesArr = {setCommunitiesArr}/>
        </Box>
    )

}