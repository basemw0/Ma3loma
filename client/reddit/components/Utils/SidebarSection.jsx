import React, { useState } from "react";
import { Box, Collapse, List } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionHeader,
  SectionTitle,
  ExpandIconWrapper,
} from "./SidebarSection.styles";

export default function SidebarSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box>
      <AccordionHeader onClick={() => setOpen(!open)}>
        <SectionTitle>{title}</SectionTitle>

        <ExpandIconWrapper open={open}>
          <ExpandMoreIcon fontSize="small" />
        </ExpandIconWrapper>
      </AccordionHeader>

      <Collapse in={open}>
        <List sx={{ mt: 0 }}>{children}</List>
      </Collapse>
    </Box>
  );
}
