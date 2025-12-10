import React, { useState, useEffect } from "react";
import api from "../../src/api/axios";
import { useParams } from "react-router-dom";
import "./PostDetails.css"; // The CSS for styling (replicating Reddit's style)
//Session
export default function PostDetails() {
  //const { postId } = useParams(); // Get the post ID from URL
  const {postId} = useParams();;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  

  // Fetch post details and comments
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postResponse = await api.get(`http://localhost:3000/api/posts/${postId}`);
        const commentsResponse = await api.get(`http://localhost:3000/api/comments/post/${postId}`);

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
    const response = await api.put(`http://localhost:3000/api/${route}/${id}/${action}`)
        
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
        postID: postId,
        parentID: null
      };
      const response = await api.post(`http://localhost:3000/api/comments/create`, commentData);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      alert('error: ', error.message);
      console.error("Error submitting comment:", error);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      // Assuming user is logged in and token is handled by axios interceptors or withCredentials
      const response = await api.get(`http://localhost:3000/api/posts/${post._id}/summarize`);
      setSummary(response.data.summary);
    } catch (error) {
      alert("Could not summarize: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSummarizing(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  
  return (
    <div className="post-details">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="user-info">
         <img src={post.userID.image} alt="user" className="user-avatar" />
          <span>{post.userID.username}</span>
        </div>
        {/* AI SUMMARIZE BUTTON SECTION */}
        <div style={{ margin: "10px 0" }}>
            {!summary && (
                <button 
                    onClick={handleSummarize} 
                    disabled={isSummarizing}
                    style={{ 
                        backgroundColor: "#6200EA", 
                        color: "white", 
                        padding: "8px 12px", 
                        border: "none", 
                        borderRadius: "20px",
                        cursor: "pointer"
                    }}
                >
                    {isSummarizing ? "✨ Summarizing..." : "✨ Summarize with AI"}
                </button>
            )}
            
            {/* DISPLAY SUMMARY */}
            {summary && (
                <div style={{ 
                    backgroundColor: "#f0f0f0", 
                    padding: "15px", 
                    borderRadius: "8px", 
                    marginTop: "10px",
                    borderLeft: "4px solid #6200EA"
                }}>
                    <h4 style={{ margin: "0 0 10px 0" }}>✨ AI Summary</h4>
                    <div style={{ whiteSpace: "pre-line" }}>{summary}</div>
                </div>
            )}
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
