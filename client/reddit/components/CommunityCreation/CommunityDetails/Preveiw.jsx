import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



export default function Preview(props) {
    const {communityDetails} = props
  return (
    <Card sx={{ minWidth: 275 , borderRadius :3 , height: 150 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'black', fontSize: 16 , fontWeight :'bold' }}>
          r/{communityDetails.name}
        </Typography>
        <Typography variant="h5" component="div">
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 , fontSize : 12}}>1 weekly visitor·1 weekly contributor
        </Typography>
        <Typography variant="body2">
          {communityDetails.description.length > 0 ? communityDetails.description :'Your community description'}
        </Typography>
      </CardContent>
    </Card>
  );
}