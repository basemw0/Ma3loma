// // import React, { useState, useEffect } from "react";
// // // ✅ CORRECT: Import your configured instance
// // import api from "../../src/api/axios"; 
// // import "./CreatePost.css";import "./CreatePost.css";
// // import { useParams } from "react-router-dom";
// // const CreatePost = () => {
// //   const [title, setTitle] = useState("");
// //   const [content, setContent] = useState("");
// //   const [mediaUrl, setMediaUrl] = useState("");
// //   const {communityID} = useParams()
// //   console.log("communityID:", communityID)
// //   const [selectedCommunity, setSelectedCommunity] = useState(null);
// //   const [errorMessage, setErrorMessage] = useState("");
// //   useEffect(() => {
// //     const getCommunity = async (id) => {
// //         try {
// //             let response = await api.get("/api/communities/" + id); // baseURL is already set!            
// //             let data = response.data;
// //             setSelectedCommunity(data);
// //         } 
// //         catch (e) {
// //             alert("Error: " + e.message);
// //         }
// //     };
// //         getCommunity(communityID);
// //     }, []);
// //   const handleSubmit = async () => {
// //     if (!title || !content) {
// //       setErrorMessage("Title and content are required.");
// //       return;
// //     }

// //     const newPost = {
// //       title,
// //       content,
// //       mediaUrl,
// //       mediaType: mediaUrl ? "image" : "none",  // Assigning mediaType based on URL ///4of ya omar ezay nfr2 ben el ragle wa el set 8er el far2 ely kol el nas 3arfah (image wa video)
// //     };
// //     try {
// //       // Make Axios POST request to your backend
// //       const response = await api.post(`/api/posts/${communityID}/create`, newPost);
// //       console.log("Post Created: ", response.data);
      
// //       // Reset form after successful post
// //       setTitle("");
// //       setContent("");
// //       setMediaUrl("");
// //       setErrorMessage("");  // Reset error message

// //     } catch (error) {
// //       alert("Error creating post: ", error.message);
// //       setErrorMessage("Something went wrong while creating the post.");
// //     }
// //   };
// //   if (!selectedCommunity) return <div>Loading...</div>;
// //   return (
    
// //     <div className="create-post-page">

// //       <div className="create-post-content">
// //         <div className="create-post-container">
// //           <div className="community-selector">
// //             <img src={selectedCommunity.icon} alt="community" className="community-icon" />
// //             <span className="community-name">r/{selectedCommunity.name}</span>
// //           </div>
// //           <h1>Create Post</h1>
// //           <div className="post-form">
// //             <div className="post-form-item">
// //               <label>Title</label>
// //               <input
// //                 type="text"
// //                 value={title}
// //                 onChange={(e) => setTitle(e.target.value)}
// //                 placeholder="Enter a title"
// //               />
// //             </div>

// //             <div className="post-form-item">
// //               <label>Content</label>
// //               <textarea
// //                 value={content}
// //                 onChange={(e) => setContent(e.target.value)}
// //                 placeholder="Enter post content"
// //               ></textarea>
// //             </div>

// //             <div className="post-form-item">
// //               <label>Media URL</label>
// //               <input
// //                 type="text"
// //                 value={mediaUrl}
// //                 onChange={(e) => setMediaUrl(e.target.value)}
// //                 placeholder="Enter media URL (optional)"
// //               />
// //             </div>

// //             {/* <div className="post-form-item">
// //               <label>Select Community</label>
// //               <select
// //                 value={selectedCommunity}
// //                 onChange={(e) => setSelectedCommunity(e.target.value)}
// //               >
// //                 <option value="">Select a community</option>
// //                 <option value="community1">Community 1</option>
// //                 <option value="community2">Community 2</option>
// //                 <option value="community3">Community 3</option>
// //               </select>
// //             </div> */}

// //             {errorMessage && <div className="error-message">{errorMessage}</div>}

// //             <div className="post-form-actions">
// //               <button onClick={handleSubmit} className="submit-btn">
// //                 Submit Post
// //               </button>
// //               <button className="cancel-btn" onClick={() => window.history.back()}>
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CreatePost;
// import React, { useState, useEffect } from "react";
// import api from "../../src/api/axios"; 
// import "./CreatePost.css";
// import { useParams } from "react-router-dom";
// import { Button } from "@mui/material"; // ✅ MUI Button
// import UploadFileIcon from '@mui/icons-material/UploadFile'; // Upload icon

// const CreatePost = () => {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [mediaUrl, setMediaUrl] = useState(""); // Will store uploaded file URL
//   const [file, setFile] = useState(null); // Selected file
//   const { communityID } = useParams();
//   const [selectedCommunity, setSelectedCommunity] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const getCommunity = async (id) => {
//       try {
//         let response = await api.get("/api/communities/" + id);
//         setSelectedCommunity(response.data);
//       } catch (e) {
//         alert("Error: " + e.message);
//       }
//     };
//     getCommunity(communityID);
//   }, []);

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       const selected = e.target.files[0];
//       setFile(selected);
//       // Create a temporary URL for preview
//       setMediaUrl(URL.createObjectURL(selected));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title || !content) {
//       setErrorMessage("Title and content are required.");
//       return;
//     }

//     let uploadedMediaUrl = mediaUrl;

//     // If a file is selected, upload it to backend first
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//         const uploadRes = await api.post("/api/upload", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         uploadedMediaUrl = uploadRes.data.url; // backend returns URL of uploaded file
//       } catch (err) {
//         alert("Error uploading file: " + err.message);
//         return;
//       }
//     }

//     const newPost = {
//       title,
//       content,
//       mediaUrl: uploadedMediaUrl,
//       mediaType: uploadedMediaUrl ? "image" : "none",
//     };

//     try {
//       const response = await api.post(`/api/posts/${communityID}/create`, newPost);
//       console.log("Post Created: ", response.data);
//       setTitle("");
//       setContent("");
//       setMediaUrl("");
//       setFile(null);
//       setErrorMessage("");
//     } catch (error) {
//       alert("Error creating post: " + error.message);
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
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [file, setFile] = useState(null);
  const {communityID} = useParams();
  console.log("communityID:", communityID);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

