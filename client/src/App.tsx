import { AppProvider } from "./lib/context";
import Layout from "./components/layout/Layout";
import "./styles/global.css";

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default App;
