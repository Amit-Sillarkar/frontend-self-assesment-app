import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./context/AuthContext";  // ← ADD
import "./index.css";
import App from "./App";
import { ToastProvider } from "./components/toast-notification";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);