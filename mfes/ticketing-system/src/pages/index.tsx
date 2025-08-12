import React, { useState, useCallback, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Fab,
  Divider,
} from "@mui/material";
import { SupportAgent, Close } from "@mui/icons-material";
import ZohoDeskWidget from "../components/common/ZohoDeskWidget";
import ZohoDeskScriptComponent from "./ZohoDeskTicketing";

const ZohoTicketingDemo: React.FC = () => {
  // Simple state management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    priority: "medium",
    subject: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    ticketId?: string;
  } | null>(null);

  // Mock user data
  const mockUser = useMemo(
    () => ({
      name: "sagar Doe",
      email: "sagar_t@techjoomla.com",
      phone: "+1234567890",
    }),
    []
  );

  // Categories and priorities - memoized to prevent re-renders
  const categories = useMemo(
    () => [
      { id: "technical", label: "Technical Issues" },
      { id: "content", label: "Content Related" },
      { id: "account", label: "Account Issues" },
      { id: "course", label: "Course Access" },
    ],
    []
  );

  const priorities = useMemo(
    () => [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
    ],
    []
  );

  // Submit ticket directly to API (no redirect fallback)
  const submitTicket = useCallback(async () => {
    try {
      setSubmitting(true);
      setSubmitResult(null);

      // Prepare ticket data
      const ticketData = {
        userId: `demo_user_${Date.now()}`,
        username: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        timestamp: new Date().toISOString(),
        source: "ticketing-mfe",
        appName: "learner-web-app",
      };

      console.log("Submitting ticket:", ticketData);

      // Try different API paths due to basePath configuration
      const apiPaths = [
        "/api/tickets/create", // Standard path Full URL
      ];

      let response = null;
      let lastError = null;

      for (const apiPath of apiPaths) {
        try {
          console.log(`Trying API path: ${apiPath}`);

          response = await fetch(`${apiPath}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketData),
          });

          if (response.ok) {
            break; // Success, exit the loop
          } else {
            console.log(
              `API path ${apiPath} failed with status: ${response.status}`
            );
            lastError = new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          console.log(`API path ${apiPath} failed:`, error);
          lastError = error;
          response = null;
        }
      }

      if (response && response.ok) {
        const result = await response.json();
        console.log("API Response:", result);

        setSubmitResult({
          success: true,
          message:
            result.method === "local"
              ? "Ticket created successfully (Local Mode - Check console)"
              : "Ticket created successfully in Zoho Desk",
          ticketId: result.ticketId,
        });

        // Auto-close form after success
        setTimeout(() => {
          closeForm();
        }, 3000);
      } else {
        throw lastError || new Error("All API paths failed");
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setSubmitResult({
        success: false,
        message: `Failed to submit ticket: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please check console for details.`,
      });
    } finally {
      setSubmitting(false);
    }
  }, [formData, mockUser]);

  // Open form modal
  const openForm = useCallback(() => {
    setIsFormOpen(true);
    setSubmitResult(null);
    // Reset form
    setFormData({
      category: "",
      priority: "medium",
      subject: "",
      description: "",
    });
  }, []);

  // Close form modal
  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setSubmitResult(null);
  }, []);

  // Handle form input changes - optimized to prevent re-renders
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!formData.category || !formData.subject || !formData.description) {
      setSubmitResult({
        success: false,
        message:
          "Please fill in all required fields (Category, Subject, Description)",
      });
      return;
    }

    await submitTicket();
  }, [formData.category, formData.subject, formData.description, submitTicket]);

  // Memoized button components to prevent re-renders
  const HeaderButton = useMemo(
    () => (
      <Button
        variant="contained"
        startIcon={<SupportAgent />}
        onClick={openForm}
        sx={{ textTransform: "none" }}
      >
        Raise Ticket
      </Button>
    ),
    [openForm]
  );

  const DashboardButton = useMemo(
    () => (
      <Button
        variant="contained"
        startIcon={<SupportAgent />}
        onClick={openForm}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: 2,
        }}
      >
        Raise Ticket
      </Button>
    ),
    [openForm]
  );

  const SidebarButton = useMemo(
    () => (
      <Button
        variant="outlined"
        startIcon={<SupportAgent />}
        onClick={openForm}
        fullWidth
        sx={{ textTransform: "none" }}
      >
        Raise Ticket
      </Button>
    ),
    [openForm]
  );

  const CustomButton = useMemo(
    () => (
      <Button
        variant="outlined"
        startIcon={<SupportAgent />}
        onClick={openForm}
        size="large"
        sx={{ textTransform: "none" }}
      >
        Get Support
      </Button>
    ),
    [openForm]
  );

  const FloatingButton = useMemo(
    () => (
      <Fab
        color="primary"
        onClick={openForm}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <SupportAgent />
      </Fab>
    ),
    [openForm]
  );

  // Memoized form modal to prevent unnecessary re-renders
  const TicketFormModal = useMemo(
    () => (
      <Dialog
        open={isFormOpen}
        onClose={closeForm}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: 600,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6">Raise Support Ticket</Typography>
          <IconButton onClick={closeForm} size="small" disabled={submitting}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Submission Result */}
          {submitResult && (
            <Alert
              severity={submitResult.success ? "success" : "error"}
              sx={{ mb: 2 }}
              onClose={() => setSubmitResult(null)}
            >
              {submitResult.message}
              {submitResult.ticketId && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Ticket ID:</strong> {submitResult.ticketId}
                </Typography>
              )}
            </Alert>
          )}

          {/* User Information Display */}
          <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Contact Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {mockUser.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong> {mockUser.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Phone:</strong> {mockUser.phone}
            </Typography>
          </Box>

          {/* Category Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={formData.category}
              label="Category *"
              onChange={(e) => handleInputChange("category", e.target.value)}
              disabled={submitting}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Priority Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => handleInputChange("priority", e.target.value)}
              disabled={submitting}
            >
              {priorities.map((priority) => (
                <MenuItem key={priority.value} value={priority.value}>
                  {priority.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subject Field */}
          <TextField
            fullWidth
            label="Subject *"
            placeholder="Brief description of your issue"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            disabled={submitting}
            sx={{ mb: 2 }}
          />

          {/* Description Field */}
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Description *"
            placeholder="Please provide detailed information about your issue..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            disabled={submitting}
            sx={{ mb: 2 }}
          />

          <Typography variant="caption" color="text.secondary">
            After clicking &quot;Submit Ticket&quot;, your ticket will be
            submitted directly to Zoho Desk API. No redirects - direct
            integration only.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeForm} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ minWidth: 120 }}
          >
            {submitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </DialogActions>
      </Dialog>
    ),
    [
      isFormOpen,
      closeForm,
      submitting,
      submitResult,
      mockUser,
      formData,
      categories,
      priorities,
      handleInputChange,
      handleSubmit,
    ]
  );

  return <ZohoDeskScriptComponent />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Zoho Ticketing MFE Demo
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 3 }}
      >
        Direct API integration with Zoho Desk. No redirects - pure API
        submission. Click any button below to create a real support ticket.
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>API Mode:</strong> Direct submission to Zoho Desk API. User:{" "}
          {mockUser.name} ({mockUser.email})
        </Typography>
      </Alert>

      <Alert severity="success" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>Optimized:</strong> Form is optimized to prevent unnecessary
          re-renders. API tries multiple paths to handle basePath configuration
          automatically.
        </Typography>
      </Alert>

      <Divider sx={{ mb: 4 }} />

      <ZohoDeskScriptComponent />

      {/* Zoho ASAP Widget Controls */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Zoho ASAP Widget Controls
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use these buttons to control the Zoho ASAP widget programmatically:
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            // onClick={ZohoWidgetUtils.openWidget}
            size="small"
          >
            Open Widget
          </Button>
          <Button
            variant="outlined"
            // onClick={ZohoWidgetUtils.closeWidget}
            size="small"
          >
            Close Widget
          </Button>
          <Button
            variant="outlined"
            // onClick={ZohoWidgetUtils.hideWidget}
            size="small"
          >
            Hide Launcher
          </Button>
          <Button
            variant="outlined"
            // onClick={ZohoWidgetUtils.showWidget}
            size="small"
          >
            Show Launcher
          </Button>
          <Button
            variant="outlined"
            // onClick={() => {
            //   console.log(
            //     "Zoho Widget Available:",
            //     ZohoWidgetUtils.isAvailable()
            //   );
            // }}
            size="small"
          >
            Check Status
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h5" gutterBottom>
        Alternative: Custom Ticket Form
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Or use our custom-built form components below:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Header Button
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Direct API submission - no redirects
            </Typography>
            {HeaderButton}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dashboard Button
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Optimized form with Zoho integration
            </Typography>
            {DashboardButton}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sidebar Button
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Memoized components for performance
            </Typography>
            {SidebarButton}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Custom Button
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Real Zoho Desk ticket creation
            </Typography>
            {CustomButton}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Direct API Integration
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: "success.50" }}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                ✓ No Redirects
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Direct API submission only - no fallback redirects to portal
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: "success.50" }}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                ✓ Multiple API Paths
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Automatically handles basePath configuration issues
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, bgcolor: "success.50" }}>
              <Typography variant="subtitle2" gutterBottom color="success.main">
                ✓ Optimized Rendering
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Memoized components prevent unnecessary re-renders
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          API Configuration Status
        </Typography>
        <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Current Status:</strong> API will work in local mode if Zoho
            credentials are not configured.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Client Credentials:</strong> ✅ Available
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Organization ID:</strong> ✅ 2389290 (from your curl
            example)
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            <strong>Access Token:</strong> ❌ Need to generate
          </Typography>
          <Typography
            variant="body2"
            sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
          >
            🚀 To generate your access token:
          </Typography>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              bgcolor: "background.paper",
              p: 1,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.300",
            }}
          >
            {`1. cd mfes/ticketing-system
2. node generate-token.js
3. Visit the authorization URL
4. Grant permissions
5. Copy code from redirect URL
6. node generate-token.js YOUR_CODE
7. Update .env.local with the token`}
          </Typography>
        </Paper>
      </Box>

      {/* Floating Action Button */}
      {FloatingButton}

      {/* Ticket Form Modal */}
      {TicketFormModal}
    </Container>
  );
};

export default ZohoTicketingDemo;
