import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Avatar } from '@mui/material';
import UploadButton from './CommunityCreation/CommunityVisuals/UploadButton';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import api from '../src/api/axios';
export default function EditProfile({ open, onClose , user }) {
    const [user , setUser] = useState(user)
    const handleSubmit = async (event) => {
    event.preventDefault();
    usermame = user.username
    gold = user.gold
    image = user.image
    try{
    const response = await api.put('/api/users/edit' , {
        username,
        gold,
        image
    })
    if(response.status == 200){
        alert("User succesfully updated")
         onClose();
    }
    else{
         alert(response.status)
    }
    }
    catch(e){
        alert("Error: " + e.message)
    }
   
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="subscription-form">
          <div style = {{display : 'flex' , justifyContent : 'space-between'}}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="username"
            value={user.username}
            onChange={(e)=>setUser({...user , username:e.target.value})}
            fullWidth
            variant="standard"
          />
          <Avatar 
            src={user.image} 
            sx={{ width: 20, height: 20 }} 
            />
          </div>
            <TextField
            autoFocus
            required
            margin="dense"
            id="gold"
            name="gold"
            value = {user.gold}
            onChange={(e)=>setUser({...user , username:e.target.value})}
            label="Gold"
            type="gold"
            fullWidth
            variant="gold"
          />
          <UploadButton setCommunityVisuals = {setUser} edit = {true}/>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="subscription-form">
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
}