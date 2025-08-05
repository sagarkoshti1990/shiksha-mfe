import React, { useEffect, ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import { useTicketingStore } from "@/store/ticketingStore";
import { AppConfig } from "@/types/config.types";
import { ConfigService } from "@/services/configService";
import { TicketService } from "@/services/ticketService";

interface TicketingProviderProps {
  children: ReactNode;
  config?: Partial<AppConfig>;
  appName?: string;
  userRole?: string;
}

export const TicketingProvider: React.FC<TicketingProviderProps> = ({
  children,
  config,
  appName,
  userRole,
}) => {
  const { setAppConfig, setCurrentUser } = useTicketingStore();

  useEffect(() => {
    // Initialize configuration
    const initConfig = async () => {
      try {
        let finalConfig: AppConfig;

        if (config && appName) {
          // Use provided config with app name
          finalConfig = ConfigService.mergeConfig(config, appName);
        } else if (appName) {
          // Use default config for app
          finalConfig = ConfigService.initializeConfig(appName);
        } else {
          // Use provided config as-is or default
          finalConfig =
            (config as AppConfig) ||
            ConfigService.getAppConfig("learner-web-app");
        }

        // Validate configuration
        const validation = ConfigService.validateAppConfig(finalConfig);
        if (!validation.isValid) {
          console.warn("Invalid ticketing configuration:", validation.errors);
        }

        setAppConfig(finalConfig);

        // Initialize user data
        const userData = TicketService.getUserData();
        if (userData) {
          // Override role if provided
          if (userRole) {
            userData.role = userRole;
          }
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error initializing ticketing provider:", error);
      }
    };

    initConfig();
  }, [config, appName, userRole, setAppConfig, setCurrentUser]);

  // Create theme based on config
  const theme = createTheme({
    palette: {
      mode: config?.ui?.theme === "dark" ? "dark" : "light",
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#dc004e",
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
          success: {
            iconTheme: {
              primary: theme.palette.success.main,
              secondary: theme.palette.success.contrastText,
            },
          },
          error: {
            iconTheme: {
              primary: theme.palette.error.main,
              secondary: theme.palette.error.contrastText,
            },
          },
        }}
      />
    </ThemeProvider>
  );
};
