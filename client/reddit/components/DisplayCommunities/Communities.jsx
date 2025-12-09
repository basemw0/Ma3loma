import Box from '@mui/material/Box';
import Community from './Community';
import Typography from '@mui/material/Typography';

export default function Communities(props){
    const { communitiesArr } = props;
    return (
        <Box sx={{ 
            width: '70%',
            maxHeight: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            
            <Typography variant='h6' sx={{ m: 2 }}>
                Best of Reddit
            </Typography>

            <Typography variant='subtitle1' sx={{ alignSelf: 'flex-start' }}>
                Top Communities
            </Typography>

            <Typography variant='caption' sx={{ mb: 2, opacity: 0.5, alignSelf: 'flex-start' }}>
                Browse Reddit's largest communities
            </Typography>

            <Box
            sx={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",  
                gap: 2,                                  
                alignItems: "start"
            }}
            >
  {communitiesArr.map((comm, index) => {
    const cardColor = (index % 6 < 3) ? "white" : "lightgrey";

    return (
      <Community
        key={index}
        Cnum={index+ 1}
        communityName={comm.name}
        communityDescription={comm.description}
        numOfMembers={comm.numberOfMembers}
        imgUrl={comm.icon}
        color={cardColor}
        communityId = {comm._id}
      />
    );
  })}
    </Box>
        </Box>
    );
}
