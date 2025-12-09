import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PostDetails.css"; // The CSS for styling (replicating Reddit's style)
//Session
export default function PostDetails() {
  //const { pid } = useParams(); // Get the post ID from URL
  const pid = '29fc53b4-8d22-4c3c-b27d-2a33702fb34c';
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  

  // Fetch post details and comments
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:3000/api/posts/${pid}`);
        const commentsResponse = await axios.get(`http://localhost:3000/api/comments/post/${pid}`);

        setPost(postResponse.data);
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post details or comments:", error);
      }
    };

    fetchPostDetails();
  }, []);

  const handlevote = async(type , id , object)=>{
    const route = object === "post"?"posts":"comments"
    const action = type === 1?"upvote" : "downvote"
    try{
    const response = await axios.put(`http://localhost:3000/api/${route}/${id}/${action}`)
        
    if(object === "post"){
      if(response.data) setPost(response.data)
    }
    else{
         if(response.data) setComments(prev =>
            prev.map(c => (c._id === response.data._id ? response.data : c))
    );
    }
    }
    catch(e){
      alert("Error"+ e.message)
    }
  }
  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const commentData = {
        content: newComment,
        postID: pid,
        parentID: null
      };
      const response = await axios.post(`http://localhost:3000/api/comments/create`, commentData);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      alert('error: ', error.message);
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
         <img src={post.userID.image} alt="user" className="user-avatar" />
          <span>{post.userID.username}</span>
        </div>
        <div className="post-actions">
          <span style={{marginLeft : 3}}>{post.upvotes.length } Upvotes</span>
          <span style={{marginLeft : 3}}>{post.downvotes.length } Downvotes</span>
        </div>
         <div className="comment-actions">
              <button onClick={()=>handlevote(1 , post._id ,"post")}>Upvote</button>
              <button onClick={()=>handlevote(2 , post._id , "post")}>Downvote</button>
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
             <p style={{marginLeft : 3}}>{comment.upvotes.length} Upvotes</p>
            <p style={{marginLeft : 3}}>{comment.downvotes.length} Downvotes</p> {/*Show which one u are upvoted or downvotes using session*/}
            <div className="comment-actions">
              <button onClick={()=>handlevote(1 , comment._id , "comment")}>Upvote</button>
              <button onClick={()=>handlevote(2 , comment._id , "comment")}>Downvote</button>
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
