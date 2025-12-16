import { Button } from "@mui/material";


export default function Sbtn(props){
    const {label, active, onClick} = props
return (
    <Button
      onClick={onClick}
      disableElevation // Removes shadow to match the flat look
      disableRipple // Optional: Remove this if you want the click animation
      sx={{
        borderRadius: '50px', // Creates the pill shape
        textTransform: 'none', // Prevents ALL CAPS default MUI style
        fontWeight: 700, // Matches the bold font in image
        fontSize: '1rem',
        padding: '6px 24px', // Horizontal padding to match aspect ratio
        minWidth: 'auto',
        color: '#1A1A1B', // Dark grey/black text
        backgroundColor: active ? '#D6DCE0' : 'transparent', // The specific grey color
        transition: 'all 0.2s',
        '&:hover': {
          // Darken slightly on hover if active, otherwise light grey
          backgroundColor: active ? '#c3c9cd' : '#f0f2f5',
        },
      }}
    >
      {label}
    </Button>
  );
}