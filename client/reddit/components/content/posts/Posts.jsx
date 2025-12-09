import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Video from "../../video/Video"; 

import "./Posts.css";

export default function Posts({ posts }) {
  if (!posts || posts.length === 0) {
    return <div className="no-posts">No posts to display</div>;
  }


  return (
    <div className="feed-container">
      {posts.map((post) => (
        <div className="reddit-card modern" key={post._id}>
          
          {/* LEFT VOTE SIDEBAR */}
          <div className="card-sidebar modern-sidebar">
            <button className="vote-btn up">
              <ArrowUpwardIcon fontSize="inherit" />
            </button>
            
            <span className="vote-count modern-vote">
              {formatNumber(post.upvotes?.length - post.downvotes?.length)}
            </span>

            <button className="vote-btn down">
              <ArrowDownwardIcon fontSize="inherit" />
            </button>
          </div>

          {/* RIGHT CONTENT */}
          <div className="card-content">

            {/* HEADER */}
            <div className="card-header">
              <img 
                src={post.communityID.icon}
                alt="community"
                className="subreddit-icon modern-icon"
              />

              <div className="header-text">
                <span className="subreddit-link">r/{post.communityID.name}</span>
                <span className="meta-dot">•</span>
                <span className="user-meta">u/{post.userID.username}</span>
                <span className="time-meta">{formatTime(post.createdAt)}</span>
              </div>

              <button className="join-btn modern-join">Join</button>
            </div>

            {/* BODY */}
            <div className="card-body">
              <h3 className="post-title modern-title">{post.title}</h3>

              {post.content && (
                <p className="post-text modern-text">{post.content}</p>
              )}

              <div className="media-wrapper modern-media">
                {post.mediaType === "image" && post.mediaUrl && (
                  <img src={post.mediaUrl} className="post-image" />
                )}

                {post.mediaType === "video" && post.mediaUrl && (
                  <Video src={post.mediaUrl} className="post-video" />
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="card-footer modern-footer">

              <div className="action-pill modern-pill">
                <ChatBubbleOutlineIcon fontSize="small" />
                <span>{formatNumber(post.comments?.length || 0)} Comments</span>
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
  if (!num) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

// Modern date formatting
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}