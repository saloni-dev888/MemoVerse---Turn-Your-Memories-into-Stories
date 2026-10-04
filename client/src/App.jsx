import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateMemory from "./pages/CreateMemory";
import MemoryDetail from "./pages/MemoryDetail";

function ProtectedLayout({ children }) {
  return <>
    <Navbar />
    {children}
  </>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><ProtectedLayout><Dashboard /></ProtectedLayout></ProtectedRoute>
      } />
      <Route path="/create" element={
        <ProtectedRoute><ProtectedLayout><CreateMemory /></ProtectedLayout></ProtectedRoute>
      } />
      <Route path="/memory/:id" element={
        <ProtectedRoute><ProtectedLayout><MemoryDetail /></ProtectedLayout></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
