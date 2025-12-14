
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import Video from "../../video/Video";
import api from "../../../src/api/axios";
import "./Posts.css";
import { useAuthModal } from "../../../src/context/AuthModalContext";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (e) {
    return null;
  }
};

export default function Posts({ posts }) {
  const [communityAwards, setCommunityAwards] = useState({});
  const [postList, setPostList] = useState(posts || []);
  const [joinedCommunities, setJoinedCommunities] = useState({});
  const [openAwardMenu, setOpenAwardMenu] = useState(null);
  const [savedPosts, setSavedPosts] = useState({});

  const navigate = useNavigate();
  const currentUserId = getUserIdFromToken();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    setPostList(posts || []);
    if (posts) {
      const initialJoinState = {};
      const initialSaveState = {};
      posts.forEach((p) => {
        if (p.communityID) {
          initialJoinState[p.communityID._id] = p.isMember || false;
        }
        initialSaveState[p._id] = p.isSaved || false;
      });
      setJoinedCommunities(initialJoinState);
      setSavedPosts(initialSaveState);
    }
  }, [posts]);

  const openPost = (id) => navigate(`/api/posts/${id}`);

  const handlevote = async (type, id, e) => {
    e.stopPropagation();
    if (!currentUserId) return openLogin();

    const action = type === 1 ? "upvote" : "downvote";
    try {
      const response = await api.put(`/api/posts/${id}/${action}`);
      if (response.data && response.data._id) {
        setPostList((prevList) =>
          prevList.map((post) =>
            post._id === id ? response.data : post
          )
        );
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const handleJoin = async (communityId, e) => {
    e.stopPropagation();
    if (!currentUserId) return openLogin();

    const isJoined = joinedCommunities[communityId];
    const action = isJoined ? 0 : 1;

    try {
      const response = await api.post(
        `/api/communities/${communityId}/join`,
        { action }
      );
      if (response.status === 200) {
        setJoinedCommunities((prev) => ({
          ...prev,
          [communityId]: !isJoined,
        }));
      }
    } catch (error) {
      alert("Failed to join/leave: " + error.message);
    }
  };

  const toggleAwardMenu = async (postId, e) => {
    e.stopPropagation();
    const post = postList.find((p) => p._id === postId);

    if (post?.communityID?._id) {
      await fetchAwards(post.communityID._id);
    }

    setOpenAwardMenu((prev) => (prev === postId ? null : postId));
  };

  const fetchAwards = async (communityId) => {
    try {
      const res = await api.get(`/api/communities/${communityId}`);
      const awards = res.data.awards || [];
      setCommunityAwards((prev) => ({
        ...prev,
        [communityId]: awards,
      }));
    } catch (err) {
      console.log("Failed to load awards");
    }
  };

  const giveAward = async (postId, awardType, e) => {
    e.stopPropagation();
    if (!currentUserId) return openLogin();

    try {
      await api.post(`/api/posts/${postId}/award/${awardType}`);
      alert("Award given!");
      setOpenAwardMenu(null);
    } catch (err) {
      alert("Failed to give award");
    }
  };

  const handleDelete = async (postId, e) => {
    e.stopPropagation();
    if (!currentUserId) return openLogin();

    const post = postList.find((p) => p._id === postId);
    if (!post || post.userID?._id !== currentUserId) {
      alert("You can only delete your own posts.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/api/posts/delete/${postId}`);
      setPostList((prev) => prev.filter((p) => p._id !== postId));
      alert("Post deleted successfully.");
    } catch (err) {
      alert("Failed to delete post: " + err.message);
    }
  };

  const handleSavePost = async (postId, e) => {
    e.stopPropagation();
    if (!currentUserId) return openLogin();

    try {
      const res = await api.post(`/api/posts/${postId}/save`);
      setSavedPosts((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));
      alert(res.data.message);
    } catch (err) {
      alert("Failed to save post: " + err.message);
    }
  };

  if (!postList || postList.length === 0) {
    return <div className="no-posts">No posts to display</div>;
  }

  return (
    <div className="feed-container">
      {postList.map((post) => {
        const isUpvoted =
          post.upvotes && post.upvotes.includes(currentUserId);
        const isDownvoted =
          post.downvotes && post.downvotes.includes(currentUserId);
        const isJoined =
          joinedCommunities[post.communityID?._id];

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
                className={`vote-btn down ${isDownvoted ? "active" : ""
                  }`}
                onClick={(e) => handlevote(2, post._id, e)}
              >
                <ArrowDownwardIcon fontSize="inherit" />
              </button>
            </div>

            <div className="card-content">
              <div className="card-header">
                <img
                  src={
                    post.userID?.image ||
                    "https://www.redditstatic.com/avatars/avatar_default_02_FF4500.png"
                  }
                  alt="user"
                  className="subreddit-icon modern-icon"
                />

                <div className="header-text">
                  <Link style={{
                    color: "inherit",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem"
                  }}
                    to={"/api/communities/" + post.communityID._id}>

                    r/{post.communityID?.name}

                  </Link>
                  <span className="meta-dot">•</span>

                  <span className="user-meta">
                    u/{post.userID?.username}
                  </span>

                  <span className="time-meta">
                    {formatTime(post.createdAt)}
                  </span>
                </div>


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
                <h3 className="post-title modern-title">
                  {post.title}
                </h3>

                {post.content && (
                  <p className="post-text modern-text">
                    {post.content}
                  </p>
                )}

                <div className="media-wrapper modern-media">
                  {post.mediaType === "image" && post.mediaUrl && (
                    <img
                      src={post.mediaUrl}
                      className="post-image"
                      alt="Post content"
                    />
                  )}

                  {post.mediaType === "video" &&
                    post.mediaUrl && <Video src={post.mediaUrl} />}
                </div>
              </div>

              <div className="card-footer modern-footer">
                <div
                  className="action-pill modern-pill"
                  onClick={() => openPost(post._id)}
                >
                  <ChatBubbleOutlineIcon fontSize="small" />
                  <span>
                    {formatNumber(post.commentCount || 0)} Comments
                  </span>
                </div>

                {/* Award Button */}
                <div
                  className="action-pill modern-pill"
                  onClick={(e) => toggleAwardMenu(post._id, e)}
                >
                  <CardGiftcardIcon fontSize="small" />
                  <span>Award</span>
                </div>

                <div className="action-pill modern-pill">
                  <ShareOutlinedIcon fontSize="small" />
                  <span>Share</span>
                </div>

                {/* Save / Unsave */}
                <div
                  className="action-pill modern-pill"
                  onClick={(e) => handleSavePost(post._id, e)}
                >
                  <BookmarkBorderOutlinedIcon
                    fontSize="small"
                    style={{ color: savedPosts[post._id] ? "#ff4500" : "inherit" }}
                  />
                  <span>{savedPosts[post._id] ? "Saved" : "Save"}</span>
                </div>

                <div className="action-pill icon-only modern-pill">
                  <MoreHorizIcon fontSize="small" />
                </div>

                {/* Edit button for post owner */}
                {post.userID?._id === currentUserId && (
                  <div
                    className="action-pill modern-pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/api/posts/${post._id}/edit`);
                    }}
                    style={{ color: "#0079d3" }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                    <span>Edit</span>
                  </div>
                )}

                {/* Delete button for post owner */}
                {post.userID?._id === currentUserId && (
                  <div
                    className="action-pill modern-pill"
                    onClick={(e) => handleDelete(post._id, e)}
                    style={{ color: "red" }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    <span>Delete</span>
                  </div>
                )}
              </div>

              {/* Award Dropdown */}
              {openAwardMenu === post._id && (
                <div className="award-dropdown">
                  {(communityAwards[post.communityID?._id] || []).length === 0 && (
                    <div className="award-item no-awards">No awards available</div>
                  )}

                  {(communityAwards[post.communityID?._id] || []).map((award) => (
                    <div
                      key={award._id}
                      className="award-item"
                      onClick={(e) => giveAward(post._id, award._id, e)}
                    >
                      {award.icon ? award.icon + " " : "🎁 "}
                      {award.name} – {award.cost} Coins
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}

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
