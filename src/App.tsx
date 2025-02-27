import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import UseCases from './pages/UseCases';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import MyAIAssistant from './pages/MyAIAssistant';
import CreateAssistant from './pages/assistant/CreateAssistant';
import ManageAssistant from './pages/assistant/ManageAssistant';
import CallLogs from './pages/assistant/CallLogs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/my-assistant" element={<MyAIAssistant />}>
            <Route index element={<Navigate to="create" replace />} />
            <Route path="create" element={<CreateAssistant />} />
            <Route path="manage" element={<ManageAssistant />} />
            <Route path="calls" element={<CallLogs />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;