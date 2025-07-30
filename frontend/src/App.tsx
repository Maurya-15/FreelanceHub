import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Layout Components
import { LayoutFreelancer } from "@/components/layouts/LayoutFreelancer";
import { LayoutClient } from "@/components/layouts/LayoutClient";
import { LayoutAdmin } from "@/components/layouts/LayoutAdmin";

// Protected Route Components
import {
  FreelancerRoute,
  ClientRoute,
  AdminRoute,
  AuthRoute,
  PublicRoute,
} from "@/components/auth/ProtectedRoute";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Freelancer Pages
import FreelancerDashboard from "./pages/freelancer/Dashboard";
import CreateGig from "./pages/freelancer/CreateGig";
import MyGigs from "./pages/freelancer/MyGigs";
import FreelancerProfile from "./pages/freelancer/Profile";
import EditFreelancerProfile from "./pages/freelancer/EditProfile";

// Client Pages
import ClientDashboard from "./pages/client/Dashboard";
import PostJob from "./pages/client/PostJob";
import ClientProfile from "./pages/client/Profile";
import MyLikes from "./pages/client/MyLikes";
import PostedJobs from "./pages/client/PostedJobs";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

// Shared Pages
import BrowseGigs from "./pages/gigs/Browse";
import GigDetail from "./pages/gigs/Detail";
import JobDetail from "./pages/jobs/JobDetail";
import JobProposals from "./pages/jobs/JobProposals";
import ProposalSubmission from "./pages/jobs/ProposalSubmission";
import Jobs from "./pages/gigs/Browse";
import FindWork from "./pages/jobs/FindWork";
import Chat from "./pages/communication/Chat";
import Order from "./pages/orders/Order";
import SavedSearchesPage from "./pages/search/SavedSearchesPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import CalendarPage from "./pages/calendar/CalendarPage";

// Placeholder Components for missing pages
import { PlaceholderPage } from "./components/PlaceholderPage";
import { LayoutPlaceholder } from "./components/LayoutPlaceholder";

// Import new implemented pages
import OrdersList from "./pages/orders/OrdersList";
import Settings from "./pages/settings/Settings";
import Earnings from "./pages/freelancer/Earnings";
import Projects from "./pages/client/Projects";
import SavedFreelancers from "./pages/client/SavedFreelancers";
import Payments from "./pages/client/Payments";

// Admin pages
import UserManagement from "./pages/admin/UserManagement";
import GigManagement from "./pages/admin/GigManagement";
import SupportTickets from "./pages/admin/SupportTickets";
import Analytics from "./pages/admin/Analytics";
import AdminProfile from "./pages/admin/Profile";
import OrderManagement from "./pages/admin/OrderManagement";
import PaymentManagement from "./pages/admin/PaymentManagement";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Index />
                </PublicRoute>
              }
            />

            {/* Auth Routes - redirect if already authenticated */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />

            {/* Public Browse Routes */}
            <Route
              path="/browse"
              element={
                <PublicRoute>
                  <BrowseGigs />
                </PublicRoute>
              }
            />
            <Route
              path="gigs/detail/:gigId"
              element={
                <PublicRoute>
                  <GigDetail />
                </PublicRoute>
              }
            />
            <Route
              path="gigs/:gigId"
              element={
                <PublicRoute>
                  <GigDetail />
                </PublicRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <PublicRoute>
                  <Jobs />
                </PublicRoute>
              }
            />
            <Route
              path="/find-work"
              element={
                <PublicRoute>
                  <FindWork />
                </PublicRoute>
              }
            />

            {/* Freelancer Routes */}
            <Route
              path="/freelancer/*"
              element={
                <FreelancerRoute>
                  <LayoutFreelancer />
                </FreelancerRoute>
              }
            >
              <Route path="dashboard" element={<FreelancerDashboard />} />
              <Route path="create-gig" element={<CreateGig />} />
              <Route path="my-gigs" element={<MyGigs />} />
              <Route path="profile" element={<FreelancerProfile />} />
              <Route path="edit-profile" element={<EditFreelancerProfile />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="orders" element={<OrdersList />} />
              {/* Default redirect for /freelancer */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Client Routes */}
            <Route
              path="/client/*"
              element={
                <ClientRoute>
                  <LayoutClient />
                </ClientRoute>
              }
            >
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="my-likes" element={<MyLikes />} />
              <Route path="projects" element={<Projects />} />
              <Route path="saved-freelancers" element={<SavedFreelancers />} />
              <Route path="payments" element={<Payments />} />
              <Route path="posted-jobs" element={<PostedJobs />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="orders" element={<OrdersList />} />
              {/* Default redirect for /client */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <LayoutAdmin />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="gigs" element={<GigManagement />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route
                path="payments"
                element={
                  <LayoutPlaceholder
                    title="Payment Management"
                    description="Handle payments and financial operations"
                  />
                }
              />
              <Route
                path="reports"
                element={
                  <LayoutPlaceholder
                    title="Reports"
                    description="Generate and view platform reports"
                  />
                }
              />
              <Route path="analytics" element={<Analytics />} />
              <Route path="support" element={<SupportTickets />} />
              <Route
                path="moderation"
                element={
                  <LayoutPlaceholder
                    title="Content Moderation"
                    description="Review flagged content and users"
                  />
                }
              />
              <Route
                path="disputes"
                element={
                  <LayoutPlaceholder
                    title="Dispute Resolution"
                    description="Resolve conflicts between users"
                  />
                }
              />
              <Route
                path="security"
                element={
                  <LayoutPlaceholder
                    title="Security Center"
                    description="Monitor security events and threats"
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <LayoutPlaceholder
                    title="System Settings"
                    description="Configure platform settings"
                  />
                }
              />
              <Route path="profile" element={<AdminProfile />} />
            </Route>



            {/* Routes accessible by both freelancers and clients */}
            <Route path="/messages" element={<Chat />} />
            <Route path="/messages/:username" element={<Chat />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/job/:id" element={<JobDetail />} />
            <Route path="/job/:id/proposals" element={<JobProposals />} />
<Route path="/proposal-submission/:id" element={<ProposalSubmission />} />
            <Route path="/saved-searches" element={<SavedSearchesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />

            {/* Dynamic freelancer profile routes */}
            <Route path="/freelancer/:userId" element={<FreelancerProfile />} />

            {/* Settings route (accessible by all authenticated users) */}
            <Route path="/settings" element={<Settings />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
