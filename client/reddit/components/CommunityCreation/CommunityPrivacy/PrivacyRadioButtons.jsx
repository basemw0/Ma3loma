import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Box, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';

// Common style object to apply to all FormControlLabels
const labelStyle = {
    // Main container styles
    margin: 0,
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    
    // 1. Color for the SELECTED state (persistent dark grey)
    '&.Mui-checked': {
        backgroundColor: '#e5e5e5', // Lighter grey for checked state
    },
    
    // 2. Color for Hover state (when NOT checked)
    '&:not(.Mui-checked):hover': {
        backgroundColor: '#f5f5f5', // Light grey for hover on unselected
    },
    
    // 3. Color for Hover state (when ALREADY checked)
    // The user clicked it, so make it a bit darker on hover/active
    '&.Mui-checked:hover': {
        backgroundColor: '#cccccc', // Darkest grey for hover/active on selected item
    },

    // Structure for the icon, label content, and radio button
    display: 'flex',
    alignItems: 'flex-start',
    
    // Spacing between the icon and the text content
    '& .MuiFormControlLabel-label': { 
        marginLeft: '10px',
        flexGrow: 1,
    },
    
    // Styling for the Radio component (push to the right)
    '& .MuiRadio-root': {
        padding: '0 8px 0 0',
        order: 3, // Push the radio button to the right end
        marginTop: '4px',
    },
    
    // Box to wrap the icon and place it before the text content
    '& > .MuiBox-root': {
        display: 'flex',
        alignItems: 'center',
        color: 'text.primary',
        marginRight: '10px',
        marginTop: '4px',
        order: 1, // Place icon first (left)
    }
};

const getLabelContent = (title, description, Icon) => (
    <>
        <Box>
            <Icon fontSize="small" />
        </Box>
        <Box>
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {description}
            </Typography>
        </Box>
    </>
);

export default function PrivacyRadioButtons(props) {
  const {privacy , setPrivacy} = props
  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <RadioGroup
        aria-labelledby="privacy-radio-buttons-group"
        value={privacy} 
        onChange={(e)=>{setPrivacy(e.target.value)}} 
        name="privacy-buttons-group"
      >
        <FormControlLabel
          value="public"
          control={<Radio size="small" />}
          label={getLabelContent('Public', 'Anyone can view, post, and comment to this community', LanguageIcon)}
          sx={labelStyle}
        />
        <FormControlLabel
          value="restricted"
          control={<Radio size="small" />}
          label={getLabelContent('Restricted', 'Anyone can view, but only approved users can contribute', VisibilityIcon)}
          sx={labelStyle}
        />
        <FormControlLabel
          value="private"
          control={<Radio size="small" />}
          label={getLabelContent('Private', 'Only approved users can view and contribute', LockIcon)}
          sx={labelStyle}
        />
      </RadioGroup>
    </FormControl>
  );
}