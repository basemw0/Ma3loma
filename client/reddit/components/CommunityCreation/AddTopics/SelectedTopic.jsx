import ToggleButton from '@mui/material/ToggleButton';
import CloseIcon from '@mui/icons-material/Close';
export default function Topic(props){
    const {topicName , updateSelected} = props
    
    return(
        <ToggleButton sx={{width : 'fit-content' , fontSize : 12 , backgroundColor : 'white' , color : 'black' , height : 32 , textTransform : 'none' , margin:0.5 , borderStyle : 'solid 1px' , borderRadius : 1, '&:hover': {backgroundColor: '#f0f0f0' } }} onClick={()=>{updateSelected(topicName , 'remove')}}>{topicName}<CloseIcon sx={{fontSize: 16, marginLeft: 0.5}}/>
        </ToggleButton>
    )
}