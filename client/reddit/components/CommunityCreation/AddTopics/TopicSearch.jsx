import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export default function TopicSearch(props) {
  const {filter} = props
  const handleSearch = (value)=>{
    setQuery(value)
    filter(value)
  }
  const [query , setQuery] = useState('')
  return (
    <Box sx={{ width: 500, maxWidth: '100%', display: 'flex', marginLeft : ''}}>
      <TextField
        placeholder="Filter topics"
        variant="outlined"
        size="small"
        value={query}
        onChange={(event , value)=>{handleSearch(event.target.value)}}
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
