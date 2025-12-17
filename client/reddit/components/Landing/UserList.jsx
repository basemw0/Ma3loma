import React, { useDebugValue, useEffect, useState } from "react";
import { Box,Stack , Button } from "@mui/material";
import UserListItem from "./UserListItem";
import api from "../../src/api/axios";
export default function UserList(props) {
  const {search} = props
  const [users, setUsers] = useState([]);
  const [num, setNum] = useState(1);

  const fetchUsers = async (search , num) => {
    const response = await api.get('/api/users/search?query='+search + "&page=" + num)
    if(response.data){
        setUsers((prev)=>{
            return [...users ,...response.data]
        })
    }
  };
  useEffect(()=>{
    fetchUsers(search , 1)
    setNum(2)

  } , [search])
   const handleShowMore = () => {
        fetchUsers(search , num)
        setNum(prev => prev + 1); 
    };

  return (
    <div style={{display : 'flex' , flexDirection : 'column' , alignItems : 'center' , justifyContent : 'center'}}>
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "4px",
        width: "100%",
        border: "1px solid #ccc", 
      }}
    >
      <Stack>
          {users.map((user) => (
            <UserListItem key={user._id} user={user} />
          ))}
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "12px",
          borderTop: "1px solid #edeff1",
        }}
      >
      </Box>
    </Box>
     <Button sx={{marginTop : 1}} onClick={handleShowMore} variant="text">Show more</Button>
    </div>
  );
}