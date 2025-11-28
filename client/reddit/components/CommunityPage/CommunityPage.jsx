import { useState } from "react"
import { Box } from "@mui/material"
import Header from "./Header"
import CommunityDetails from "../CommunityPage/CommunityDetails"
import PostsSection from "./PostsSection"
export default function CommunityPage(props){
    const {communityId} = props
    const getCommunity = ()=>{
        //Axios request to get community details by ID
        return {
  "subreddit_name": "popculturechat",
  "subreddit_title": "POP CULTURE chat",
  "subreddit_description": "For serious gossips with a great sense of humor. No bores, no bullies. Come for the gossip, stay for the analysis & community.",
  "created_date": "Jan 29, 2022",
  "visibility": "Public",
  "subscribers_count": "6M",
  "subscribers_label": "weekly in the group chat",
  "online_users_count": "41K",
  "online_users_label": "spilling the tea",
  "category": "Entertainment",
  "join_status": "joined",
  "created_date": "Jan 29, 2022",
  "visibility": "Public",
  "subscribers_label": "weekly in the group chat",
  "online_users_label": "spilling the tea",
  "banner": "https://i.redd.it/drew-these-6-prismos-to-use-1-of-em-as-my-reddit-banner-v0-0upgisj8l8wb1.png?width=1920&format=png&auto=webp&s=4f1031984d2b58bdc67e5b8c92079794f52a8b60",
  "iconUrl": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
  "name": "r/popculturechat",
  "moderators": [
  {
    "username": "u/aprildismay",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "Could you just not breathe?",
    "flairColor": "#e8f4f8"
  },
  {
    "username": "u/crunkbunny",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "Hasn't cried since 1997",
    "flairColor": "#ffc0cb"
  },
  {
    "username": "u/HauteAssMess",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "anne boleyn stan",
    "flairColor": "#f0f0f0",
    "subtitle": "hauteassmess"
  },
  {
    "username": "u/popculturechat",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png"
  },
  {
    "username": "u/nizaad",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "THEE Princess Of Nazareth",
    "flairColor": "#f0f0f0"
  },
  {
    "username": "u/DontFWithMelmPetty",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "Threat to Humanity 💅",
    "flairColor": "#f0f0f0",
    "subtitle": "Petty ♡"
  },
  {
    "username": "u/hannahspants",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "clemthearcher stan",
    "flairColor": "#f0f0f0"
  },
  {
    "username": "u/Chanburgesa",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "On Wednesdays We Wear Pink",
    "flairColor": "#f0f0f0",
    "subtitle": "Goddess, Cheeseburger, etc."
  },
  {
    "username": "u/clemthearcher",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png",
    "flair": "swamp queen",
    "flairColor": "#f0f0f0"
  },
  {
    "username": "u/WizardMama",
    "avatar": "https://static.vecteezy.com/system/resources/previews/018/930/474/non_2x/reddit-logo-reddit-icon-transparent-free-png.png"
  }
],
  "rules": ["Hamada" , "Hamada" , "Hamada" , "Hamada" , "Hamada" , "Hamada" ,"Hamada" , "Hamada" , "Hamada" , "Hamada"],

  "community_highlights": [
    {
      "type": "Discussion Thread",
      "title": "Sip & Spill Daily Discussion Thread",
      "votes": 42,
      "comments": 42,
      "image_url": ""
    },
    {
      "type": "Discussion Thread",
      "title": "Tuesday Tea Time Discussion Thread",
      "votes": 4,
      "comments": 2,
      "image_url": ""
    }
  ],
  "guest_list_is_enabled": true,
  "guest_list_description": "Guest List Only flared posts are for approved users only. If you'll like to be added to the Guest List, you can apply below. We require 30 day recent posting history on the sub and be approved if you have a history of rule violations.",
  "guest_list_button_text": "Approved User Request",
  "calendar_events": [
    {
      "title": "Movie Night",
      "date": "November 30, 2025 - 0:40K"
    }
  ],
  "sidebar_games_on_reddit": [
    {
      "name": "Pocket Grids",
      "tag": "NEW",
      "description": "Daily mini-crosswords",
      "players": "600k monthly players"
    }
  ],
  "sidebar_hot_and_cold": [
    "Farm Merge Valley",
    "Minigrams",
    "Discover More Games"
  ],
  "sidebar_custom_feeds": [
    "Create Custom Feed"
  ],
  "sidebar_recent_subreddits": [
    "r/popculturechat",
    "r/tflfunny",
    "r/AskReddit",
    "r/tfljbbeddt9998"
  ]
}
    }

const community = getCommunity(communityId)
const getPosts = (id , filter)=>{
    //Axios request to get posts based on a certain communityID
}
const [posts , setPosts] = useState('hamada' , 'hamada')
const [joined , setJoined] = useState(community.join_status)
return(
    <Box sx = {{display : 'flex' , flexDirection : 'column'}}>
       <Header community = {community} setJoined = {setJoined} joined = {joined}/>
       <Box sx={{display : 'flex' , justifyContent :'space-between' }}>
        <PostsSection/>
        <CommunityDetails community = {community}/>
        </Box> 
    </Box>
)


}