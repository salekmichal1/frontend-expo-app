import App from "./App";
import { AuthContextProvider } from "./src/context/AuthContext";

export default function index() {
  return (
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  );
}
