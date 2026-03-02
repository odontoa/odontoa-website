import { AuthProvider } from "./auth/AuthProvider";
import AppRoutes from "./routes/AppRoute";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
