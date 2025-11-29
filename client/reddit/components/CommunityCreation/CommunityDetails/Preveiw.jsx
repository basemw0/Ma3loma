import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

export default function Preview(props) {
  const { communityDetails, communityVisuals } = props;

  return (
    <Card sx={{ minWidth: 275, borderRadius: 3 }}>
      
      {/* ===== Banner ===== */}
      {communityVisuals.banner && (
        <Box
          component="img"
          src={communityVisuals.banner}
          alt="banner"
          sx={{
            width: '100%',
            height: 80,
            objectFit: 'cover',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12
          }}
        />
      )}

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        
        {/* ===== Avatar + Name ===== */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {communityVisuals.icon && (
            <Avatar
              src={communityVisuals.icon}
              alt="community icon"
              sx={{ width: 40, height: 40 }}
            />
          )}

          <Typography
            gutterBottom
            sx={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}
          >
            r/{communityDetails.name || 'your_community'}
          </Typography>
        </Box>

        {/* ===== Visitors text ===== */}
        <Typography 
          sx={{ color: 'text.secondary', mb: 1.5, fontSize: 12 }}
        >
          1 weekly visitor · 1 weekly contributor
        </Typography>

        {/* ===== Description ===== */}
        <Typography variant="body2">
          {communityDetails.description?.length > 0
            ? communityDetails.description
            : 'Your community description'}
        </Typography>
      </CardContent>
    </Card>
  );
}
