import Box from '@mui/material/Box';
import Community from './Community';
import Typography from '@mui/material/Typography';

export default function Communities(props){
    const {communitiesArr} = props
    return(
        <Box sx={{maxWidth : '70%' , maxHeight: '80%' , display : 'flex' , flexDirection : 'column' , justifyContent : 'center' , alignItems :'center'}}>
            <Typography variant='h6' sx={{margin : '20px'}}>
            Best of Reddit
            </Typography>

            <Typography variant='subtitle1' sx={{margin : '0px' , alignSelf : 'flex-start'}}>
           Top Communities
            </Typography>
            <Typography variant='caption' sx={{marginBottom : '10px' , opacity : '0.5' , alignSelf : 'flex-start'}}>
                Browse Reddit's largest communities
            </Typography>
            <Box sx={{maxWidth : '100%' , maxHeight: '100%' , display : 'flex' , flexWrap : 'wrap' , margin: 'auto'}}> 
            {
                communitiesArr.map((comm)=>{
                    return <Community
                    Cnum = {comm.Cnum}
                    communityName = {comm.communityName}
                    communityDescription = {comm.communityDescription}
                    numOfMembers = {comm.numOfMembers}
                    imgUrl  = {comm.imgUrl}
                    />
                })
            }
            </Box>
        </Box>

    )

}