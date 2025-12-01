import { useEffect, useState } from "react"
import  {categoryNames}  from "../../mockData/mockCategories"
import { Box } from "@mui/material"
import CategoryList from "./CategoryList"
import DisplayCategories from "./DisplayCategories"
import DisplayAll from "./DisplayAll"
import axios from "axios"

export default function ExploreCommunities(){
    //Function to retrieve mn 3and 3am badra
    const cat = categoryNames.map((category , index)=>{
        let status = 0 
        if (index == 0 ) status = 1
        let statusCat = {
            name : category,
            status : status
        }
        return statusCat
    })
    const [cats , setCats] = useState(cat)
    const retrieveCommunities = async (category)=>{
        //Ill get an array of objects , containing the topic and its subbreddits
        let response = await axios.get("http://localhost:3000/api/communities/category?q=" + category)
        let responeObject = response.data
        setCommunitiesArr(responeObject)
    }
    useEffect(() => {
        async function load() {
            await retrieveCommunities("All"); 
        }
        load();
        }, []);
    const [communitiesArr , setCommunitiesArr] = useState([])
    return(
        <Box sx={{display : 'flex' , flexDirection : 'column' , padding:10 , width : '95%'}}>
        <h1>Explore Communities</h1>
        <CategoryList cats = {cats} setCats = {setCats} retrieveCommunities = {retrieveCommunities}/>
        <DisplayAll communitiesArr = {communitiesArr}  retrieveCommunities = {()=>retrieveCommunities(cats.find(c => c.status === 1)?.name)}/>
        </Box>
    )

}