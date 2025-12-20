import { Button } from "@mui/material";


export default function Sbtn(props){
    const {label, active, onClick} = props
return (
    <Button
      onClick={onClick}
      disableElevation 
      disableRipple
      sx={{
        borderRadius: '50px',
        textTransform: 'none', 
        fontWeight: 700, 
        fontSize: '1rem',
        padding: '6px 24px', 
        minWidth: 'auto',
        color: '#1A1A1B',
        backgroundColor: active ? '#D6DCE0' : 'transparent',
        transition: 'all 0.2s',
        '&:hover': {
       
          backgroundColor: active ? '#c3c9cd' : '#f0f2f5',
        },
      }}
    >
      {label}
    </Button>
  );
}