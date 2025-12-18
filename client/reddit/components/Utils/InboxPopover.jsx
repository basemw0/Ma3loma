import React, { useState, useEffect } from 'react';
import { 
  Popover, List, ListItem, ListItemAvatar, 
  Avatar, ListItemText, Typography, Divider, 
  Box, CircularProgress 
} from '@mui/material';

// ✅ FIX 1: Corrected Import Path (Removed extra 'src/')
// Ensure this matches your actual folder structure
import api from '../../src/api/axios'; 

export default function InboxPopover({ anchorEl, onClose, onOpenChat }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (open) {
      fetchInbox();
    }
  }, [open]);

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/chat/inbox');
      
      // ✅ FIX 2: Safety Check - Ensure we received an Array
      if (Array.isArray(response.data)) {
        setConversations(response.data);
      } else {
        console.error("Inbox data is not an array:", response.data);
        setConversations([]); // Fallback to empty to prevent crash
      }
    } catch (error) {
      console.error("Error fetching inbox:", error);
      setConversations([]); // Fallback on error
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (friend) => {
    // ✅ FIX 3: Safety Check - Ensure function exists before calling
    if (onOpenChat && friend) {
      onOpenChat(friend);
    }
    onClose(); 
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" fontWeight="bold">Chats</Typography>
      </Box>

      {loading ? (
        <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} /></Box>
      ) : conversations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No chats yet.</Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {conversations.map((chat) => (
            <React.Fragment key={chat.conversationId || Math.random()}>
              <ListItem 
                button 
                onClick={() => handleSelect(chat.friend)}
                alignItems="flex-start"
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
              >
                <ListItemAvatar>
                  <Avatar src={chat.friend?.image} alt={chat.friend?.username} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold" variant="body2">
                      {chat.friend?.username || "Unknown User"}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ maxWidth: '200px' }}
                    >
                      {/* ✅ FIX 4: Safety Check - Handle missing lastMessage */}
                      {chat.lastMessage?.content || "No messages"}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Popover>
  );
}