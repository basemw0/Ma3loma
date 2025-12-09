import { Box } from "@mui/material";
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader'; // Import this

export default function FilterBtn(props){
    const [filter, setFilter] = React.useState(1);
    const {getPosts, communityId, setNum, setCurrentFilter} = props;

    const handleChange = (event) => {
        const value = event.target.value;
        setFilter(value);

        let filterName = "new";
        if (value === 1) filterName = "best";
        if (value === 2) filterName = "hot";
        if (value === 3) filterName = "new";

        setCurrentFilter(filterName);
        
        // LOGIC FIX: When filtering, we fetch Page 1, 
        // but we must set 'num' to 2 so the NEXT "Show More" click fetches Page 2.
        setNum(2); 
        getPosts(communityId, 1, filterName);
    };

    return(
        <Box sx={{display : 'flex' , flexDirection : 'column'}}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <Select
                    value={filter}
                    onChange={handleChange}
                    displayEmpty
                    renderValue={(selected) => {
                        // This makes the button say "Sort by Best"
                        const labels = {1: "Best", 2: "Hot", 3: "New"};
                        return <span style={{color: '#5f6368'}}>Sort by <b>{labels[selected]}</b></span>;
                    }}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '24px',
                        height: '45px',
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover': { backgroundColor: 'lightgrey' },
                        '&.Mui-focused': { backgroundColor: 'white' },
                    }}
                >
                    {/* Use ListSubheader for non-clickable headers */}
                    <ListSubheader>Sort by</ListSubheader>
                    
                    <MenuItem value={1}>Best</MenuItem>
                    <MenuItem value={2}>Hot</MenuItem>
                    <MenuItem value={3}>New</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}