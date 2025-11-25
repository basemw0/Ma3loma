import Stack from '@mui/material/Stack';
import TopicsContainer from './TopicsContainer';
export default function Category(props){
    const {categoryName , topicsArr , updateSelected , selectedTopics}  = props
    return(
        <Stack direction= 'column'>
            <h3 style={{marginBottom : 0.3 , fontSize : 14}}>{categoryName}</h3>
            <TopicsContainer updateSelected = {updateSelected} topicsArr = {topicsArr} selectedTopics = {selectedTopics}/>
        </Stack>
    )
}