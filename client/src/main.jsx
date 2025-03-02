import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { appStore } from "./app/store.js";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const Custom = ({ children }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <LoadingSpinner/> : <>{children}</>}</>;
};

createRoot(document.getElementById("root")).render(
  <Provider store={appStore}>
    <Custom>
      <App />
      <Toaster />
    </Custom>
  </Provider>
);
