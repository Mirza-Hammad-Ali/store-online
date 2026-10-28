
import { useEffect, useState } from "react";
import { testBackend } from "./backendTest";

export default function BackendConnection() {
  const [status, setStatus] = useState("Connecting to backend...");

  useEffect(() => {
    testBackend()
      .then((data) => setStatus(data.message))
      .catch(() => setStatus("Connection failed. Check your backend."));
  }, []);

  return <p>{status}</p>;
}
