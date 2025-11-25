import SelectedTopic from './SelectedTopic'
export default function SelectedTopics(props){
    const {topicsArr , error , updateSelected}  = props
    return(
        <div style={{display : 'flex' , flexDirection : 'column'}}>
        <h3>Topics {topicsArr.length}/3</h3>
        <div style={{display : 'flex' , flexDirection : 'row'}}>
        {topicsArr.map((topic)=>{
            return <SelectedTopic topicName = {topic} updateSelected = {updateSelected}/>
        })}
        </div>
        <div style={{color : 'red' , display : error? 'block' : 'none'}}>
            Only 3 topics can be added
        </div>
        </div>
    )
}