import React, { useState, useEffect, useDebugValue } from "react";
import { List, Paper, Divider , Button } from "@mui/material";
import CommunityItem from "./CommunityItem"; // Make sure to import the component above
import api from "../../src/api/axios";
export default function CommunityList(props) {
  const [communities, setCommunities] = useState([]);
  const {search} = props 
  const [num , setNum] = useState(1)
  const getCom = async(num)=>{
    const response = await api.get('/api/communities/search?q='+search+"&page="+num)
    let commArr =[]
    if(response.data){
        if(response.data.found){
           commArr = [...commArr , ...response.data.exactMatch]
        }
        if(response.data.recommendations){
             commArr = [...commArr , ...response.data.recommendations]
        }
    }
    setCommunities((prev)=>{
      return [...prev , ...commArr];
    });
  }
  const handleShowMore = () => {
        getCom(num)
        setNum(prev => prev + 1); 
    };

  useEffect( () => {
    getCom(1)
    setNum(2)
  }, [search]);



  return (
    <div style={{display :'flex' , flexDirection : 'column' , alignItems : 'center' , justifyContent : 'center' }}>
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
     <Button onClick={handleShowMore} variant="text">Show more</Button>
    </div>
  );
}