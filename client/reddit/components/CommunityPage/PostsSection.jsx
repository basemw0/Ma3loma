import { Stack } from "@mui/material";
import FilterBtn from "./FilterBtn";
import { useState } from "react";
import MockPost from "./mockPost";
export default function PostsSection(){
    const retreivePosts = (filter)=>{
        const mockPostsData = [
  {
    id: 1,
    community: 'reactjs',
    author: 'developer123',
    time: '3h ago',
    title: 'Just finished my first React project!',
    content: 'After weeks of learning, I finally completed my portfolio website using React and Material-UI. The journey was challenging but rewarding!',
    votes: 324,
    comments: 45,
    color: '#61dafb'
  },
  {
    id: 2,
    community: 'programming',
    author: 'coder_pro',
    time: '5h ago',
    title: 'Why clean code matters more than you think',
    content: 'I spent 6 months maintaining legacy code and learned that writing clean, readable code is not just a preference—it\'s a necessity.',
    votes: 892,
    comments: 127,
    color: '#4caf50'
  },
  {
    id: 3,
    community: 'webdev',
    author: 'frontend_wizard',
    time: '1d ago',
    title: 'CSS Grid vs Flexbox: When to use which?',
    content: 'Here\'s a comprehensive guide based on my 5 years of experience. TLDR: Use Grid for 2D layouts, Flexbox for 1D.',
    votes: 1243,
    comments: 89,
    color: '#ff6b6b'
  },
  {
    id: 4,
    community: 'javascript',
    author: 'js_ninja',
    time: '2h ago',
    title: '🔥 New JavaScript features in ES2024',
    content: 'The new pipeline operator is going to change how we write JavaScript. Check out these examples!',
    votes: 567,
    comments: 93,
    color: '#f7df1e'
  },
  {
    id: 5,
    community: 'typescript',
    author: 'type_guru',
    time: '4h ago',
    title: 'TypeScript 5.5 is amazing!',
    content: 'The new inference improvements make type-safe code even easier to write.',
    votes: 412,
    comments: 67,
    color: '#3178c6'
  },
  {
    id: 6,
    community: 'learnprogramming',
    author: 'newbie_dev',
    time: '15min ago',
    title: 'Just wrote my first function!',
    content: 'I know it\'s simple but I\'m so excited! Here\'s my hello world function.',
    votes: 12,
    comments: 8,
    color: '#9c27b0'
  },
  {
    id: 7,
    community: 'webdev',
    author: 'fresh_coder',
    time: '25min ago',
    title: 'Starting my web development journey',
    content: 'Any tips for a beginner? What should I learn first?',
    votes: 8,
    comments: 15,
    color: '#ff6b6b'
  },
  {
    id: 8,
    community: 'coding',
    author: 'tech_lead',
    time: '2d ago',
    title: 'I built an AI that helps debug code',
    content: 'After 6 months of development, my AI debugging assistant is finally live. It\'s helped me fix over 1000 bugs!',
    votes: 3421,
    comments: 432,
    color: '#2196f3'
  },
  {
    id: 9,
    community: 'programming',
    author: 'legend_dev',
    time: '1d ago',
    title: 'How I went from junior to senior in 2 years',
    content: 'Here are the key things that accelerated my career growth.',
    votes: 2891,
    comments: 356,
    color: '#4caf50'
  },
  {
    id: 10,
    community: 'typescript',
    author: 'type_safe',
    time: '1h ago',
    title: 'TypeScript tips that will save you hours',
    content: 'These 10 utility types have made my code so much cleaner and type-safe. Number 7 will blow your mind!',
    votes: 89,
    comments: 23,
    color: '#3178c6'
  }
];
    return mockPostsData
        //Axios logic to retrieve posts
    }
    const [posts , setPosts] = useState(retreivePosts('Best'))
    return(
        <Stack direction='column'>
            <FilterBtn retreivePosts = {retreivePosts}/>
            <Stack direction='column'>
                {posts.map((post)=>{
                    return <MockPost post = {post}/>
                })}
            </Stack>
        </Stack>
    )

}