import React, { useState } from "react";
import axios from "axios";  // Add Axios import
import "./CreatePost.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const {communityID} = useParams()
  console.log("communityID:", communityID)
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const getCommunity = async (id) => {
        try {
            let response = await axios.get("http://localhost:3000/api/communities/" + id);
            let data = response.data;
            setSelectedCommunity(data);
        } 
        catch (e) {
            alert("Error: " + e.message);
        }
    };
        getCommunity(communityID);
    }, []);
  const handleSubmit = async () => {
    if (!title || !content) {
      setErrorMessage("Title and content are required.");
      return;
    }

    const newPost = {
      title,
      content,
      mediaUrl,
      mediaType: mediaUrl ? "image" : "none",  // Assigning mediaType based on URL ///4of ya omar ezay nfr2 ben el ragle wa el set 8er el far2 ely kol el nas 3arfah (image wa video)
    };
    try {
      // Make Axios POST request to your backend
      const response = await axios.post(`http://localhost:3000/api/posts/${communityID}/create`, newPost);
      console.log("Post Created: ", response.data);
      
      // Reset form after successful post
      setTitle("");
      setContent("");
      setMediaUrl("");
      setErrorMessage("");  // Reset error message

    } catch (error) {
      alert("Error creating post: ", error.message);
      setErrorMessage("Something went wrong while creating the post.");
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
              <label>Media URL</label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Enter media URL (optional)"
              />
            </div>

            {/* <div className="post-form-item">
              <label>Select Community</label>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
              >
                <option value="">Select a community</option>
                <option value="community1">Community 1</option>
                <option value="community2">Community 2</option>
                <option value="community3">Community 3</option>
              </select>
            </div> */}

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="post-form-actions">
              <button onClick={handleSubmit} className="submit-btn">
                Submit Post
              </button>
              <button className="cancel-btn" onClick={() => window.history.back()}>
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