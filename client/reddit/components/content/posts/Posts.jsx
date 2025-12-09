<<<<<<< HEAD
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
// import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import Video from "../../video/Video"; 
// import axios from 'axios';
// import React, { useState } from "react";
// import "./Posts.css";
=======
// import React, { useState, useEffect } from "react";
// import axios from "axios"; // Importing Axios

// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import ModeCommentIcon from "@mui/icons-material/ModeComment";
// import ShareIcon from "@mui/icons-material/Share";
// import BookmarkIcon from "@mui/icons-material/Bookmark";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import Button from "../../button/Button";
// import Video from "../../video/Video"; // If you're displaying video

// import "./Posts.css";

// export default function Posts() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/api/posts/home")
//       .then((response) => {
//         setPosts(response.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Error fetching posts.");
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="posts-wrapper">
//       {loading ? (
//         <p>Loading posts...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         posts.map((post, index) => (
//           <div className="post" key={post._id}>
            
//             {/* LEFT VOTES */}
//             <div className="post-sidebar">
//               <ArrowUpwardIcon className="upvote" />
//               {/* Fixed: use post.votes */}
//               <span>{post.votes}</span>
//               <ArrowDownwardIcon className="downvote" />
//             </div>

//             <div className="post-title">

//               {/* Fixed: use post.communityID.image (not image_src) */}
//               <img 
//                 src={post.communityID.image || "default_image.jpg"} 
//                 alt={`Community ${post.communityID.name}`} 
//               />

//               <span className="subreddit-name">r/{post.communityID.name}</span>
//               <span className="post-user">Posted by</span>
//               <span className="post-user underline">u/{post.userID.username}</span>
//               <span className="timestamp">• {post.createdAt}</span>

//               <div className="spacer"></div>
//               <Button label="+ JOIN" />
//             </div>

//             {/* BODY */}
//             <div className="post-body">
//               <span className="title">{post.title}</span>

//               {/* Optional: handle media types if backend implements them */}
//              {
//                 post.mediaType === "image" && post.mediaUrl && (
//                   <img src={post.mediaUrl} alt={post.title} />
//                 )
//               }

//               {
//                 post.mediaType === "video" && post.mediaUrl && (
//                   <Video src={post.mediaUrl} />
//                 )
//               }

//               {post.content && (
//                 <span className="description">{post.content}</span>
//               )}
//             </div>

//             {/* FOOTER */}
//             <div className="post-footer">
//               <div className="comments footer-action">
//                 <ModeCommentIcon className="comment-icon" />
//                 <span>{post.comments?.length || 0} Comments</span>
//               </div>

//               <div className="share footer-action">
//                 <ShareIcon />
//                 <span>Share</span>
//               </div>

//               <div className="save footer-action">
//                 <BookmarkIcon />
//                 <span>Save</span>
//               </div>

//               <MoreHorizIcon className="more-icon footer-action" />
//             </div>

//           </div>
//         ))
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d

// export default function Posts({ posts }) {
//   if (!posts || posts.length === 0) {
//     return <div className="no-posts">No posts to display</div>;
//   }
//       const [postList, setPostList] = useState(posts || []);

//       const handlevote = async (type, id) => {
//         alert('ay 7aga b2a');
//     const action = type === 1 ? "upvote" : "downvote";

//     try {
//       const response = await axios.put(
//         `http://localhost:3000/api/posts/${id}/${action}`
//       );
//       alert('response: ', response.data);

//       if (response.data) {
//         setPostList((prev) =>
//           prev.map((p) => (p._id === id ? response.data : p))
//         );
//       }
//     } catch (e) {
//       alert("Error: " + e.message);
//     }
//   };


//   return (
//     <div className="feed-container">
//       {posts.map((post) => (
//         <div className="reddit-card modern" key={post._id}>
          
//           {/* LEFT VOTE SIDEBAR */}
//           <div className="card-sidebar modern-sidebar">
//             <button className="vote-btn up">
//               <ArrowUpwardIcon onClick={() => handlevote(1, post._id)} fontSize="inherit" />
//             </button>
            
//             <span className="vote-count modern-vote">
//               {formatNumber(post.voteCount)}
//             </span>

//             <button className="vote-btn down">
//               <ArrowDownwardIcon onClick={() => handlevote(2, post._id)} fontSize="inherit" />
//             </button>
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="card-content">

