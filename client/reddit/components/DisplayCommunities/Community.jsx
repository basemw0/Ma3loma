
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export default function Community(props){
    const {communityName , communityDescription , numOfMembers , Cnum , imgUrl , color = ""}  = props

    
  return (
    <Card sx={{ maxWidth: 310, maxHeight: 76 , border : 'none', boxShadow : 'none' , bgcolor : color , borderRadius : 0}}>
      <Box sx={{ p: 1 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {Cnum == 'no'? '': <Typography variant="h6" component="div" sx={{ mb: 0  , width : 25}}>
            {Cnum}
          </Typography>}
          <Avatar alt="Remy Sharp" src={imgUrl} sx={{ width: 50, height: 50 }} />

          <Stack direction="column" sx={{ ml: 0.5, alignItems: 'flex-start' }}>
            
            <Typography variant="caption" component="div" sx={{ mb: 0, fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
              {communityName}
            </Typography>

            <Typography variant="caption" component="div" sx={{ mb: 0, whiteSpace : 'nowrap' , overflow : 'hidden' , textOverflow : 'ellipsis' , maxWidth : 212, fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.3}}> 
              {communityDescription}
            </Typography>

            <Typography variant="caption" component="div" sx={{ mb: 0, fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.2 }}>
              {numOfMembers}M members
            </Typography>

          </Stack>

        </Stack>
      </Box>
    </Card>
  );
}