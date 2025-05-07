import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { PageUser } from "./PageUser/PageUser";
import { PageAdmin } from "./PageAdmin/PageAdmin";
import { Layout } from './Layout';
import { useAuth } from '../hooks/useAuth';
import { PopUp } from '../portals/PopUp';

export function App() {
  const { user } = useAuth()

  return (
    <Router basename="/CareTrack">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<PageUser />} />
          {user?.role === "admin" && (
            <Route path="admin" element={<PageAdmin />} />
          )}
          <Route path="*" element={<div className="fontTitle text-[50px] text-center p-30">Error Path</div>} />
        </Route>
      </Routes>
      {/* All PopUps in one portal */}
      <PopUp />
    </Router>
  )
}
