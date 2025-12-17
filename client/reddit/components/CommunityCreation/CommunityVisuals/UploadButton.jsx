import Button from '@mui/material/Button';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { styled } from '@mui/material/styles';
import uploadToCloudinary from '../../../src/utils/uploadCloudinary'

export default function UploadButton(props) {
  const {setCommunityVisuals , icon , edit = false} = props
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const handleChange = async (file)=>{
    if(edit){
      let url = await uploadToCloudinary(file)
      setCommunityVisuals((prev)=>{
        return {...prev , image : url.url}
      })
    }
    else if(icon){
      let url = await uploadToCloudinary(file)
      setCommunityVisuals((prev)=>{
        return {...prev , icon : url.url}
      })
    }
    else{
      let url = await uploadToCloudinary(file)
      setCommunityVisuals((prev)=>{
        return {...prev , banner : url.url}
      })
    }

  }

  return (
    <Button
      component="label"
      variant="contained"
      startIcon={<AddPhotoAlternateIcon sx={{ fontSize: 24 }} />} // Use a relevant image/photo icon
      sx={{
        // Match the rounded (pill) shape
        borderRadius: 25, 
        
        // Match the light grey background color
        backgroundColor: '#e9e9e9', 
        
        // Match the dark text and icon color
        color: 'black', 
        
        // Remove box shadow, which 'contained' buttons have by default
        boxShadow: 'none', 
        
        // Make sure it looks good on hover/active states
        '&:hover': {
          backgroundColor: '#dcdcdc', // Slightly darker grey on hover
          boxShadow: 'none',
        },
        '&:active': {
          backgroundColor: '#cbcbcb', // Even darker when actively pressed
          boxShadow: 'none',
        },
        
        // Style the text (if needed, but default MUI Typography usually works)
        textTransform: 'none', // Keep 'Add' capitalized or normal
        fontWeight: 'bold',
        padding: '8px 16px', // Adjust padding for size
      }}
    >
      Add
      <VisuallyHiddenInput
        type="file"
        onChange={(e)=>{
          handleChange(e.target.files[0])
        }}
        multiple
      />
    </Button>
  );
}