//             {/* HEADER */}
//             <div className="card-header">
//               <img 
//                 src={post.communityID.icon}
//                 alt="community"
//                 className="subreddit-icon modern-icon"
//               />

//               <div className="header-text">
//                 <span className="subreddit-link">r/{post.communityID.name}</span>
//                 <span className="meta-dot">•</span>
//                 <span className="user-meta">u/{post.userID.username}</span>
//                 <span className="time-meta">{formatTime(post.createdAt)}</span>
//               </div>

//               <button className="join-btn modern-join">Join</button>
//             </div>

//             {/* BODY */}
//             <div className="card-body">
//               <h3 className="post-title modern-title">{post.title}</h3>

//               {post.content && (
//                 <p className="post-text modern-text">{post.content}</p>
//               )}

//               <div className="media-wrapper modern-media">
//                 {post.mediaType === "image" && post.mediaUrl && (
//                   <img src={post.mediaUrl} className="post-image" />
//                 )}

//                 {post.mediaType === "video" && post.mediaUrl && (
//                   <Video src={post.mediaUrl} className="post-video" />
//                 )}
//               </div>
//             </div>

//             {/* FOOTER */}
//             <div className="card-footer modern-footer">

//               <div className="action-pill modern-pill">
//                 <ChatBubbleOutlineIcon fontSize="small" />
//                 <span>{formatNumber(post.comments?.length || 0)} Comments</span>
//               </div>

//               <div className="action-pill modern-pill">
//                 <ShareOutlinedIcon fontSize="small" />
//                 <span>Share</span>
//               </div>

//               <div className="action-pill modern-pill">
//                 <BookmarkBorderOutlinedIcon fontSize="small" />
//                 <span>Save</span>
//               </div>

//               <div className="action-pill icon-only modern-pill">
//                 <MoreHorizIcon fontSize="small" />
//               </div>

//             </div>

//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// // Helpers
// function formatNumber(num) {
//   if (!num) return "0";
//   if (num >= 1000) return (num / 1000).toFixed(1) + "k";
//   return num;
// }

// // Modern date formatting
// function formatTime(dateString) {
//   const date = new Date(dateString);
//   return date.toLocaleString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }
import React, { useState, useEffect } from "react"; // ✅ Import useState
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
<<<<<<< HEAD
import Video from "../../video/Video"; 
import axios from 'axios';
import "./Posts.css";

