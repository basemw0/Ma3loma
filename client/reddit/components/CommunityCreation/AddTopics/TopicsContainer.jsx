import Topic from "./Topic"
import Stack from '@mui/material/Stack';
export default function TopicsContainer(props){
    const {topicsArr , updateSelected , selectedTopics} = props
    return(
        <Stack direction='row' flexWrap = 'wrap'>
        {topicsArr.map((topic)=>{
            let selected = false
            if(selectedTopics.includes(topic)) selected = true
            return <Topic topicName = {topic} updateSelected = {updateSelected} selected = {selected}/>
        })}
        </Stack>

    )


}