
import React, { useState, useEffect } from "react";
import "./EditPost.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../../src/api/axios";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/"; // Previous page or default to home

  const [post, setPost] = useState({
    title: "",
    content: "",
    mediaUrl: "",
    mediaType: "none",
    communityID: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/posts/${postId}`);
        if (response.data) {
          const post = response.data;
          setPost({
            title: post.title || "",
            content: post.content || "",
            mediaUrl: post.mediaUrl || "",
            mediaType: post.mediaType || "none",
            communityID: post.communityID?._id || "",
          });
        }
      } catch (err) {
        setError("Failed to fetch post.");
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
    const url = URL.createObjectURL(selectedFile);
    setPost({
      ...post,
      mediaUrl: url,
      mediaType: selectedFile.type.startsWith("image") ? "image" : "video",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/posts/edit/${postId}`, post);
      navigate(from); // Go back to previous page
    } catch (err) {
      alert("Failed to save changes: " + err.message);
    }
  };

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>{error}</div>;

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
            >
              {file ? "Change File" : "Upload Media"}
            </Button>
          </label>

          {file && (
            <Button
              variant="outlined"
              color="error"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                setFile(null);
                setPost({ ...post, mediaUrl: "", mediaType: "none" });
              }}
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
        >
          <option value="none">None</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </TextField>

        <div className="edit-post-actions">
          <Button type="submit" variant="contained">
            Save Changes
          </Button>
          <Button variant="outlined" onClick={() => navigate(from)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;