export default function Posts({ posts }) {
  // ✅ 1. Initialize State with the props
  // We need state because props cannot be changed, but state can.
  const [postList, setPostList] = useState(posts || []);

  // ✅ 2. Sync state if props change (e.g. sorting filter changes)
  useEffect(() => {
    setPostList(posts || []);
  }, [posts]);

  if (!postList || postList.length === 0) {
    return <div className="no-posts">No posts to display</div>;
  }

  // ✅ 3. The Vote Handler (Immediate Update Logic)
=======
import Video from "../../video/Video";

import "./Posts.css";

export default function Posts({ posts }) {

  // Local state so vote updates reflect instantly
  const [postList, setPostList] = useState(posts || []);

  // Copy your exact vote handler from PostDetails
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
  const handlevote = async (type, id) => {
    const action = type === 1 ? "upvote" : "downvote";

    try {
      const response = await axios.put(
        `http://localhost:3000/api/posts/${id}/${action}`
      );

<<<<<<< HEAD
      // This is the magic part:
      if (response.data && response.data._id) {
        setPostList((prevList) => 
          prevList.map((post) => {
            if (post._id === id) {
              console.log("Updating Post ID:", id); // ✅ Confirm match
              return response.data;
            }
            return post;
          })
        );
      }
    } catch (e) {
      console.error(e);
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="feed-container">
      {/* ✅ Use 'postList' here, NOT 'posts' */}
      {postList.map((post) => (
        <div className="reddit-card modern" key={post._id}>
          
          <div className="card-sidebar modern-sidebar">
            <button className="vote-btn up">
              <ArrowUpwardIcon onClick={() => handlevote(1, post._id)} fontSize="inherit" />
            </button>
            
            {/* ✅ Show the live vote count from state */}
            <span className="vote-count modern-vote">
              {formatNumber(post.voteCount)}
            </span>

            <button className="vote-btn down">
              <ArrowDownwardIcon onClick={() => handlevote(2, post._id)} fontSize="inherit" />
            </button>
          </div>

          <div className="card-content">
            <div className="card-header">
              {/* Optional chaining ?. prevents crash if data is missing */}
              <img 
                src={post.communityID?.icon} 
=======
      if (response.data) {
        setPostList((prev) =>
          prev.map((p) => (p._id === id ? response.data : p))
        );
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  if (!postList || postList.length === 0) {
    return <div className="no-posts">No posts to display</div>;
  }

  return (
    <div className="feed-container">
      {postList.map((post) => (
        <div className="reddit-card modern" key={post._id}>

          {/* LEFT VOTE SIDEBAR */}
          <div className="card-sidebar modern-sidebar">

            {/* UPVOTE BUTTON */}
            <button
              className="vote-btn up"
              onClick={() => handlevote(1, post._id)}
            >
              <ArrowUpwardIcon fontSize="inherit" />
            </button>

            {/* NET SCORE */}
            <span className="vote-count modern-vote">
              {formatNumber(post.upvotes?.length - post.downvotes?.length)}
            </span>

            {/* DOWNVOTE BUTTON */}
            <button
              className="vote-btn down"
              onClick={() => handlevote(2, post._id)}
            >
              <ArrowDownwardIcon fontSize="inherit" />
            </button>

          </div>

          {/* RIGHT CONTENT */}
          <div className="card-content">

            {/* HEADER */}
            <div className="card-header">
              <img
                src={post.communityID.icon}
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
                alt="community"
                className="subreddit-icon modern-icon"
              />

              <div className="header-text">
<<<<<<< HEAD
                <span className="subreddit-link">r/{post.communityID?.name}</span>
                <span className="meta-dot">•</span>
                <span className="user-meta">u/{post.userID?.username}</span>
=======
                <span className="subreddit-link">r/{post.communityID.name}</span>
                <span className="meta-dot">•</span>
                <span className="user-meta">u/{post.userID.username}</span>
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
                <span className="time-meta">{formatTime(post.createdAt)}</span>
              </div>

              <button className="join-btn modern-join">Join</button>
            </div>

<<<<<<< HEAD
=======
            {/* BODY */}
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
            <div className="card-body">
              <h3 className="post-title modern-title">{post.title}</h3>

              {post.content && (
                <p className="post-text modern-text">{post.content}</p>
              )}

              <div className="media-wrapper modern-media">
                {post.mediaType === "image" && post.mediaUrl && (
<<<<<<< HEAD
                  <img src={post.mediaUrl} className="post-image" alt="Post content" />
=======
                  <img src={post.mediaUrl} className="post-image" />
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
                )}

                {post.mediaType === "video" && post.mediaUrl && (
                  <Video src={post.mediaUrl} className="post-video" />
                )}
              </div>
            </div>

<<<<<<< HEAD
            <div className="card-footer modern-footer">
              <div className="action-pill modern-pill">
                <ChatBubbleOutlineIcon fontSize="small" />
                <span>{formatNumber(post.commentCount || 0)} Comments</span>
              </div>
=======
            {/* FOOTER */}
            <div className="card-footer modern-footer">
              <div className="action-pill modern-pill">
                <ChatBubbleOutlineIcon fontSize="small" />
                <span>{formatNumber(post.comments?.length || 0)} Comments</span>
              </div>

>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
              <div className="action-pill modern-pill">
                <ShareOutlinedIcon fontSize="small" />
                <span>Share</span>
              </div>
<<<<<<< HEAD
=======

>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
              <div className="action-pill modern-pill">
                <BookmarkBorderOutlinedIcon fontSize="small" />
                <span>Save</span>
              </div>
<<<<<<< HEAD
=======

>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
              <div className="action-pill icon-only modern-pill">
                <MoreHorizIcon fontSize="small" />
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

// Helpers
function formatNumber(num) {
<<<<<<< HEAD
  if (!num && num !== 0) return "0"; // Handle undefined/null
=======
  if (!num) return "0";
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

function formatTime(dateString) {
<<<<<<< HEAD
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
=======
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
>>>>>>> b4636e16ec177d640d52763fff8c97c47819a30d
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}