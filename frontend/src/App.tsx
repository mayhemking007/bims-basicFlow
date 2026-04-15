import { Navigate, Route, Routes } from "react-router-dom";
import { CreateMindCardPage } from "./pages/CreateMindCardPage";
import { MindCardPlayerPage } from "./pages/MindCardPlayerPage";
import { MindCardWallPage } from "./pages/MindCardWallPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MindCardWallPage />} />
      <Route path="/create" element={<CreateMindCardPage />} />
      <Route path="/card/:id" element={<MindCardPlayerPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
