import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { Divider } from '@mui/material';

export default function CategoryList(props) {
    const {cats , setCats  , retrieveCommunities}  = props
    const handleClick = (category)=>{
        retrieveCommunities(category.name)
        setCats((prev)=>{
            return prev.map((cat)=>{
                if(cat.name == category.name){
                    return {
                        name : cat.name,
                        status : 1
                    }
                }
                return {
                    name : cat.name,
                    status : 0
                }
            })
        })
    }
    return (
    <>
    <Box
     sx={{
            width: '95%',
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            padding: 1,
                }}
    >
      <Box sx={{ display: 'flex', margin: 1 }}>
  {cats.map((category) => {
    return (
      <Button
        sx={{
          backgroundColor: category.status == 1 ? 'lightgrey' : 'white',
          color: '#1a1a1b',
          textTransform: 'none',
          width  : 'auto',
          minWidth : 0,
          fontSize: '14px',
          padding: '4px 12px',
          border: '1px solid #ccc',
          margin: '0 6px',
        }}
        onClick={() => { handleClick(category) }}
      >
        {category.name}
      </Button>
    );
  })}
</Box>
    </Box>
    <Divider/>
    </>
    
  );
}