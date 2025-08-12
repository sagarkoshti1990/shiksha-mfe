import React, { useEffect } from "react";

interface ZohoDeskTicketingProps {
  nonce?: string;
}
const crypto = require("crypto");
const nonceDefult = crypto.randomBytes(16).toString("base64");
const ZohoDeskTicketing: React.FC<ZohoDeskTicketingProps> = ({
  nonce = nonceDefult,
}) => {
  const NEXT_PUBLIC_ZOHO_WIDGET_ID = process.env.NEXT_PUBLIC_ZOHO_WIDGET_ID;
  const NEXT_PUBLIC_ZOHO_ORG_ID = process.env.NEXT_PUBLIC_ZOHO_ORG_ID;
  const src = `https://desk.zoho.in/portal/api/web/asapApp/${NEXT_PUBLIC_ZOHO_WIDGET_ID}?orgId=${NEXT_PUBLIC_ZOHO_ORG_ID}`;

  useEffect(() => {
    // Check if script is already loaded
    if (document.getElementById("zohodeskasapscript")) {
      return;
    }

    // Create and configure the script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "zohodeskasapscript";
    script.defer = true;
    script.nonce = nonce;
    script.src = src;

    // Set up the ZohoDeskAsapReady function
    (window as any).ZohoDeskAsapReady = function (callback: () => void) {
      const asyncCalls = ((window as any).ZohoDeskAsap__asyncalls =
        (window as any).ZohoDeskAsap__asyncalls || []);

      if ((window as any).ZohoDeskAsapReadyStatus) {
        if (callback) asyncCalls.push(callback);
        asyncCalls.forEach((cb: () => void) => cb && cb());
        (window as any).ZohoDeskAsap__asyncalls = null;
      } else if (callback) {
        asyncCalls.push(callback);
      }
    };

    // Insert the script into the document
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Cleanup function to remove script when component unmounts
    return () => {
      const scriptElement = document.getElementById("zohodeskasapscript");
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      // Clean up global variables
      delete (window as any).ZohoDeskAsapReady;
      delete (window as any).ZohoDeskAsap__asyncalls;
      delete (window as any).ZohoDeskAsapReadyStatus;
    };
  }, [nonce, NEXT_PUBLIC_ZOHO_WIDGET_ID, NEXT_PUBLIC_ZOHO_ORG_ID]);

  return null; // This component doesn't render any visible content
};

export default ZohoDeskTicketing;
