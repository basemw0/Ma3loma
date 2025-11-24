import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export default function Community(props){
    const {communityName , communityDescription , numOfMembers , Cnum , imgUrl}  = props

  return (
    <Card sx={{ maxWidth: 310, maxHeight: 76 , border : 'none', boxShadow : 'none'}}>
      <Box sx={{ p: 1.5 }}>
        <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
          
          <Typography variant="h6" component="div" sx={{ mb: 0  , width : 25}}>
            {Cnum}
          </Typography>

          <Avatar alt="Remy Sharp" src={imgUrl} sx={{ width: 30, height: 30 }} />

          <Stack direction="column" sx={{ ml: 0.5, alignItems: 'flex-start' }}>
            
            <Typography variant="caption" component="div" sx={{ mb: 0 }}>
              {communityName}
            </Typography>

            <Typography variant="caption" component="div" sx={{ mb: 0  , whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' , maxWidth : 212}}> 
              {communityDescription}
            </Typography>

            <Typography variant="caption" component="div" sx={{ mb: 0 }}>
              {numOfMembers}M Members
            </Typography>

          </Stack>

        </Stack>
      </Box>
    </Card>
  );
}
