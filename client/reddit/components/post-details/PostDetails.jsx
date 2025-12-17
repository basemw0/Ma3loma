// import React, { useState, useEffect } from "react";
// import api from "../../src/api/axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "./PostDetails.css";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import { Button } from "@mui/material";

// // NOTE: Placeholder for Video component
// function Video({ src }) {
//     return <video controls src={src} style={{ maxWidth: '100%', height: 'auto' }} />;
// }

// export default function PostDetails() {
//   const { postId } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [summary, setSummary] = useState(false);
//   const [isSummarizing, setIsSummarizing] = useState(false);
//   const [openReplyComments, setOpenReplyComments] = useState(new Set());
//   const [openAwardMenu, setOpenAwardMenu] = useState(false);
//   const [communityAwards, setCommunityAwards] = useState([]);

//   const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

//   const getUserIdFromToken = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return null;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.id;
//     } catch (e) {
//       return null;
//     }
//   };
//   const currentUserId = getUserIdFromToken();

//   useEffect(() => {
//     const fetchPostDetails = async () => {
//       try {
//         const postResponse = await api.get(`${serverUrl}/api/posts/${postId}`);
//         const commentsResponse = await api.get(
//           `${serverUrl}/api/comments/post/${postId}`
//         );
//         const topLevelComments = commentsResponse.data.filter((c) => !c.parentID);
//         setPost(postResponse.data);
//         setComments(topLevelComments);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching post details or comments:", error);
//       }
//     };
//     fetchPostDetails();
//   }, []);

//   const handlevote = async (type, id, object) => {
//     if (!id) {
//         console.error(`Attempted vote on ${object} with undefined ID. Type: ${type}`);
//         alert("Error: Cannot vote on this item (ID missing).");
//         return;
//     }
//     const route = object === "post" ? "posts" : "comments";
//     const action = type === 1 ? "upvote" : "downvote";
//     try {
//       const response = await api.put(`${serverUrl}/api/${route}/${id}/${action}`);
//       if (object === "post") {
//         if (response.data) setPost(response.data);
//       } else {
//         if (response.data) setComments((prev) => updateCommentInState(prev, response.data));
//       }
//     } catch (e) {
//       alert("Error: " + e.message);
//     }
//   };

//   const updateCommentInState = (commentsArray, updatedComment) => {
//     return commentsArray.map((c) => {
//       if (c._id === updatedComment._id) {
//         return {
//           ...c,
//           upvotes: updatedComment.upvotes,
//           downvotes: updatedComment.downvotes,
//           content: updatedComment.content ?? c.content,
//           userID: updatedComment.userID && updatedComment.userID.username
//             ? updatedComment.userID
//             : c.userID,
//         };
//       }
//       if (c.replies && c.replies.length > 0) {
//         const updatedReplies = updateCommentInState(c.replies, updatedComment);
//         if (updatedReplies !== c.replies) {
//           return { ...c, replies: updatedReplies };
//         }
//       }
//       return c;
//     });
//   };

//   const handleEditComment = async (commentId, newContent) => {
//     if (!newContent.trim()) return;
//     try {
//       const response = await api.put(`${serverUrl}/api/comments/edit/${commentId}`, {
//         content: newContent
//       });
//       setComments((prev) => updateCommentInState(prev, response.data));
//       return true;
//     } catch (error) {
//       alert("Failed to edit comment: " + (error.response?.data?.message || error.message));
//       return false;
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const commentData = { content: newComment, postID: postId, parentID: null };
//       const response = await api.post(`${serverUrl}/api/comments/create`, commentData);
//       setComments([response.data, ...comments]);
//       setNewComment("");
//     } catch (error) {
//       alert("error: " + error.message);
//     }
//   };

//   const addReplyToState = (commentsArray, parentID, newReply) => {
//     const normalizedReply = {
//       ...newReply,
//       _id: newReply._id ? String(newReply._id) : `temp-${Date.now()}-${Math.random()}`,
//       replies: newReply.replies || [],
//     };
//     return commentsArray.map((c) => {
//       if (c._id === parentID) {
//         const currentReplies = Array.isArray(c.replies) ? c.replies : [];
//         return { ...c, replies: [...currentReplies, normalizedReply] };
//       }
//       if (c.replies && c.replies.length > 0) {
//         const updatedReplies = addReplyToState(c.replies, parentID, normalizedReply);
//         if (updatedReplies !== c.replies) {
//           return { ...c, replies: updatedReplies };
//         }
//       }
//       return c;
//     });
//   };

//   const handleReplySubmit = async (parentID, replyContent) => {
//     if (!replyContent.trim()) return;
//     try {
//       const response = await api.post(`${serverUrl}/api/comments/create`, {
//         content: replyContent,
//         postID: postId,
//         parentID,
//       });
//       setComments((prev) => addReplyToState(prev, parentID, response.data));
//       // Add parent and new reply to openReplyComments
//       setOpenReplyComments(prev => {
//         const newSet = new Set(prev);
//         newSet.add(parentID);
//         if (response.data._id) newSet.add(response.data._id);
//         return newSet;
//       });
//     } catch (error) {
//       alert("Error: " + error.message);
//     }
//   };

//   const deleteCommentFromState = (commentsArray, idToDelete) => {
//     const filteredComments = commentsArray.filter((c) => c._id !== idToDelete);
//     if (filteredComments.length === commentsArray.length) {
//       return commentsArray.map((c) => {
//         if (c.replies && c.replies.length > 0) {
//           const updatedReplies = deleteCommentFromState(c.replies, idToDelete);
//           if (updatedReplies.length !== c.replies.length) {
//             return { ...c, replies: updatedReplies };
//           }
//         }
//         return c;
//       });
//     }
//     return filteredComments;
//   };

