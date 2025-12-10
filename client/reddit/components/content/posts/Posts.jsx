import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Video from "../../video/Video"; 
import api from "../../../src/api/axios";
import "./Posts.css";
import { useAuthModal } from "../../../src/context/AuthModalContext";

// Helper to get ID from token safely
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  } catch (e) {
    return null;
  }
};

export default function Posts({ posts }) {
  const [postList, setPostList] = useState(posts || []);
  // We track joined status locally map: { communityId: boolean }
  const [joinedCommunities, setJoinedCommunities] = useState({});
  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();
  const { openLogin } = useAuthModal();
  useEffect(() => {
    setPostList(posts || []);
    
    // OPTIONAL: Initialize joined status if passed in post, 
    // otherwise we default to false until clicked
    if(posts) {
        const initialJoinState = {};
        posts.forEach(p => {
             if(p.communityID) {
                // If your backend sent 'isMember', use it. 
                // Otherwise we default to false.
                initialJoinState[p.communityID._id] = p.communityID.isMember || false; 
             }
        });
        setJoinedCommunities(initialJoinState);
    }
  }, [posts]);

  const openPost = (id) => {
    navigate(`/api/posts/${id}`);
  };

  const handlevote = async (type, id, e) => {
    e.stopPropagation();
    if (!currentUserId) {openLogin(); return;};

    const action = type === 1 ? "upvote" : "downvote";

    try {
      const response = await api.put(`/api/posts/${id}/${action}`);
      
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

  const handleJoin = async (communityId, e) => {
    e.stopPropagation(); // Prevent opening post
    if (!currentUserId) {openLogin(); return;};

    const isJoined = joinedCommunities[communityId];
    // If currently joined (true), action is 0 (leave). If not (false), action is 1 (join).
    const action = isJoined ? 0 : 1; 

    try {
        const response = await api.post(`/api/communities/${communityId}/join`, { action });
        
        if (response.status === 200) {
            setJoinedCommunities(prev => ({
                ...prev,
                [communityId]: !isJoined
            }));
        }
    } catch (error) {
        alert("Failed to join/leave: " + error.message);
    }
  };

  const stopProp = (e) => {
    e.stopPropagation();
  };

  if (!postList || postList.length === 0) {
    return <div className="no-posts">No posts to display</div>;
  }

  return (
    <div className="feed-container">
      {postList.map((post) => {
        // Determine vote status
        const isUpvoted = post.upvotes && post.upvotes.includes(currentUserId);
        const isDownvoted = post.downvotes && post.downvotes.includes(currentUserId);
        
        // Determine join status
        const isJoined = joinedCommunities[post.communityID?._id];

        // Determine Vote Count Color
        let voteClass = "modern-vote";
        if (isUpvoted) voteClass += " up-active";
        if (isDownvoted) voteClass += " down-active";

        return (
        <div className="reddit-card modern" key={post._id}>
          
          <div className="card-sidebar modern-sidebar">
            <button 
                className={`vote-btn up ${isUpvoted ? "active" : ""}`} 
                onClick={(e) => handlevote(1, post._id, e)}
            >
              <ArrowUpwardIcon fontSize="inherit" />
            </button>
            
            <span className={voteClass}>
              {formatNumber(post.voteCount)}
            </span>

            <button 
                className={`vote-btn down ${isDownvoted ? "active" : ""}`} 
                onClick={(e) => handlevote(2, post._id, e)}
            >
              <ArrowDownwardIcon fontSize="inherit" />
            </button>
          </div>

          <div className="card-content">
            <div className="card-header">
              <img 
                src={post.userID?.image || "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"} 
                alt="user"
                className="subreddit-icon modern-icon"
              />

              <div className="header-text">
                <span className="subreddit-link">r/{post.communityID?.name}</span>
                <span className="meta-dot">•</span>
                <span className="user-meta">u/{post.userID?.username}</span>
                <span className="time-meta">{formatTime(post.createdAt)}</span>
              </div>

              {/* JOIN BUTTON */}
              <button 
                className={`join-btn modern-join ${isJoined ? "joined" : ""}`} 
                onClick={(e) => handleJoin(post.communityID?._id, e)}
              >
                {isJoined ? "Joined" : "Join"}
              </button>
            </div>

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
              <div 
                className="action-pill modern-pill" 
                onClick={() => openPost(post._id)}
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
      )})}
    </div>
  );
}

// Helpers
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