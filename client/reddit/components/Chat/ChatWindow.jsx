import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, 
  Avatar, CircularProgress 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

import api from '../../src/api/axios'; 

export default function ChatWindow({ recipient, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      if (!recipient?._id) return;
      
      const response = await api.get(`/api/chat/messages/${recipient._id}`);
      
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error("API returned non-array:", response.data);
        setMessages([]); 
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    const interval = setInterval(fetchMessages, 1000); 
    return () => clearInterval(interval);
  }, [recipient?._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const tempMsg = {
        _id: Date.now(), 
        content: newMessage,
        senderID: { _id: "me" }, 
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, tempMsg]);
      const msgToSend = newMessage;
      setNewMessage("");

      await api.post(`/api/chat/send/${recipient._id}`, {
        content: msgToSend
      });
      
      fetchMessages(); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 80, 
        width: 320,
        height: 450,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10000,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        bgcolor: '#0079d3', 
        color: 'white', 
        p: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={recipient?.image} sx={{ width: 30, height: 30 }} />
          <Typography variant="subtitle2" fontWeight={700}>
            {recipient?.username || "User"}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: 2, 
        bgcolor: '#f6f7f8',
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          messages.length > 0 ? (
            messages.map((msg, index) => {
              const sender = msg.senderID || {}; 
              const senderId = sender._id || sender; 
              
              const isFromThem = senderId === recipient?._id;
              
              return (
                <Box
                  key={index}
                  sx={{
                    alignSelf: isFromThem ? 'flex-start' : 'flex-end',
                    bgcolor: isFromThem ? '#e4e6eb' : '#0079d3',
                    color: isFromThem ? 'black' : 'white',
                    p: 1,
                    px: 2,
                    borderRadius: '18px',
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                    fontSize: '0.9rem'
                  }}
                >
                  {msg.content}
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
              No messages yet.
            </Typography>
          )
        )}
        <div ref={scrollRef} />
      </Box>

      <Box sx={{ p: 1.5, bgcolor: 'white', borderTop: '1px solid #ccc', display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth 
          size="small" 
          placeholder="Message..." 
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{ 
            '& .MuiOutlinedInput-root': { borderRadius: '20px', bgcolor: '#f6f7f8' }
          }}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!newMessage.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}