import React, { useState, useEffect } from "react";
import api from "../../src/api/axios"; 
import "./CreatePost.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import toast from 'react-hot-toast'; 

// 1. Import your upload utility
import uploadToCloudinary from "../../src/utils/uploadCloudinary"; 

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // 2. Add loading state
  const {communityID} = useParams();
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = "/api/communities/"+communityID; 

  useEffect(() => {
    const getCommunity = async (id) => {
      try {
        let response = await api.get("/api/communities/" + id);           
        let data = response.data;
        setSelectedCommunity(data);
      } 
      catch (e) {
        console.error(e);
      }
    };
    getCommunity(communityID);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setMediaUrl(url);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setErrorMessage("Title and content are required.");
      return;
    }

    try {
      setIsUploading(true); // Start loading
      let finalMediaUrl = "";
      let finalMediaType = "none";

      // 3. Upload file to Cloudinary first if a file exists
      if (file) {
        // This uploads the file and waits for the REAL internet URL
        const uploadData = await uploadToCloudinary(file);
        
        if (uploadData && uploadData.url) {
            finalMediaUrl = uploadData.url; // Use the Cloudinary URL
            finalMediaType = uploadData.type === "video" ? "video" : "image";
        }
      }

      // 4. Create the post using the Cloudinary URL (not the blob!)
      const newPost = {
        title,
        content,
        mediaUrl: finalMediaUrl, 
        mediaType: finalMediaType,
      };

      const response = await api.post(`/api/posts/${communityID}/create`, newPost);
      console.log("Post Created: ", response.data);
      
      toast.success("Post created successfully!");
      
      // Cleanup
      setTitle("");
      setContent("");
      setMediaUrl("");
      setFile(null);
      setErrorMessage("");

      navigate(from); 
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong while creating the post.");
      toast.error("Failed to create post");
    } finally {
      setIsUploading(false); // Stop loading
    }
  };

  if (!selectedCommunity) return <div>Loading...</div>;

  return (
    <div className="create-post-page">
      <div className="create-post-content">
        <div className="create-post-container">
          <div className="community-selector">
            <img src={selectedCommunity.icon} alt="community" className="community-icon" />
            <span className="community-name">r/{selectedCommunity.name}</span>
          </div>
          <h1>Create Post</h1>
          <div className="post-form">
            <div className="post-form-item">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title"
              />
            </div>

            <div className="post-form-item">
              <label>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter post content"
              ></textarea>
            </div>

            <div className="post-form-item">
              <label>Media (optional)</label>
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
                  disabled={isUploading}
                >
                  {file ? "Change File" : "Upload Media"}
                </Button>
              </label>

              {file && (
                <Button
                  variant="outlined"
                  color="error"
                  style={{ marginLeft: "10px" }}
                  onClick={() => { setFile(null); setMediaUrl(""); }}
                  disabled={isUploading}
                >
                  Remove Media
                </Button>
              )}

              {/* Preview the local blob while editing */}
              {mediaUrl && (
                <div className="media-preview">
                  {file && file.type.startsWith("image") ? (
                    <img src={mediaUrl} alt="preview" />
                  ) : (
                    <video src={mediaUrl} controls />
                  )}
                </div>
              )}
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="post-form-actions">
              <button 
                onClick={handleSubmit} 
                className="submit-btn"
                disabled={isUploading}
                style={{ opacity: isUploading ? 0.7 : 1, cursor: isUploading ? 'not-allowed' : 'pointer' }}
              >
                {isUploading ? "Uploading..." : "Submit Post"}
              </button>
              <button className="cancel-btn" onClick={() => navigate(from)} disabled={isUploading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;