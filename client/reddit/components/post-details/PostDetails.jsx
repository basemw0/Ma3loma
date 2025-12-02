import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PostDetails.css"; // The CSS for styling (replicating Reddit's style)

export default function PostDetails() {
  const { pid } = useParams(); // Get the post ID from URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch post details and comments
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:5000/api/posts/${pid}`);
        const commentsResponse = await axios.get(`http://localhost:5000/api/posts/${pid}/comments`);

        setPost(postResponse.data);
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post details or comments:", error);
      }
    };

    fetchPostDetails();
  }, [pid]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const commentData = {
        content: newComment,
        postID: pid,
      };
      const response = await axios.post(`http://localhost:5000/api/posts/${pid}/comment`, commentData);
      setComments([response.data, ...comments]);
      setNewComment(""); // Clear the input after submission
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="post-details">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="user-info">
          <img src={post.user.image} alt="user" className="user-avatar" />
          <span>{post.user.username}</span>
        </div>
        <div className="post-actions">
          <span>{post.upvotes.length} Upvotes</span>
          <span>{post.downvotes.length} Downvotes</span>
        </div>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Comments Section */}
      <div className="comments">
        <h2>Comments</h2>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <span className="comment-author">{comment.userID.username}:</span>
            <p>{comment.content}</p>
            <div className="comment-actions">
              <button>Upvote</button>
              <button>Downvote</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add a new comment */}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="4"
        ></textarea>
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
}
