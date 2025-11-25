import TextField from '@mui/material/TextField';
import { useState } from 'react';
export default function CommunityDescription(props){
    const {setCommunityDetails} = props
    const [des , setDes] = useState('')
    const handleChange = (e)=>{
        setDes(e.target.value)
        setCommunityDetails((prev)=>{
            return {...prev , description: e.target.value}
        })
    }
    return(
        <TextField id="outlined-basic" label="Description" variant="outlined"  value={des} onChange={(e)=>{handleChange(e)}} multiline   rows={4}  sx={{borderRadius : 176 , width : 405 , margin:2}} />

    )


}