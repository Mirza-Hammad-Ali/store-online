import { useEffect } from "react";
import { testBackend } from "./backendTest";

export default function BackendConnection() {
  useEffect(() => {
    testBackend().catch(() => {
      // Connection errors are handled silently.
    });
  }, []);

  return null;
}