import { useState } from "react"
import { communities } from "../../mockData/mockCommunities2"
import { categories } from "../../mockData/mockCategories"
import { Box } from "@mui/material"
import CategoryList from "./CategoryList"
import DisplayCategories from "./DisplayCategories"
export default function ExploreCommunities(){
    //Function to retrieve mn 3and 3am badra
    const cat = categories.map((category , index)=>{
        let status = 0 
        if (index == 0 ) status = 1
        let statusCat = {
            name : category,
            status : status
        }
        return statusCat
    })
    const [cats , setCats] = useState(cat)
    const retrieveCommunities = (category)=>{
        if(category == "All") return communities
        return communities.filter((comm)=>{
            return comm.category == category
        })
    }
    const starter = retrieveCommunities("All")
    const [communitiesArr , setCommunitiesArr] = useState(starter)
    return(
        <Box sx={{display : 'flex' , flexDirection : 'column' , padding:10}}>
        <h1>Explore Communities</h1>
        <CategoryList cats = {cats} setCats = {setCats} setCommunitiesArr = {setCommunitiesArr} retrieveCommunities = {retrieveCommunities}/>
        <DisplayCategories communitiesArr = {communitiesArr}  setCommunitiesArr = {setCommunitiesArr}/>
        </Box>
    )

}