import React, { useState, useEffect } from "react";
import "./EditPost.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom"; // Import useNavigate instead of useHistory
import api from "../../src/api/axios";
const EditPost = () => {
  //const { postId } = useParams();
  const postId = useParams();
  //const navigate = useNavigate(); // Use useNavigate hook
  const [post, setPost] = useState({
    title: "",
    content: "",
    mediaUrl: "",
    mediaType: "none",
    communityID: "",
  });

  useEffect(() => {
    // Simulate API call to fetch post data
    const fetchPost = async () => {
      // Fetching post data based on `postId`
      // For now, we're just using mock data
      alert('hamada')
      const response = await api.get(`/api/posts/${postId}`);
      if(response.data){
        const post = response.data;
        setPost({
        title: post.title,
        content: post.content,
        mediaUrl: post.mediaUrl,
        mediaType: post.mediaType,
        communityID: post.communityID,
        });
      }
      
    };

    fetchPost();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit the post update logic
    //alert('hoba tito mambo',post);
    await api.put(`/api/posts/edit/${postId}`, post);
    // Redirect back to the post detail page (or homepage)
    //navigate(`/post/${postId}`); // Use navigate to redirect
  };

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  return (
    <div className="edit-post-container">
      <div className="edit-post-header">
        <h2>Edit Post</h2>
      </div>

      <form className="edit-post-form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          variant="outlined"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="edit-post-input"
        />
        
        <TextField
          fullWidth
          label="Content"
          variant="outlined"
          name="content"
          multiline
          rows={5}
          value={post.content}
          onChange={handleChange}
          className="edit-post-input"
        />
        
        <TextField
          fullWidth
          label="Media URL"
          variant="outlined"
          name="mediaUrl"
          value={post.mediaUrl}
          onChange={handleChange}
          className="edit-post-input"
        />
        
        <div className="edit-post-options">
          <label>Media Type:</label>
          <select
            name="mediaType"
            value={post.mediaType}
            onChange={handleChange}
            className="edit-post-select"
          >
            <option value="none">None</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="edit-post-actions">
          <Button variant="contained" color="primary" type="submit">
            Save Changes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/post/${postId}`)} // Use navigate to redirect
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
