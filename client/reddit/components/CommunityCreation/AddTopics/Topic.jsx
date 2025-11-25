import ToggleButton from '@mui/material/ToggleButton';
import CloseIcon from '@mui/icons-material/Close';
export default function Topic(props){
    const {topicName , updateSelected , selected} = props
    
    return(
        <ToggleButton 
            onClick={()=>{selected ? updateSelected(topicName, 'remove') : updateSelected(topicName, 'add')}} 
            selected={selected}
            sx={{
                borderRadius : 10 , 
                width : 'fit-content' , 
                fontSize : 12 , 
                height : 32 , 
                textTransform : 'none' , 
                margin:0.5,
                backgroundColor : '#E5EBEE' , 
                color : 'black' ,
                '&.Mui-selected': {
                    backgroundColor: '#C8D2DA',
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#B5C0C9',
                    }
                },
                '&:not(.Mui-selected):hover': {
                    backgroundColor: '#D1DBE0',
                }
            }}
        >
            {topicName}
            {selected && <CloseIcon sx={{fontSize: 16, marginLeft: 0.5}}/>}
        </ToggleButton>
    )
}