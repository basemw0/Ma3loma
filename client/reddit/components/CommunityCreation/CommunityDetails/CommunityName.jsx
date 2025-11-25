import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function CommunityName(props){
    const {setCommunityDetails} = props
    const [name , setName] = useState('')
    const handleChange = (e)=>{
        setName(e.target.value)
        setCommunityDetails((prev)=>{
            return {...prev , name: e.target.value}
        })
    }
    
    return(
        <TextField id="outlined-basic" label="Name" variant="outlined" value={name} onChange={(e)=>{handleChange(e)}} sx={{borderRadius : 10 , width : 405 , height: 56 , margin:2}} />

    )

}