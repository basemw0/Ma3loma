import Sbtn from "./Sbtn";
import { Box } from "@mui/material";
import {Stack} from "@mui/material";
import { useState } from "react";
export default function SbtnList(){
  const filters = ['Posts', 'Communities' ,'Comments'];
  const [selectedFilter, setSelectedFilter] = useState('Posts');

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <Stack direction="row" spacing={1}>
        {filters.map((filter) => (
          <Sbtn 
            key={filter}
            label={filter}
            active={selectedFilter === filter}
            onClick={() => setSelectedFilter(filter)}
          />
        ))}
      </Stack>
    </Box>
  );
};
