import React from "react";
import { AuthProvider } from "./firebase/authContext";
import AppNavigator from "./src/components/navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
