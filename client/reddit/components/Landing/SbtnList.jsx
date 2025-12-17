import Sbtn from "./Sbtn";
import { Box } from "@mui/material";
import {Stack} from "@mui/material";
import { useState } from "react";
import Posts from "../content/posts/Posts";
export default function SbtnList(props){
  const {setCurrent} = props
  const filters = ['Posts', 'Communities' ,'Comments'];
  const [selectedFilter, setSelectedFilter] = useState('Posts');
  const handleChange = (filter)=>{
    if(filter === "Posts"){
      setCurrent(1)
    }
    else if(filter === "Communities"){
      setCurrent(2)
    }
    else if(filter === "Comments"){
      setCurrent(3)
    }
    setSelectedFilter(filter)
  }
  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <Stack direction="row" spacing={1}>
        {filters.map((filter) => (
          <Sbtn 
            key={filter}
            label={filter}
            active={selectedFilter === filter}
            onClick={() => handleChange(filter)}
          />
        ))}
      </Stack>
    </Box>
  );
};
