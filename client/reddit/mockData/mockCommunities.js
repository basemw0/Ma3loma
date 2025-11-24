export function generateMockCommunities(n) {
  return Array.from({ length: 250 }, (_, i) => ({
    Cnum: i + 1,
    communityName: `r/community${i + 1}`,
    communityDescription: `This is a description for community ${i + 1}. Lorem ipsum dolor sit amet.`,
    numOfMembers: (Math.random() * 100).toFixed(1), // e.g., 23.4
    imgUrl: "https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png"
  }));
}
