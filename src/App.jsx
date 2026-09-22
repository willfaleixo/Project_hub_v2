import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import ExpandedViewPage from "./pages/ExpandedViewPage";
import Approvals from "./pages/Approvals";
import Wiki from "./pages/Wiki";
import Users from "./pages/Users";
import NewsPage from "./pages/NewsPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Application Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="projectsDetail" element={<ProjectDetails />} />
            <Route path="expanded-view" element={<ExpandedViewPage />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="wiki" element={<Wiki />} />
            <Route path="users" element={<Users />} />
            <Route path="news" element={<NewsPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
