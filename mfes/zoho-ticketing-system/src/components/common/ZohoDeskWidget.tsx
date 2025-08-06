import React, { useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";

interface ZohoDeskWidgetProps {
  title?: string;
  width?: number | string;
  height?: number | string;
}

const ZohoDeskWidget: React.FC<ZohoDeskWidgetProps> = ({
  title = "Zoho Desk Support",
  width = 890,
  height = 570,
}) => {
  useEffect(() => {
    // Load the Zoho Desk feedback widget script
    const script = document.createElement("script");
    script.src =
      "https://desk.zoho.in/portal/api/feedbackwidget/214560000000299007?orgId=60044901378&displayType=iframe";
    script.async = true;

    // Append script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      {title && (
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <iframe
          id="zsfeedbackFrame"
          width={width}
          height={height}
          name="zsfeedbackFrame"
          scrolling="no"
          allowTransparency={false}
          frameBorder="0"
          style={{ border: 0 }}
          src="https://desk.zoho.in/support/fbw?formType=AdvancedWebForm&fbwId=edbsn24068fe4d1d00a9444dea443ceb240a7a54b6140d388fa8b434cda8a38e3c417&xnQsjsdp=edbsn9c63a10a0d3a4f07eb4e88d43496f794&mode=showNewWidget&displayType=iframe"
          title="Zoho Desk Feedback Widget"
        />
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block", textAlign: "center" }}
      >
        Powered by Zoho Desk
      </Typography>
    </Paper>
  );
};

export default ZohoDeskWidget;
