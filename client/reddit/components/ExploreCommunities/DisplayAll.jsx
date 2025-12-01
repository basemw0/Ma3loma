import { Box, Typography } from "@mui/material";
import DisplayCategories from "./DisplayCategories";

export default function DisplayAll(props) {
    const { communitiesArr, retrieveCommunities } = props
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {communitiesArr.map((topicObj, index) => (
                <Box key={index} sx={{ width: "100%" }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600, 
                            mb: 2,
                            color: "#1a1a1a"
                        }}
                    >
                        {topicObj.topic}
                    </Typography>
                    <DisplayCategories 
                        communitiesArr={topicObj.communities}
                        retrieveCommunities={retrieveCommunities}
                    />
                </Box>
            ))}
        </Box>
    );
}
