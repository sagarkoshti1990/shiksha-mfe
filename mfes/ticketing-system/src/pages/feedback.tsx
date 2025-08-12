import React from "react";
import { Container, Typography, Box } from "@mui/material";
import ZohoDeskWidget from "../components/common/ZohoDeskWidget";

const FeedbackPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Submit Feedback or Support Request
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 4 }}
      >
        Use the form below to submit your feedback, questions, or support
        requests directly to our team.
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ZohoDeskWidget title="" width="100%" height={600} />
      </Box>
    </Container>
  );
};

export default FeedbackPage;
