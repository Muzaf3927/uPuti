import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// redux toolkit
import { Provider } from "react-redux";
import { store } from "./app/store";

// others
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-center" />
    </QueryClientProvider>
  </Provider>
);
