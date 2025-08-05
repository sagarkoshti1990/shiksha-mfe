import React from "react";
import { Container, Typography, Box, Paper, Grid } from "@mui/material";
import { TicketingProvider } from "@/components/common/TicketingProvider";
import {
  TicketRaiseButton,
  HeaderTicketButton,
  SidebarTicketButton,
  FloatingTicketButton,
  DashboardTicketButton,
} from "@/components/user/TicketRaiseButton";

const ZohoTicketingDemo: React.FC = () => {
  const demoConfig = {
    appName: "learner-web-app" as const,
    features: {
      ticketCreation: true,
      csvExport: false,
      ticketManagement: false,
    },
    roles: {
      canCreateTicket: ["learner", "student"],
      canExportData: [],
      canManageTickets: [],
    },
    ui: {
      theme: "light" as const,
      placement: "header" as const,
      buttonStyle: "primary" as const,
    },
    zoho: {
      orgId: "demo_org",
      departmentId: "demo_dept",
      portalUrl: "https://demo.zohodesk.com",
      customFields: {
        cf_app_source: "learner-web-app",
        cf_user_type: "demo",
      },
    },
    categories: [
      { id: "technical", label: "Technical Issues" },
      { id: "content", label: "Content Related" },
      { id: "account", label: "Account Issues" },
    ],
  };

  return (
    <TicketingProvider config={demoConfig} userRole="learner">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Zoho Ticketing MFE Demo
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          This is a demonstration of the reusable Zoho Ticketing MFE components.
          The components can be integrated into different applications with
          various configurations.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Header Button
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Suitable for navigation bars and headers
              </Typography>
              <HeaderTicketButton />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Dashboard Button
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Designed for dashboard layouts
              </Typography>
              <DashboardTicketButton />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sidebar Button
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Perfect for sidebar navigation
              </Typography>
              <SidebarTicketButton />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Custom Button
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Fully customizable appearance
              </Typography>
              <TicketRaiseButton
                variant="secondary"
                label="Get Support"
                size="large"
              />
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Integration Example
          </Typography>
          <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontFamily: "monospace" }}
            >
              {`import { TicketingProvider, TicketRaiseButton } from 'zoho-ticketing';

const MyApp = () => (
  <TicketingProvider appName="learner-web-app" userRole="learner">
    <TicketRaiseButton placement="header" />
  </TicketingProvider>
);`}
            </Typography>
          </Paper>
        </Box>

        {/* Floating button example */}
        <FloatingTicketButton />
      </Container>
    </TicketingProvider>
  );
};

export default ZohoTicketingDemo;
