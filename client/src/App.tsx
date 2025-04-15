import { AppProvider } from "./lib/context";
import Layout from "./components/layout/Layout";
import "./styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Layout />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
