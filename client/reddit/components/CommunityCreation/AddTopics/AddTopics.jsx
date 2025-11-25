import { useState } from "react";
import { mockCategories } from "../../../mockData/Topics";
import Stack from '@mui/material/Stack';
import TopicSearch from "./TopicSearch";
import SelectedTopics from './SelectedTopics'
import TopicsSection from "./TopicsSection";
export default function AddTopics(){
    const [errorFlag , setErrorFlag] = useState(false)
    const [allCategories , setAllCategories] = useState(mockCategories)
    const [selectedTopics , setSelectedTopics] = useState([])
    const updateSelected = (topic , action)=>{
        setSelectedTopics((prev)=>{
            if(selectedTopics.length == 3 && action == 'add'){
                setErrorFlag(true)
            return prev
        }
            if(action == 'add'){
                return [...prev, topic]
            }
            else if(action == 'remove'){
                setErrorFlag(false)
                return prev.filter((t)=>{
                    return t !== topic
                })
            }
        })
    }
    const filter  = (searchValue)=>{
        if(searchValue == ''){
            setAllCategories(mockCategories)
        }
        else{
            setAllCategories(
                ()=>{
                    let mapping = allCategories.map((category)=>{
                        let catFiltered = {name : '' , topics : []}
                        let filtered = category.topics.filter((topic)=>{
                            return topic.toLowerCase().includes(searchValue.toLowerCase())
                        })
                        catFiltered.name = category.name
                        catFiltered.topics = filtered
                        return catFiltered
                    })
                    return mapping.filter((cat)=>{
                        return cat.topics.length > 0
                    })
                    
            }
            )
        }
    }
    return(
        <Stack direction='column'>
            <div style={{marginBottom : 3}}>
                <h2>Add Topics</h2>
                <p>Add up to 3 topics to help interested redditors find your community.</p>
            </div>
            <TopicSearch filter = {filter}/>
            <SelectedTopics topicsArr = {selectedTopics} updateSelected = {updateSelected} error = {errorFlag}/>
            <TopicsSection  allCategories = {allCategories} updateSelected = {updateSelected} selectedTopics = {selectedTopics}/>
    
        </Stack>
    )





}