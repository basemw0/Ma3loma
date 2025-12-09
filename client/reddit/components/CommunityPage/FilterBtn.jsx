import { Box, Divider } from "@mui/material"
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function FilterBtn(props){
    const [filter, setFilter] = React.useState(1);
    const {getPosts , communityId , setNum} = props
    const handleChange = (value)=>{
        switch (value){
            case 1:
                setNum(1)
                getPosts(communityId , 1 , "best")
                setFilter(1)
                break
            case 2:
                setNum(1)
                getPosts(communityId , 1 , "hot")
                setFilter(2)
                break
            case 3:
                setNum(1)
                getPosts(communityId , 1 , "new")
                setFilter(3)
                break
        }
    }
    return(
        <Box sx={{display : 'flex' , flexDirection : 'column'}}>
            <div>
  <FormControl sx={{ m: 1, minWidth: 40 }}>
    <Select
      value={filter}
      onChange={(e)=>{handleChange(e.target.value)}}
      displayEmpty
      sx={{
        backgroundColor: 'white',
        border: 'none',
        textAlign : 'center',
        borderRadius: '24px',
        fontSize: '1.1rem',
        fontWeight: 500,
        color: '#5f6368',
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&:hover': {
          backgroundColor: 'lightgrey',
        },
        '&.Mui-focused': {
          backgroundColor: 'white',
        },
        '& .MuiSelect-select': {
          paddingLeft: '20px',
          paddingRight: '40px',
          paddingTop: '12px',
          paddingBottom: '12px',
        },
        '& .MuiSelect-icon': {
          color: '#5f6368',
          right: '12px',
        },
      }}
      
    >
      <span style={{marginLeft : 10}}>Sort by</span>
      <Divider sx={{marginTop : 1 , marginBottom  :1}}/>
      <MenuItem sx={{opacity : 0.6}} value={1}>Best</MenuItem>
      <MenuItem sx={{opacity : 0.6}} value={2}>Hot</MenuItem>
      <MenuItem sx={{opacity : 0.6}}value={3}>New</MenuItem>
    </Select>
  </FormControl>
</div>
        </Box>
    )

}