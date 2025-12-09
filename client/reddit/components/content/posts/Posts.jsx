
import React, { useState, useEffect } from "react"; // ✅ Import useState
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
  const handlevote = async (type, id) => {
    const action = type === 1 ? "upvote" : "downvote";

    try {
      const response = await axios.put(
        `http://localhost:3000/api/posts/${id}/${action}`
      );

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
                src={post.userID?.image} 
                alt="community"
                className="subreddit-icon modern-icon"
              />

              <div className="header-text">
                <span className="subreddit-link">r/{post.communityID?.name}</span>
                <span className="meta-dot">•</span>
                <span className="user-meta">u/{post.userID?.username}</span>
                <span className="time-meta">{formatTime(post.createdAt)}</span>
              </div>

              <button className="join-btn modern-join">Join</button>
            </div>

            <div className="card-body">
              <h3 className="post-title modern-title">{post.title}</h3>

              {post.content && (
                <p className="post-text modern-text">{post.content}</p>
              )}

              <div className="media-wrapper modern-media">
                {post.mediaType === "image" && post.mediaUrl && (
                  <img src={post.mediaUrl} className="post-image" alt="Post content" />
                )}

                {post.mediaType === "video" && post.mediaUrl && (
                  <Video src={post.mediaUrl} className="post-video" />
                )}
              </div>
            </div>

            <div className="card-footer modern-footer">
              <div className="action-pill modern-pill">
                <ChatBubbleOutlineIcon fontSize="small" />
                <span>{formatNumber(post.commentCount || 0)} Comments</span>
              </div>
              <div className="action-pill modern-pill">
                <ShareOutlinedIcon fontSize="small" />
                <span>Share</span>
              </div>
              <div className="action-pill modern-pill">
                <BookmarkBorderOutlinedIcon fontSize="small" />
                <span>Save</span>
              </div>
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
  if (!num && num !== 0) return "0"; // Handle undefined/null
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

function formatTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}