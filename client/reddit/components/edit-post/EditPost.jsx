import React, { useState, useEffect } from "react";
import "./EditPost.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../src/api/axios";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import uploadToCloudinary from "../../src/utils/uploadCloudinary";
import toast from 'react-hot-toast'; 

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [post, setPost] = useState({
    title: "",
    content: "",
    mediaUrl: "",
    mediaType: "none",
    communityID: "",
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/posts/${postId}`);
        if (response.data) {
          const fetchedPost = response.data;
          setPost({
            title: fetchedPost.title || "",
            content: fetchedPost.content || "",
            mediaUrl: fetchedPost.mediaUrl || "",
            mediaType: fetchedPost.mediaType || "none",
            communityID: fetchedPost.communityID?._id || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    const previewUrl = URL.createObjectURL(selectedFile);
    
    setPost({
      ...post,
      mediaUrl: previewUrl, 
      mediaType: selectedFile.type.startsWith("image") ? "image" : "video",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalMediaUrl = post.mediaUrl;
      let finalMediaType = post.mediaType;

    
      if (file) {
        const uploadData = await uploadToCloudinary(file);
        if (uploadData && uploadData.url) {
            finalMediaUrl = uploadData.url;
            finalMediaType = uploadData.type === "video" ? "video" : "image";
        }
      }

      const updatedPost = {
        ...post,
        mediaUrl: finalMediaUrl, 
        mediaType: finalMediaType
      };

      await api.put(`/api/posts/edit/${postId}`, updatedPost);
      
      toast.success("Post updated successfully!");
      navigate(from); 

    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading post...</div>;

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
          required
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
        />

        <div className="edit-post-media">
          <input
            type="file"
            accept="image/*,video/*"
            style={{ display: "none" }}
            id="file-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadFileIcon />}
              disabled={isSaving}
            >
              {file ? "Change File" : "Upload Media"}
            </Button>
          </label>

          {(file || post.mediaUrl) && (
            <Button
              variant="outlined"
              color="error"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setFile(null);
                setPost({ ...post, mediaUrl: "", mediaType: "none" });
              }}
              disabled={isSaving}
            >
              Remove Media
            </Button>
          )}

          {post.mediaUrl && (
            <div className="media-preview">
              {post.mediaType === "image" ? (
                <img src={post.mediaUrl} alt="preview" />
              ) : (
                <video src={post.mediaUrl} controls />
              )}
            </div>
          )}
        </div>

        
        <TextField
          select
          SelectProps={{ native: true }}
          label="Media Type"
          name="mediaType"
          value={post.mediaType}
          onChange={handleChange}
          fullWidth
          disabled={isSaving}
        >
          <option value="none">None</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </TextField>

        <div className="edit-post-actions">
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSaving}
            style={{ opacity: isSaving ? 0.7 : 1 }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={() => navigate(from)}
            disabled={isSaving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;