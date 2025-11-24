import Pagination from '@mui/material/Pagination';
import { generateMockCommunities } from '../../mockData/mockCommunities';

export default function PageNav(props){
    const {navPage , setNavPage , count , setCommunitiesArr} = props
    const handleChange = (value)=>{
        setNavPage(value)
        //Axios fetching logic replaced with mock arrays for now
        setCommunitiesArr(generateMockCommunities(value))
    }
    return(
    <Pagination page={navPage} count={count} color="primary" onChange={(event , value)=>{handleChange(value)}}/>
    )

}