import { useState } from "react";


export default function MockPost({ post }) {
  const [votes, setVotes] = useState(post.votes);
  const [voteStatus, setVoteStatus] = useState(null);

  const handleUpvote = () => {
    if (voteStatus === 'up') {
      setVotes(votes - 1);
      setVoteStatus(null);
    } else if (voteStatus === 'down') {
      setVotes(votes + 2);
      setVoteStatus('up');
    } else {
      setVotes(votes + 1);
      setVoteStatus('up');
    }
  };

  const handleDownvote = () => {
    if (voteStatus === 'down') {
      setVotes(votes + 1);
      setVoteStatus(null);
    } else if (voteStatus === 'up') {
      setVotes(votes - 2);
      setVoteStatus('down');
    } else {
      setVotes(votes - 1);
      setVoteStatus('down');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '16px',
      display: 'flex',
      gap: '16px'
    }}>
      {/* Vote Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '40px'
      }}>
        <button 
          onClick={handleUpvote}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: voteStatus === 'up' ? '#ff4500' : '#878a8c',
            fontSize: '20px',
            padding: '4px'
          }}
        >
          ▲
        </button>
        <span style={{
          fontWeight: 'bold',
          fontSize: '14px',
          color: voteStatus === 'up' ? '#ff4500' : voteStatus === 'down' ? '#7193ff' : '#1c1c1c'
        }}>
          {votes}
        </span>
        <button 
          onClick={handleDownvote}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: voteStatus === 'down' ? '#7193ff' : '#878a8c',
            fontSize: '20px',
            padding: '4px'
          }}
        >
          ▼
        </button>
      </div>

      {/* Content Section */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: post.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            {post.community[0].toUpperCase()}
          </div>
          <span style={{ fontSize: '12px', color: '#878a8c' }}>
            r/{post.community} • Posted by u/{post.author} • {post.time}
          </span>
        </div>

        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
          {post.title}
        </h3>

        <p style={{ margin: '0 0 16px 0', color: '#555', fontSize: '14px', lineHeight: '1.5' }}>
          {post.content}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#878a8c',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            💬 {post.comments} Comments
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#878a8c',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}