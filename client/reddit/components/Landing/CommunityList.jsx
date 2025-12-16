import React, { useState, useEffect } from "react";
import { List, Paper, Divider } from "@mui/material";
import CommunityItem from "./CommunityItem"; // Make sure to import the component above
import api from "../../src/api/axios";
export default function CommunityList(props) {
  const [communities, setCommunities] = useState([]);
  const {search} = props 

  useEffect( () => {
    const getCom = async()=>{
    const response = await api.get('/api/communities/search?q='+search)
    let commArr =[]
    if(response.data){
        if(response.data.found){
           commArr = [commArr , ...response.data.exactMatch]
        }
        if(response.data.recommendations){
             commArr = [commArr , ...response.data.recommendations]
        }
    }
    
    setCommunities(commArr);}
    getCom()
  }, [search]);



  return (
    <Paper 
        elevation={0} 
        sx={{ 
            width: "100%", 
            bgcolor: "#ffffff", 
            borderRadius: "4px"
        }}
    >
      <List sx={{ p: 0 }}>
        {communities.map((community, index) => (
          <React.Fragment key={community.id}>
            <CommunityItem
             community = {community}
            />
            {index < communities.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}