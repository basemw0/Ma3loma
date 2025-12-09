import Pagination from '@mui/material/Pagination';
import { generateMockCommunities } from '../../mockData/mockCommunities';

export default function PageNav(props){
    const {navPage , navigate , count} = props
    const handleChange = (value)=>{
        navigate("/api/communities/best/"+value)
    }
    return(
    <Pagination page={navPage} count={count} color="primary" onChange={(event , value)=>{handleChange(value)}}/>
    )

}