import React, { useState, useEffect } from "react";
import axios from "axios"; // Importing Axios

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "../../button/Button";
import Video from "../../video/Video"; // If you're displaying video

import "./Posts.css";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/posts/home")
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching posts.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="posts-wrapper">
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        posts.map((post, index) => (
          <div className="post" key={post._id}>
            
            {/* LEFT VOTES */}
            <div className="post-sidebar">
              <ArrowUpwardIcon className="upvote" />
              {/* Fixed: use post.votes */}
              <span>{post.votes}</span>
              <ArrowDownwardIcon className="downvote" />
            </div>

            <div className="post-title">

              {/* Fixed: use post.communityID.image (not image_src) */}
              <img 
                src={post.communityID.image || "default_image.jpg"} 
                alt={`Community ${post.communityID.name}`} 
              />

              <span className="subreddit-name">r/{post.communityID.name}</span>
              <span className="post-user">Posted by</span>
              <span className="post-user underline">u/{post.userID.username}</span>
              <span className="timestamp">• {post.createdAt}</span>

              <div className="spacer"></div>
              <Button label="+ JOIN" />
            </div>

            {/* BODY */}
            <div className="post-body">
              <span className="title">{post.title}</span>

              {/* Optional: handle media types if backend implements them */}
             {
                post.mediaType === "image" && post.mediaUrl && (
                  <img src={post.mediaUrl} alt={post.title} />
                )
              }

              {
                post.mediaType === "video" && post.mediaUrl && (
                  <Video src={post.mediaUrl} />
                )
              }

              {post.content && (
                <span className="description">{post.content}</span>
              )}
            </div>

            {/* FOOTER */}
            <div className="post-footer">
              <div className="comments footer-action">
                <ModeCommentIcon className="comment-icon" />
                <span>{post.comments?.length || 0} Comments</span>
              </div>

              <div className="share footer-action">
                <ShareIcon />
                <span>Share</span>
              </div>

              <div className="save footer-action">
                <BookmarkIcon />
                <span>Save</span>
              </div>

              <MoreHorizIcon className="more-icon footer-action" />
            </div>

          </div>
        ))
      )}
    </div>
  );
}
