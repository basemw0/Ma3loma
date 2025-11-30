import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { generateMockCommunities } from '../../mockData/mockCommunities';

export default function SearchBar(props) {
  const {fetchCommnities , setNavPage} = props
  const [query , setQuery] = useState('')
  const handleEnter = (e)=>{
    if(e.key == 'Enter'){
    fetchCommnities(query)
    setQuery('')
    setNavPage(1)
    }
  }

   
  return (
    <Box sx={{ width: 500, maxWidth: '100%', display: 'flex', marginLeft : ''}}>
      <TextField
        placeholder="Search communities"
        variant="outlined"
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e)=>{handleEnter(e)}}
        sx={{ 
          width: 500, 
          borderRadius: '20px',           // makes the input rounded
          '& .MuiOutlinedInput-root': {  // target the input root for proper border radius
            borderRadius: '20px',
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
