import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 1. Import useNavigate
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Video from "../../video/Video"; 
import api from "../../../src/api/axios";
import "./Posts.css";

export default function Posts({ posts }) {
  const [postList, setPostList] = useState(posts || []);
  const navigate = useNavigate(); // ✅ 2. Initialize navigation

  useEffect(() => {
    setPostList(posts || []);
  }, [posts]);

  // ✅ 3. Navigation Handler
  const openPost = (id) => {
    // Matches the route in App.jsx: path="api/posts/:postId"
    navigate(`/api/posts/${id}`);
  };

  const handlevote = async (type, id, e) => {
    e.stopPropagation(); // ✅ Stop click from triggering openPost
    const action = type === 1 ? "upvote" : "downvote";

    try {
      const response = await api.put(
        `http://localhost:3000/api/posts/${id}/${action}`
      );

      if (response.data && response.data._id) {
        setPostList((prevList) => 
          prevList.map((post) => {
            if (post._id === id) {
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

  // Helper function to stop propagation on buttons (like Share/Save)
  const stopProp = (e) => {
    e.stopPropagation();
  };

  if (!postList || postList.length === 0) {
    return <div className="no-posts">No posts to display</div>;
  }

  return (
    <div className="feed-container">
      {postList.map((post) => (
        <div className="reddit-card modern" key={post._id}>
          
          <div className="card-sidebar modern-sidebar">
            <button className="vote-btn up" onClick={(e) => handlevote(1, post._id, e)}>
              <ArrowUpwardIcon fontSize="inherit" />
            </button>
            
            <span className="vote-count modern-vote">
              {formatNumber(post.voteCount)}
            </span>

            <button className="vote-btn down" onClick={(e) => handlevote(2, post._id, e)}>
              <ArrowDownwardIcon fontSize="inherit" />
            </button>
          </div>

          <div className="card-content">
            <div className="card-header">
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

              <button className="join-btn modern-join" onClick={stopProp}>Join</button>
            </div>

            {/* ✅ 4. Make Body Clickable */}
            <div 
                className="card-body" 
                onClick={() => openPost(post._id)}
                style={{ cursor: "pointer" }}
            >
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
              {/* ✅ 5. Make Comments Clickable */}
              <div 
                className="action-pill modern-pill" 
                onClick={() => openPost(post._id)}
                style={{ cursor: "pointer" }}
              >
                <ChatBubbleOutlineIcon fontSize="small" />
                <span>{formatNumber(post.commentCount || 0)} Comments</span>
              </div>

              <div className="action-pill modern-pill" onClick={stopProp}>
                <ShareOutlinedIcon fontSize="small" />
                <span>Share</span>
              </div>
              <div className="action-pill modern-pill" onClick={stopProp}>
                <BookmarkBorderOutlinedIcon fontSize="small" />
                <span>Save</span>
              </div>
              <div className="action-pill icon-only modern-pill" onClick={stopProp}>
                <MoreHorizIcon fontSize="small" />
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

// Helpers (No changes here)
function formatNumber(num) {
  if (!num && num !== 0) return "0"; 
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