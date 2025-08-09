import React, { useEffect } from "react";

interface ZohoDeskScriptComponentProps {
  nonce?: string;
}

const ZohoDeskScriptComponent: React.FC<ZohoDeskScriptComponentProps> = ({
  nonce = "{place_your_nonce_value_here}",
}) => {
  useEffect(() => {
    // (window as any).ZohoDeskAsapReady(() => {
    //   (window as any).ZohoDeskAsap.invoke("open");
    // });
  }, [nonce]);

  return null; // This component doesn't render any visible content
};

export default ZohoDeskScriptComponent;
