import Pagination from '@mui/material/Pagination';
import { generateMockCommunities } from '../../mockData/mockCommunities';

export default function PageNav(props){
    const {navPage , setNavPage , count , fetchCommunities} = props
    const handleChange = (value)=>{
        setNavPage(value)
        fetchCommunities(value)
    }
    return(
    <Pagination page={navPage} count={count} color="primary" onChange={(event , value)=>{handleChange(value)}}/>
    )

}