//   const handleDeleteComment = async (coid) => {
//     if (!currentUserId) return;
//     try {
//       await api.delete(`${serverUrl}/api/comments/${coid}`);
//       setOpenReplyComments(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(coid);
//         return newSet;
//       });
//       setComments((prev) => deleteCommentFromState(prev, coid));
//     } catch (error) {
//       alert("Failed to delete comment: " + error.message);
//     }
//   };

//   const giveCommentAward = async (commentId, awardId) => {
//     try {
//       await api.post(`${serverUrl}/api/comments/${commentId}/award/${awardId}`);
//       alert("Award given to comment!");
//     } catch (error) {
//       alert("Failed to give award: " + error.message);
//     }
//   };

//   const handleSummarize = async () => {
//     setIsSummarizing(true);
//     try {
//       const response = await api.get(`${serverUrl}/api/posts/${post._id}/summarize`);
//       setSummary(response.data.summary);
//     } catch (error) {
//       alert("Could not summarize: " + (error.response?.data?.message || error.message));
//     } finally {
//       setIsSummarizing(false);
//     }
//   };

//   const toggleAwardMenu = async () => {
//     if (!openAwardMenu) {
//       try {
//         const res = await api.get(`${serverUrl}/api/communities/${post.communityID._id}`);
//         setCommunityAwards(res.data.awards || []);
//       } catch {
//         console.log("Failed to load awards");
//       }
//     }
//     setOpenAwardMenu(!openAwardMenu);
//   };

//   const giveAward = async (awardId, e) => {
//     e.stopPropagation();
//     try {
//       await api.post(`${serverUrl}/api/posts/${post._id}/award/${awardId}`);
//       alert("Award given!");
//       setOpenAwardMenu(false);
//     } catch (error) {
//       alert("Failed to give award: " + error.message);
//     }
//   };

//   const handleDelete = async () => {
//     if (!currentUserId || post.userID._id !== currentUserId) {
//       alert("You can only delete your own posts.");
//       return;
//     }
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await api.delete(`${serverUrl}/api/posts/delete/${post._id}`);
//       alert("Post deleted successfully.");
//       navigate("/");
//     } catch (error) {
//       alert("Failed to delete post: " + error.message);
//     }
//   };

//   const handleEdit = () => {
//     if (!currentUserId || post.userID._id !== currentUserId) {
//       alert("You can only edit your own posts.");
//       return;
//     }
//     navigate(`/api/posts/${post._id}/edit`);
//   };

//   const toggleReplies = (commentId) => {
//     setOpenReplyComments(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId);
//       } else {
//         newSet.add(commentId);
//       }
//       return newSet;
//     });
//   };

//   const CommentItem = ({ comment, level = 0, handleEditComment }) => {
//     const [replyContent, setReplyContent] = useState("");
//     const [openCommentAwardMenu, setOpenCommentAwardMenu] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedContent, setEditedContent] = useState(comment?.content || ""); 

//     if (!comment || !comment._id) return null;

//     const handleReply = () => {
//       handleReplySubmit(comment._id, replyContent);
//       setReplyContent("");
//     };

//     const handleSaveEdit = async () => {
//       if (editedContent.trim() === comment.content) {
//         setIsEditing(false);
//         return;
//       }
//       const success = await handleEditComment(comment._id, editedContent);
//       if (success) setIsEditing(false);
//     };

//     const hasReplies = comment.replies && comment.replies.length > 0;

//     return (
//       <div className="comment" style={{ marginLeft: level * 20 }}> 
//         <span className="comment-author">{comment.userID?.username || "Unknown User"}:</span>
//         {isEditing ? (
//           <div className="comment-edit-form">
//             <textarea
//               value={editedContent}
//               onChange={(e) => setEditedContent(e.target.value)}
//               rows="3"
//               style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//             />
//             <Button onClick={handleSaveEdit} variant="contained" size="small" sx={{ marginRight: '8px' }}>Save</Button>
//             <Button onClick={() => { setIsEditing(false); setEditedContent(comment.content); }} variant="outlined" size="small">Cancel</Button>
//           </div>
//         ) : (
//           <p>{comment.content}</p>
//         )}
//         <p>{comment.upvotes?.length || 0} Upvotes</p>
//         <p>{comment.downvotes?.length || 0} Downvotes</p>

//         <div className="comment-actions">
//           <button onClick={() => handlevote(1, comment._id, "comment")}>Upvote</button> 
//           <button onClick={() => handlevote(2, comment._id, "comment")}>Downvote</button>

//           {currentUserId && comment.userID?._id === currentUserId && (
//             <button onClick={() => setIsEditing(true)}>
//               <EditOutlinedIcon fontSize="small" style={{ verticalAlign: 'middle' }} /> Edit
//             </button>
//           )}

//           {currentUserId && comment.userID?._id === currentUserId && (
//             <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
//           )}

