import { styled } from "@mui/material/styles";

export const AccordionHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "6px 12px",
  cursor: "pointer",
  userSelect: "none",
});

export const SectionTitle = styled("p")({
  margin: 0,
  fontSize: "13px",
  fontWeight: 700,
  color: "#878a8c",
});

export const ExpandIconWrapper = styled("div")(({ open }) => ({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  transform: open ? "rotate(0deg)" : "rotate(-90deg)",
  transition: "transform 0.2s ease",
  color: "#878a8c",
}));
