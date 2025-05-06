import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { PageUser } from "./PageUser/PageUser";
import { PageAdmin } from "./PageAdmin/PageAdmin";

export function App() {
  return (
    <Router basename="/CareTrack">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PageUser />} />
        <Route path="/admin" element={<PageAdmin />} />
        <Route path="*" element={<div className="fontTitle text-[50px] text-center p-20">Error Path</div>} />
      </Routes>
    </Router>
  )
}