//           <div className="award-container">
//             <button onClick={() => setOpenCommentAwardMenu(!openCommentAwardMenu)}>🎁 Award</button>
//             {openCommentAwardMenu && (
//               <div className="award-dropdown">
//                 {communityAwards.length === 0 && <div>No awards</div>}
//                 {communityAwards.map((award) => (
//                   <div key={award._id} className="award-item" onClick={() => giveCommentAward(comment._id, award._id)}>
//                     {award.icon ? award.icon + " " : "🎖 "} {award.name} – {award.cost} Coins
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {!isEditing && (
//           <div className="comment-reply">
//             <input type="text" placeholder="Reply..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
//             <button onClick={handleReply}>Reply</button>
//           </div>
//         )}

//         {hasReplies && (
//           <div style={{ marginLeft: "20px" }}>
//             <button
//               onClick={() => toggleReplies(comment._id)}
//               style={{ background: 'none', border: 'none', color: '#0079d3', cursor: 'pointer', padding: '5px 0', fontWeight: 'bold' }}
//             >
//               {openReplyComments.has(comment._id) ? "Hide Replies" : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
//             </button>

//             {openReplyComments.has(comment._id) && comment.replies.map((childComment, index) => (
//               <CommentItem
//                 key={childComment._id || `temp-${Date.now()}-${Math.random()}-${index}`}
//                 comment={childComment}
//                 level={level + 1}
//                 handleEditComment={handleEditComment}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   if (loading) return <div>Loading...</div>;

//   const moderator = post?.communityID?.moderators?.find(mod => mod.user === currentUserId);

//   return (
//     <div className="post-details">
//       <div className="post-header">
//         <h1>{post.title}</h1>
//         <div className="user-info">
//           <img src={post.userID.image} alt="user" className="user-avatar" />
//           <span>{post.userID.username}</span>
//         </div>

//         {post.userID._id === currentUserId && (
//           <div style={{ marginTop: "10px", display: "inline-block", marginRight: "10px" }}>
//             <button onClick={handleEdit} style={{ backgroundColor: "#0079d3", color: "white", padding: "8px 12px", border: "none", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
//               <EditOutlinedIcon fontSize="small" /> Edit Post
//             </button>
//           </div>
//         )}

//         {post.userID._id === currentUserId && (
//           <div style={{ marginTop: "10px", display: "inline-block" }}>
//             <button onClick={handleDelete} style={{ backgroundColor: "#ff4d4f", color: "white", padding: "8px 12px", border: "none", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
//               <DeleteOutlineIcon fontSize="small" /> Delete Post
//             </button>
//           </div>
//         )}

//         <div style={{ margin: "10px 0" }}>
//           {!summary && (
//             <button onClick={handleSummarize} disabled={isSummarizing} style={{ backgroundColor: "#6200EA", color: "white", padding: "8px 12px", border: "none", borderRadius: "20px", cursor: "pointer" }}>
//               {isSummarizing ? "✨ Summarizing..." : "✨ Summarize with AI"}
//             </button>
//           )}
//           {summary && (
//             <div style={{ backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px", marginTop: "10px", borderLeft: "4px solid #6200EA" }}>
//               <h4 style={{ margin: "0 0 10px 0" }}>✨ AI Summary</h4>
//               <div style={{ whiteSpace: "pre-line" }}>{summary}</div>
//             </div>
//           )}
//         </div>

//         <div className="post-actions">
//           <span>{post.upvotes.length} Upvotes</span>
//           <span>{post.downvotes.length} Downvotes</span>
//         </div>

//         <div className="comment-actions">
//           <button onClick={() => handlevote(1, post._id, "post")}>Upvote</button>
//           <button onClick={() => handlevote(2, post._id, "post")}>Downvote</button>

//           <div className="award-container">
//             <button className="award-button" onClick={toggleAwardMenu}>🎁 Award</button>
//             {openAwardMenu && (
//               <div className="award-dropdown">
//                 {communityAwards.length === 0 && <div className="award-item no-awards">No awards available</div>}
//                 {communityAwards.map((award) => (
//                   <div key={award._id} className="award-item" onClick={(e) => giveAward(award._id, e)}>
//                     {award.icon ? award.icon + " " : "🎖 "} {award.name} – {award.cost} Coins
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="post-content">
//         {post.video && <Video src={post.video} />}
//         <p>{post.text}</p>
//       </div>

//       <div className="comments-section">
//         <form onSubmit={handleCommentSubmit} className="comment-form">
//           <input
//             type="text"
//             placeholder="Add a comment..."
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />
//           <button type="submit">Comment</button>
//         </form>

//         {comments.length === 0 && <p>No comments yet</p>}
//         {comments.map((comment, index) => (
//           <CommentItem
//             key={comment._id || `temp-${Date.now()}-${Math.random()}-${index}`}
//             comment={comment}
//             level={0}
//             handleEditComment={handleEditComment}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


/*
import React, { useState, useEffect } from "react";
import api from "../../src/api/axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetails.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button } from "@mui/material";

// Video component placeholder
function Video({ src }) {
  return <video controls src={src} style={{ maxWidth: '100%', height: 'auto' }} />;
}

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [openReplyComments, setOpenReplyComments] = useState(new Set());
  const [openAwardMenu, setOpenAwardMenu] = useState(false);
  const [communityAwards, setCommunityAwards] = useState([]);
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

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
  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postResponse = await api.get(`${serverUrl}/api/posts/${postId}`);
        const commentsResponse = await api.get(`${serverUrl}/api/comments/post/${postId}`);

        // Populate replies recursively so nested replies have full user info
        const populateReplies = (commentsList, allComments) => {
          return commentsList.map(c => {
            const replies = allComments.filter(r => r.parentID === c._id);
            return {
              ...c,
              replies: populateReplies(replies, allComments)
            };
          });
        };

        const topLevelComments = populateReplies(
          commentsResponse.data.filter(c => !c.parentID),
          commentsResponse.data
        );

        setPost(postResponse.data);
        setComments(topLevelComments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post details or comments:", error);
      }
    };
    fetchPostDetails();
  }, []);

  const handlevote = async (type, id, object) => {
    const route = object === "post" ? "posts" : "comments";
    const action = type === 1 ? "upvote" : "downvote";
    try {
      const response = await api.put(`${serverUrl}/api/${route}/${id}/${action}`);
      if (object === "post") {
        if (response.data) setPost(response.data);
      } else {
        if (response.data) setComments((prev) => updateCommentInState(prev, response.data));
      }
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

const updateCommentInState = (commentsArray, updatedComment) => {
  return commentsArray.map((c) => {
    if (c._id === updatedComment._id) {
      return {
        ...c,
        content: updatedComment.content || c.content,
        upvotes: updatedComment.upvotes,
        downvotes: updatedComment.downvotes,
        // Do NOT touch userID
      };
    }
    if (c.replies && c.replies.length > 0) {
      return { ...c, replies: updateCommentInState(c.replies, updatedComment) };
    }
    return c;
  });
};

  const handleEditComment = async (commentId, newContent) => {
      if (!newContent.trim()) return;
      try {
          const response = await api.put(`${serverUrl}/api/comments/edit/${commentId}`, {
              content: newContent
          });
          setComments((prev) => updateCommentInState(prev, response.data));
          return true;
      } catch (error) {
          alert("Failed to edit comment: " + (error.response?.data?.message || error.message));
          return false;
      }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const commentData = { content: newComment, postID: postId, parentID: null };
      const response = await api.post(`${serverUrl}/api/comments/create`, commentData);
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      alert("error: " + error.message);
    }
  };

  const addReplyToState = (commentsArray, parentID, newReply) => {
    return commentsArray.map((c) => {
      if (c._id === parentID) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: addReplyToState(c.replies, parentID, newReply) };
      }
      return c;
    });
  };

  const handleReplySubmit = async (parentID, replyContent) => {
    if (!replyContent.trim()) return;
    try {
      const response = await api.post(`${serverUrl}/api/comments/create`, {
        content: replyContent,
        postID: postId,
        parentID,
      });
      setComments((prev) => addReplyToState(prev, parentID, response.data));
      setOpenReplyComments(prev => new Set(prev).add(parentID));
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const deleteCommentFromState = (commentsArray, idToDelete) => {
    return commentsArray
      .filter((c) => c._id !== idToDelete)
      .map((c) => ({
        ...c,
        replies: c.replies ? deleteCommentFromState(c.replies, idToDelete) : [],
      }));
  };

  const handleDeleteComment = async (coid) => {
    if (!currentUserId) return;
    try {
      await api.delete(`${serverUrl}/api/comments/${coid}`);
      setComments((prev) => deleteCommentFromState(prev, coid));
      setOpenReplyComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(coid);
        return newSet;
      });
    } catch (error) {
      alert("Failed to delete comment: " + error.message);
    }
  };

  const giveCommentAward = async (commentId, awardId) => {
    try {
      await api.post(`${serverUrl}/api/comments/${commentId}/award/${awardId}`);
      alert("Award given to comment!");
    } catch (error) {
      alert("Failed to give award: " + error.message);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await api.get(`${serverUrl}/api/posts/${post._id}/summarize`);
      setSummary(response.data.summary);
    } catch (error) {
      alert("Could not summarize: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSummarizing(false);
    }
  };

  const toggleAwardMenu = async () => {
    if (!openAwardMenu) {
      try {
        const res = await api.get(`${serverUrl}/api/communities/${post.communityID._id}`);
        setCommunityAwards(res.data.awards || []);
      } catch {
        console.log("Failed to load awards");
      }
    }
    setOpenAwardMenu(!openAwardMenu);
  };

  const giveAward = async (awardId, e) => {
    e.stopPropagation();
    try {
      await api.post(`${serverUrl}/api/posts/${post._id}/award/${awardId}`);
      alert("Award given!");
      setOpenAwardMenu(false);
    } catch (error) {
      alert("Failed to give award: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!currentUserId || post.userID._id !== currentUserId) {
      alert("You can only delete your own posts.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`${serverUrl}/api/posts/delete/${post._id}`);
      alert("Post deleted successfully.");
      navigate("/");
    } catch (error) {
      alert("Failed to delete post: " + error.message);
    }
  };

  const handleEdit = () => {
    if (!currentUserId || post.userID._id !== currentUserId) {
      alert("You can only edit your own posts.");
      return;
    }
    navigate(`/api/posts/${post._id}/edit`);
  };

  const toggleReplies = (commentId) => {
    setOpenReplyComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) newSet.delete(commentId);
      else newSet.add(commentId);
      return newSet;
    });
  };

  const CommentItem = ({ comment, level = 0 }) => {
    const [replyContent, setReplyContent] = useState("");
    const [openCommentAwardMenu, setOpenCommentAwardMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    const handleReply = () => {
      handleReplySubmit(comment._id, replyContent);
      setReplyContent("");
    };

    const handleSaveEdit = async () => {
      if (editedContent.trim() === comment.content) {
        setIsEditing(false);
        return;
      }
      const success = await handleEditComment(comment._id, editedContent);
      if (success) setIsEditing(false);
    };

    const hasReplies = comment.replies && comment.replies.length > 0;
    const isRepliesOpen = openReplyComments.has(comment._id);

    return (
      <div className="comment" style={{ marginLeft: level * 20 }} key={comment._id}>
        <span className="comment-author">{comment.userID?.username || "Unknown User"}:</span>
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows="3" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            <Button onClick={handleSaveEdit} variant="contained" size="small" sx={{ marginRight: '8px' }}>Save</Button>
            <Button onClick={() => { setIsEditing(false); setEditedContent(comment.content); }} variant="outlined" size="small">Cancel</Button>
          </div>
        ) : <p>{comment.content}</p>}

        <p>{comment.upvotes?.length || 0} Upvotes</p>
        <p>{comment.downvotes?.length || 0} Downvotes</p>

        <div className="comment-actions">
          <button onClick={() => handlevote(1, comment._id, "comment")}>Upvote</button>
          <button onClick={() => handlevote(2, comment._id, "comment")}>Downvote</button>
          {currentUserId && comment.userID?._id === currentUserId && <button onClick={() => setIsEditing(true)}><EditOutlinedIcon fontSize="small" /> Edit</button>}
          {currentUserId && comment.userID?._id === currentUserId && <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>}

          <div className="award-container">
            <button onClick={() => setOpenCommentAwardMenu(!openCommentAwardMenu)}>🎁 Award</button>
            {openCommentAwardMenu && (
              <div className="award-dropdown">
                {communityAwards.length === 0 && <div>No awards</div>}
                {communityAwards.map((award) => (
                  <div key={award._id} className="award-item" onClick={() => giveCommentAward(comment._id, award._id)}>
                    {award.icon ? award.icon + " " : "🎖 "} {award.name} – {award.cost} Coins
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="comment-reply">
            <input type="text" placeholder="Reply..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
            <button onClick={handleReply}>Reply</button>
          </div>
        )}

        {hasReplies && (
          <button
            style={{ marginLeft: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#0079d3' }}
            onClick={() => toggleReplies(comment._id)}
          >
            {isRepliesOpen ? "Hide Replies" : `View ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
          </button>
        )}

        {isRepliesOpen && hasReplies && comment.replies.map((reply) => (
          <CommentItem key={reply._id} comment={reply} level={level + 1} />
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;

  const moderator = post?.communityID?.moderators?.find(mod => mod.user === currentUserId);

  return (
    <div className="post-details">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="user-info">
          <img src={post.userID.image} alt="user" className="user-avatar" />
          <span>{post.userID.username}</span>
        </div>

        {post.userID._id === currentUserId && (
          <div style={{ marginTop: "10px", display: "inline-block", marginRight: "10px" }}>
            <button onClick={handleEdit} style={{
              backgroundColor: "#0079d3", color: "white", padding: "8px 12px",
              border: "none", borderRadius: "20px", cursor: "pointer", display: "flex",
              alignItems: "center", gap: "6px",
            }}>
              <EditOutlinedIcon fontSize="small" /> Edit Post
            </button>
          </div>
        )}

        {post.userID._id === currentUserId && (
          <div style={{ marginTop: "10px", display: "inline-block" }}>
            <button onClick={handleDelete} style={{
              backgroundColor: "#ff4d4f", color: "white", padding: "8px 12px",
              border: "none", borderRadius: "20px", cursor: "pointer", display: "flex",
              alignItems: "center", gap: "6px",
            }}>
              <DeleteOutlineIcon fontSize="small" /> Delete Post
            </button>
          </div>
        )}

        <div style={{ margin: "10px 0" }}>
          {!summary && (
            <button onClick={handleSummarize} disabled={isSummarizing} style={{
              backgroundColor: "#6200EA", color: "white", padding: "8px 12px",
              border: "none", borderRadius: "20px", cursor: "pointer",
            }}>
              {isSummarizing ? "✨ Summarizing..." : "✨ Summarize with AI"}
            </button>
          )}

          {summary && (
            <div style={{ backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px", marginTop: "10px", borderLeft: "4px solid #6200EA" }}>
              <h4 style={{ margin: "0 0 10px 0" }}>✨ AI Summary</h4>
              <div style={{ whiteSpace: "pre-line" }}>{summary}</div>
            </div>
          )}
        </div>

        <div className="post-actions">
          <span>{post.upvotes.length} Upvotes</span>
          <span>{post.downvotes.length} Downvotes</span>
        </div>

        <div className="comment-actions">
          <button onClick={() => handlevote(1, post._id, "post")}>Upvote</button>
          <button onClick={() => handlevote(2, post._id, "post")}>Downvote</button>

          <div className="award-container">
            <button className="award-button" onClick={toggleAwardMenu}>🎁 Award</button>
            {openAwardMenu && (
              <div className="award-dropdown">
                {communityAwards.length === 0 && <div className="award-item no-awards">No awards available</div>}
                {communityAwards.map((award) => (
                  <div key={award._id} className="award-item" onClick={(e) => giveAward(award._id, e)}>
                    {award.icon ? award.icon + " " : "🎖 "} {award.name} – {award.cost} Coins
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {moderator && <Button sx={{marginTop: 1}} variant="outlined" color="error">Delete</Button>}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        <div className="media-wrapper modern-media">
          {post.mediaType === "image" && post.mediaUrl && <img src={post.mediaUrl} className="post-image" alt="Post content" />}
          {post.mediaType === "video" && post.mediaUrl && <Video src={post.mediaUrl} />}
        </div>
      </div>

      <div className="comments">
        <h2>Comments</h2>
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}
      </div>

      <form onSubmit={handleCommentSubmit}>
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." rows="4"></textarea>
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
}
*/



import React, { useState, useEffect } from "react";
import api from "../../src/api/axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDetails.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Button } from "@mui/material";

// ✅ TEST LIMIT: Change this to 2 or 3 to test pagination easily
const COMMENTS_LIMIT = 3; 

// Placeholder Video Component
function Video({ src }) {
  return <video controls src={src} style={{ maxWidth: '100%', height: 'auto' }} />;
}

export default function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
  
  // --- STATE ---
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // Root comments
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Pagination State (Root Comments)
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // UI State
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [openReplyComments, setOpenReplyComments] = useState(new Set()); 
  
  // ✅ NEW: Centralized Award Menu State
  // Holds the ID of the object (Post ID or Comment ID) currently showing the menu
  const [activeAwardMenuId, setActiveAwardMenuId] = useState(null);
  const [communityAwards, setCommunityAwards] = useState([]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (e) { return null; }
  };
  const currentUserId = getUserIdFromToken();

  // --- 1. INITIAL FETCH (Post + Root Comments) ---
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // A. Get Post
        const postResponse = await api.get(`${serverUrl}/api/posts/${postId}`);
        setPost(postResponse.data);

        // B. Get Root Comments (Page 1)
        const commentsResponse = await api.get(`${serverUrl}/api/comments/post/${postId}?page=1&limit=${COMMENTS_LIMIT}`);
        
        setComments(commentsResponse.data);
        
        if (commentsResponse.data.length < COMMENTS_LIMIT) {
            setHasMoreComments(false);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId, serverUrl]);

  // --- 2. NEW: FETCH AWARDS AUTOMATICALLY ---
  // Runs as soon as 'post' is loaded to get the community awards
  useEffect(() => {
    if (post && post.communityID) {
        const fetchAwards = async () => {
            try {
                // Handle populated object vs string ID
                const commId = post.communityID._id || post.communityID;
                const res = await api.get(`${serverUrl}/api/communities/${commId}`);
                // Safely handle casing differences (Awards vs awards)
                setCommunityAwards(res.data.Awards || res.data.awards || []);
            } catch (e) {
                console.error("Failed to load awards", e);
            }
        };
        fetchAwards();
    }
  }, [post, serverUrl]);

  // --- RECURSIVE HELPERS ---

  const updateCommentInState = (list, updatedComment) => {
    return list.map((c) => {
      if (c._id === updatedComment._id) {
        return { ...c, ...updatedComment, replies: c.replies };
      }
      if (c.replies && c.replies.length > 0 && typeof c.replies[0] !== 'string') {
        return { ...c, replies: updateCommentInState(c.replies, updatedComment) };
      }
      return c;
    });
  };

  const addReplyToState = (list, parentID, newReply) => {
    return list.map((c) => {
      if (c._id === parentID) {
        const currentReplies = (c.replies && typeof c.replies[0] !== 'string') ? c.replies : [];
        return { ...c, replies: [newReply, ...currentReplies] };
      }
      if (c.replies && c.replies.length > 0 && typeof c.replies[0] !== 'string') {
        return { ...c, replies: addReplyToState(c.replies, parentID, newReply) };
      }
      return c;
    });
  };

  const loadRepliesIntoState = (list, parentID, fetchedReplies) => {
    return list.map((c) => {
      if (c._id === parentID) {
        return { ...c, replies: fetchedReplies }; 
      }
      if (c.replies && c.replies.length > 0 && typeof c.replies[0] !== 'string') {
        return { ...c, replies: loadRepliesIntoState(c.replies, parentID, fetchedReplies) };
      }
      return c;
    });
  };

  const appendRepliesToState = (list, parentID, newReplies) => {
    return list.map((c) => {
        if (c._id === parentID) {
            return { ...c, replies: [...c.replies, ...newReplies] };
        }
        if (c.replies && c.replies.length > 0 && typeof c.replies[0] !== 'string') {
            return { ...c, replies: appendRepliesToState(c.replies, parentID, newReplies) };
        }
        return c;
    });
  };

  const deleteCommentFromState = (list, idToDelete) => {
    const filtered = list.filter((c) => c._id !== idToDelete);
    if (filtered.length === list.length) {
      return list.map((c) => {
        if (c.replies && c.replies.length > 0 && typeof c.replies[0] !== 'string') {
            return { ...c, replies: deleteCommentFromState(c.replies, idToDelete) };
        }
        return c;
      });
    }
    return filtered;
  };

  // --- HANDLERS ---

  const handleLoadMoreComments = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const res = await api.get(`${serverUrl}/api/comments/post/${postId}?page=${nextPage}&limit=${COMMENTS_LIMIT}`);
      if (res.data.length > 0) {
        setComments((prev) => [...prev, ...res.data]);
        setPage(nextPage);
      }
      if (res.data.length < COMMENTS_LIMIT) setHasMoreComments(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const toggleReplies = async (commentId, replies) => {
    const needsFetching = replies && replies.length > 0 && typeof replies[0] === 'string';

    if (needsFetching) {
        try {
            const res = await api.get(`${serverUrl}/api/comments/${commentId}/replies?page=1&limit=${COMMENTS_LIMIT}`);
            setComments(prev => loadRepliesIntoState(prev, commentId, res.data));
        } catch (error) {
            console.error("Failed to load replies:", error);
            return;
        }
    }

    setOpenReplyComments(prev => {
        const newSet = new Set(prev);
        if (newSet.has(commentId)) newSet.delete(commentId);
        else newSet.add(commentId);
        return newSet;
    });
  };

  const handleLoadMoreReplies = async (commentId, currentRepliesCount) => {
      const nextPage = Math.ceil(currentRepliesCount / COMMENTS_LIMIT) + 1;
      
      try {
          const res = await api.get(`${serverUrl}/api/comments/${commentId}/replies?page=${nextPage}&limit=${COMMENTS_LIMIT}`);
          if (res.data.length > 0) {
              setComments(prev => appendRepliesToState(prev, commentId, res.data));
          }
      } catch (error) {
          console.error("Failed to load more replies", error);
      }
  };

  const handlevote = async (type, id, object) => {
    const route = object === "post" ? "posts" : "comments";
    const action = type === 1 ? "upvote" : "downvote";
    try {
      // ✅ PUT is correct for voting (update status)
      const response = await api.put(`${serverUrl}/api/${route}/${id}/${action}`);
      if (object === "post") {
        if (response.data) setPost(response.data);
      } else {
        if (response.data) setComments((prev) => updateCommentInState(prev, response.data));
      }
    } catch (e) { alert("Error voting: " + e.message); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await api.post(`${serverUrl}/api/comments/create`, { content: newComment, postID: postId, parentID: null });
      setComments([response.data, ...comments]); 
      setNewComment("");
    } catch (error) { alert("Error: " + error.message); }
  };

  const handleReplySubmit = async (parentID, replyContent) => {
    if (!replyContent.trim()) return;
    try {
      const response = await api.post(`${serverUrl}/api/comments/create`, { content: replyContent, postID: postId, parentID });
      setComments((prev) => addReplyToState(prev, parentID, response.data));
      setOpenReplyComments((prev) => new Set(prev).add(parentID));
    } catch (error) { alert("Error replying: " + error.message); }
  };

  const handleDeleteComment = async (coid) => {
    if (!currentUserId || !window.confirm("Delete?")) return;
    try {
      await api.delete(`${serverUrl}/api/comments/${coid}`);
      setComments((prev) => deleteCommentFromState(prev, coid));
    } catch (error) { alert("Failed to delete: " + error.message); }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!newContent.trim()) return false;
    try {
      const response = await api.put(`${serverUrl}/api/comments/edit/${commentId}`, { content: newContent });
      setComments((prev) => updateCommentInState(prev, response.data));
      return true;
    } catch (error) { 
        alert("Failed to edit: " + error.message); 
        return false; 
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const response = await api.get(`${serverUrl}/api/posts/${post._id}/summarize`);
      setSummary(response.data.summary);
    } catch (error) { alert("Summarize failed"); } 
    finally { setIsSummarizing(false); }
  };

  // ✅ NEW: Shared Toggle Function
  const toggleAwardMenu = (id) => {
    // If we click the one already open, close it (null). Else, open the new one.
    setActiveAwardMenuId(prev => (prev === id ? null : id));
  };

  // ✅ CHANGED: api.put -> api.post
  const giveAward = async (awardName, e) => {
    e.stopPropagation();
    try {
      await api.post(`${serverUrl}/api/posts/${post._id}/award/${awardName}`);
      alert("Award given!");
      setActiveAwardMenuId(null); // Close menu
    } catch (error) { alert("Failed: " + error.message); }
  };

  // ✅ CHANGED: api.put -> api.post
  const giveCommentAward = async (commentId, awardName) => {
    try {
      await api.post(`${serverUrl}/api/comments/${commentId}/award/${awardName}`);
      alert("Award given!");
      setActiveAwardMenuId(null); // Close menu
    } catch (error) { alert("Failed: " + error.message); }
  };

  const handleDeletePost = async () => {
    if (!currentUserId || !window.confirm("Delete Post?")) return;
    try {
      await api.delete(`${serverUrl}/api/posts/delete/${post._id}`);
      navigate("/");
    } catch (error) { alert("Failed: " + error.message); }
  };

  // --- COMMENT ITEM COMPONENT ---
  const CommentItem = ({ comment, level = 0 }) => {
    const [replyContent, setReplyContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    // REMOVED local state for award menu

    const hasReplies = comment.replies && comment.replies.length > 0;
    const isRepliesOpen = openReplyComments.has(comment._id);
    const repliesLoaded = hasReplies && typeof comment.replies[0] !== 'string';
    const showLoadMoreReplies = repliesLoaded && (comment.replies.length % COMMENTS_LIMIT === 0);

    const onReply = () => { handleReplySubmit(comment._id, replyContent); setReplyContent(""); };
    const onSaveEdit = async () => { if(await handleEditComment(comment._id, editedContent)) setIsEditing(false); };

    return (
      <div className="comment" style={{ marginLeft: level * 20 }} key={comment._id}>
        <div className="comment-header">
            <span className="comment-author">{comment.userID?.username || "Unknown"}:</span>
        </div>

        {isEditing ? (
          <div className="comment-edit-form">
            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows="2" style={{width:'100%'}}/>
            <Button size="small" onClick={onSaveEdit}>Save</Button>
            <Button size="small" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        ) : <p>{comment.content}</p>}

        <div className="comment-stats">
            <small>{comment.upvotes?.length || 0} Up | {comment.downvotes?.length || 0} Down</small>
        </div>

        <div className="comment-actions">
          <button onClick={() => handlevote(1, comment._id, "comment")}>Upvote</button>
          <button onClick={() => handlevote(2, comment._id, "comment")}>Downvote</button>
          
          {currentUserId && comment.userID?._id === currentUserId && (
            <>
                <button onClick={() => setIsEditing(true)}><EditOutlinedIcon fontSize="small"/> Edit</button>
                <button onClick={() => handleDeleteComment(comment._id)}><DeleteOutlineIcon fontSize="small"/> Delete</button>
            </>
          )}

          {/* ✅ UPDATED: Centralized Award Menu Logic for Comments */}
          <div className="award-container" style={{display:'inline-block', position:'relative'}}>
             <button onClick={() => toggleAwardMenu(comment._id)}>🎁</button>
             
             {/* Only show if the active ID matches THIS comment */}
             {activeAwardMenuId === comment._id && (
               <div className="award-dropdown">
                 {(communityAwards.length === 0) ? <div>No awards</div> : 
                    communityAwards.map(a => (
                        <div key={a.name} className="award-item" onClick={() => giveCommentAward(comment._id, a.name)}>
                            {a.icon} {a.name}
                        </div>
                    ))
                 }
               </div>
             )}
          </div>
        </div>

        {!isEditing && (
            <div className="comment-reply">
                <input placeholder="Reply..." value={replyContent} onChange={e=>setReplyContent(e.target.value)} />
                <button onClick={onReply}>Reply</button>
            </div>
        )}

        {hasReplies && (
            <button 
                className="toggle-replies-btn" 
                onClick={() => toggleReplies(comment._id, comment.replies)}
                style={{ background: 'none', border: 'none', color: '#0079d3', cursor: 'pointer', padding: '5px 0', fontWeight: 'bold' }}
            >
                {isRepliesOpen ? "Hide" : `View ${comment.replies.length} Replies`}
            </button>
        )}

        {isRepliesOpen && repliesLoaded && (
            <>
                {comment.replies.map(reply => (
                    <CommentItem key={reply._id} comment={reply} level={level + 1} />
                ))}
                
                {showLoadMoreReplies && (
                    <Button 
                        onClick={() => handleLoadMoreReplies(comment._id, comment.replies.length)}
                        size="small"
                        sx={{ ml: 2, mt: 1, textTransform: 'none' }}
                    >
                        Load more replies...
                    </Button>
                )}
            </>
        )}
      </div>
    );
  };

  if (loading) return <div className="loading-spinner">Loading Post...</div>;
  if (!post) return <div>Post not found</div>;

  const moderator = post?.communityID?.moderators?.find(mod => mod.user === currentUserId);

  return (
    <div className="post-details">
      <div className="post-header">
        <h1>{post.title}</h1>
        <div className="user-info">
          <img src={post.userID?.image} alt="avatar" className="user-avatar" />
          <span>u/{post.userID?.username}</span>
        </div>
        
        {post.awardsReceived && post.awardsReceived.length > 0 && (
            <div className="post-awards-bar" style={{ display: 'flex', gap: '4px', margin: '4px 0' }}>
                {Object.keys(post.awardsReceived.reduce((acc, curr) => { acc[curr.awardName] = true; return acc; }, {}))
                .map(awardName => (
                    <span key={awardName} style={{ background: '#f0f0f0', borderRadius: '12px', padding: '2px 6px', fontSize: '0.75rem' }}>🏆 {awardName}</span>
                ))}
            </div>
        )}

        {post.userID._id === currentUserId && (
            <div className="owner-actions" style={{margin: '10px 0'}}>
                <button onClick={() => navigate(`/api/posts/${post._id}/edit`)} style={{marginRight: 10}}>Edit Post</button>
                <button onClick={handleDeletePost} style={{color: 'red'}}>Delete Post</button>
            </div>
        )}

        <div className="summary-section" style={{margin: '10px 0'}}>
            {!summary && (
                <button onClick={handleSummarize} disabled={isSummarizing}>
                    {isSummarizing ? "Summarizing..." : "✨ Summarize AI"}
                </button>
            )}
            {summary && <div className="ai-summary" style={{background:'#f9f9f9', padding:10, borderRadius:5}}>{summary}</div>}
        </div>

        <div className="post-interactions">
            <button onClick={() => handlevote(1, post._id, "post")}>⬆ {post.upvotes.length}</button>
            <button onClick={() => handlevote(2, post._id, "post")}>⬇ {post.downvotes.length}</button>
            
            {/* ✅ UPDATED: Centralized Award Menu Logic for Post */}
            <div className="award-container" style={{display:'inline-block', position:'relative', marginLeft: 10}}>
                <button onClick={() => toggleAwardMenu(post._id)}>🎁 Award</button>
                
                {/* Only show if the active ID matches the Post ID */}
                {activeAwardMenuId === post._id && (
                    <div className="award-dropdown">
                        {(communityAwards.length === 0) && <div>No awards available</div>}
                        {communityAwards.map(award => (
                            <div key={award.name} className="award-item" onClick={(e)=> giveAward(award.name, e)}>
                                {award.icon} {award.name} ({award.cost})
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        {moderator && <Button variant="outlined" color="error">Mod Delete</Button>}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        <div className="media-wrapper">
            {post.mediaType === "image" && post.mediaUrl && <img src={post.mediaUrl} alt="content" className="post-image"/>}
            {post.mediaType === "video" && post.mediaUrl && <Video src={post.mediaUrl} />}
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit} className="main-comment-form">
            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="What are your thoughts?" rows="4" style={{width: '100%'}} />
            <button type="submit" style={{marginTop: 5}}>Post Comment</button>
        </form>

        <div className="comments-list" style={{marginTop: 20}}>
            {comments.map(comment => (
                <CommentItem key={comment._id} comment={comment} />
            ))}
        </div>

        {/* Root Comment Pagination */}
        {hasMoreComments && (
            <button 
                onClick={handleLoadMoreComments} 
                disabled={loadingMore}
                className="load-more-btn"
                style={{marginTop: '20px', width: '100%', padding: '10px'}}
            >
                {loadingMore ? "Loading..." : "Load More Comments"}
            </button>
        )}
      </div>
    </div>
  );
}