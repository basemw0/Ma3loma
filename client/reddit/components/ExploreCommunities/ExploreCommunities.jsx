import { useEffect, useState } from "react"
import  {categoryNames}  from "../../mockData/mockCategories"
import { Box } from "@mui/material"
import CategoryList from "./CategoryList"
import DisplayCategories from "./DisplayCategories"
import DisplayAll from "./DisplayAll"
import api from "../../src/api/axios"
import { useSearchParams } from "react-router-dom";
require('dotenv').config();
  const serverUrl = process.env.CLIENT_URL || "http://localhost:3000";
export default function ExploreCommunities(){
    const [searchParams , setSearchParams] =  useSearchParams();
    const query =  searchParams.get("q") || "All"
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
        let response = await api.get("${serverUrl}/api/communities/category?q=" + encodeURIComponent(category))
        let responeObject = response.data
        setCommunitiesArr(responeObject)
    }
    useEffect(() => {
        async function load() {
            await retrieveCommunities(query); 
        }
        load();
        }, [query]);
    const [communitiesArr , setCommunitiesArr] = useState([])
    return(
        <Box sx={{display : 'flex' , flexDirection : 'column' , padding:10 , width : '95%'}}>
        <h1>Explore Communities</h1>
        <CategoryList cats = {cats} setCats = {setCats} setSearchParams = {setSearchParams}/>
        <DisplayAll communitiesArr = {communitiesArr}  retrieveCommunities = {()=>retrieveCommunities(query)}/>
        </Box>
    )
}