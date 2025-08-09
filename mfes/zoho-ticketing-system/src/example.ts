import {
  ZohoTicketingComponent,
  createZohoTicketingForm,
  ZohoTicketFormProps,
} from "./components/HtmlComponent";

// Example 1: Basic usage
function initializeBasicForm() {
  const formContainer = document.createElement("div");
  formContainer.id = "zoho-form-container";
  document.body.appendChild(formContainer);

  const ticketForm = new ZohoTicketingComponent("zoho-form-container");

  // The form will be rendered automatically in the container
  console.log("Basic Zoho ticket form initialized");
}

// Example 2: Using with custom event handlers
function initializeFormWithHandlers() {
  const formContainer = document.createElement("div");
  formContainer.id = "zoho-form-with-handlers";
  document.body.appendChild(formContainer);

  const props: ZohoTicketFormProps = {
    onSubmit: (formData: FormData) => {
      console.log("Form submitted with data:", formData);

      // Extract form data for processing
      const data: Record<string, string> = {};
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });

      console.log("Extracted data:", data);

      // You can process the data here or send it to your own API
      // instead of directly submitting to Zoho
    },
    onReset: () => {
      console.log("Form was reset");
    },
  };

  const ticketForm = new ZohoTicketingComponent(
    "zoho-form-with-handlers",
    props
  );

  return ticketForm;
}

// Example 3: Using the helper function
function initializeWithHelper() {
  const formContainer = document.createElement("div");
  formContainer.id = "zoho-form-helper";
  document.body.appendChild(formContainer);

  const ticketForm = createZohoTicketingForm("zoho-form-helper", {
    onSubmit: (formData) => {
      // Custom submit logic
      console.log("Custom submit handler called");

      // Example: Send to your own API endpoint
      fetch("/api/tickets", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Ticket created:", data);
          alert("Ticket submitted successfully!");
        })
        .catch((error) => {
          console.error("Error submitting ticket:", error);
          alert("Error submitting ticket. Please try again.");
        });
    },
  });

  return ticketForm;
}

// Example 4: Programmatically working with form data
function demonstrateFormMethods() {
  const formContainer = document.createElement("div");
  formContainer.id = "zoho-form-methods";
  document.body.appendChild(formContainer);

  const ticketForm = createZohoTicketingForm("zoho-form-methods");

  // Set some initial values
  setTimeout(() => {
    ticketForm.setFieldValue("First Name", "John");
    ticketForm.setFieldValue("Contact Name", "Doe");
    ticketForm.setFieldValue("Email", "john.doe@example.com");
    ticketForm.setFieldValue("Subject", "Test Subject");

    console.log("Initial values set");
  }, 1000);

  // Get form data after 3 seconds
  setTimeout(() => {
    const formData = ticketForm.getFormData();
    console.log("Current form data:", formData);
  }, 3000);

  return ticketForm;
}

// Example usage in DOM ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing examples...");

  // Uncomment the example you want to test:

  // initializeBasicForm();
  // initializeFormWithHandlers();
  // initializeWithHelper();
  // demonstrateFormMethods();
});

// Export examples for external use
export {
  initializeBasicForm,
  initializeFormWithHandlers,
  initializeWithHelper,
  demonstrateFormMethods,
};
