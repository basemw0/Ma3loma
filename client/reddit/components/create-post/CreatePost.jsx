
// import React, { useState, useEffect } from "react";
// // ✅ CORRECT: Import your configured instance
// import api from "../../src/api/axios"; 
// import "./CreatePost.css";
// import { useParams } from "react-router-dom";
// import Button from "@mui/material/Button";
// import UploadFileIcon from "@mui/icons-material/UploadFile";

// const CreatePost = () => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [mediaUrl, setMediaUrl] = useState("");
//   const [file, setFile] = useState(null);
//   const {communityID} = useParams();
//   console.log("communityID:", communityID);
//   const [selectedCommunity, setSelectedCommunity] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const getCommunity = async (id) => {
//       try {
//         let response = await api.get("/api/communities/" + id);           
//         let data = response.data;
//         setSelectedCommunity(data);
//       } 
//       catch (e) {
//         alert("Error: " + e.message);
//       }
//     };
//     getCommunity(communityID);
//   }, []);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;
//     setFile(selectedFile);
//     const url = URL.createObjectURL(selectedFile);
//     setMediaUrl(url);
//   };

//   const handleSubmit = async () => {
//     if (!title || !content) {
//       setErrorMessage("Title and content are required.");
//       return;
//     }

//     const newPost = {
//       title,
//       content,
//       mediaUrl,
//       mediaType: mediaUrl ? (file.type.startsWith("image") ? "image" : "video") : "none",
//     };

//     try {
//       const response = await api.post(`/api/posts/${communityID}/create`, newPost);
//       console.log("Post Created: ", response.data);
      
//       // Reset form
//       setTitle("");
//       setContent("");
//       setMediaUrl("");
//       setFile(null);
//       setErrorMessage("");
//     } catch (error) {
//       alert("Error creating post: ", error.message);
//       setErrorMessage("Something went wrong while creating the post.");
//     }
//   };

//   if (!selectedCommunity) return <div>Loading...</div>;

//   return (
//     <div className="create-post-page">
//       <div className="create-post-content">
//         <div className="create-post-container">
//           <div className="community-selector">
//             <img src={selectedCommunity.icon} alt="community" className="community-icon" />
//             <span className="community-name">r/{selectedCommunity.name}</span>
//           </div>
//           <h1>Create Post</h1>
//           <div className="post-form">
//             <div className="post-form-item">
//               <label>Title</label>
//               <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter a title"
//               />
//             </div>

//             <div className="post-form-item">
//               <label>Content</label>
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="Enter post content"
//               ></textarea>
//             </div>

//             <div className="post-form-item">
//               <label>Media (optional)</label>
//               <input
//                 type="file"
//                 accept="image/*,video/*"
//                 style={{ display: "none" }}
//                 id="file-upload"
//                 onChange={handleFileChange}
//               />
//               <label htmlFor="file-upload">
//                 <Button
//                   variant="contained"
//                   component="span"
//                   startIcon={<UploadFileIcon />}
//                 >
//                   {file ? "Change File" : "Upload Media"}
//                 </Button>
//               </label>

//               {file && (
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   style={{ marginLeft: "10px" }}
//                   onClick={() => { setFile(null); setMediaUrl(""); }}
//                 >
//                   Remove Media
//                 </Button>
//               )}

//               {mediaUrl && (
//                 <div className="media-preview">
//                   {file.type.startsWith("image") ? (
//                     <img src={mediaUrl} alt="preview" />
//                   ) : (
//                     <video src={mediaUrl} controls />
//                   )}
//                 </div>
//               )}
//             </div>

//             {errorMessage && <div className="error-message">{errorMessage}</div>}

//             <div className="post-form-actions">
//               <button onClick={handleSubmit} className="submit-btn">
//                 Submit Post
//               </button>
//               <button className="cancel-btn" onClick={() => window.history.back()}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePost;
import React, { useState, useEffect } from "react";
// ✅ CORRECT: Import your configured instance
import api from "../../src/api/axios"; 
import "./CreatePost.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState(null);
  const {communityID} = useParams();
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = "/api/communities/"+communityID; // Previous page or home

  useEffect(() => {
    const getCommunity = async (id) => {
      try {
        let response = await api.get("/api/communities/" + id);           
        let data = response.data;
        setSelectedCommunity(data);
      } 
      catch (e) {
        alert("Error: " + e.message);
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

    const newPost = {
      title,
      content,
      mediaUrl,
      mediaType: mediaUrl ? (file.type.startsWith("image") ? "image" : "video") : "none",
    };

    try {
      const response = await api.post(`/api/posts/${communityID}/create`, newPost);
      console.log("Post Created: ", response.data);
      
      // Reset form
      setTitle("");
      setContent("");
      setMediaUrl("");
      setFile(null);
      setErrorMessage("");

      navigate(from); // Navigate back to previous page
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
                >
                  Remove Media
                </Button>
              )}

              {mediaUrl && (
                <div className="media-preview">
                  {file.type.startsWith("image") ? (
                    <img src={mediaUrl} alt="preview" />
                  ) : (
                    <video src={mediaUrl} controls />
                  )}
                </div>
              )}
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="post-form-actions">
              <button onClick={handleSubmit} className="submit-btn">
                Submit Post
              </button>
              <button className="cancel-btn" onClick={() => navigate(from)}>
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

