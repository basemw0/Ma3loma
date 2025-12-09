import { Box } from "@mui/material";
import CommunityBox from "./CommunityBox";

export default function DisplayCategories({ communitiesArr, retrieveCommunities , }) {
    return (
        <Box 
            sx={{ 
                display: "flex",
                flexWrap: "wrap",
                gap: 2.5,
                rowGap: 3,
                width: "100%"
            }}
        >
            {communitiesArr.map((community, index) => (
                <CommunityBox 
                    key={index}
                    community={community}
                    retrieveCommunities={retrieveCommunities}
                />
            ))}
        </Box>
    );
}
