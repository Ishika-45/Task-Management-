import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/layout'; 
import SignInPage from './pages/Sign-In.jsx';
import SignUpPage from './pages/Sign-Up.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Organization from './pages/Organization.jsx';
import NotFound from './not-found.jsx';
import ProjectLayout from './pages/Project.jsx';
import CreateProject from './pages/Create.jsx';

function App() {
  return (
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/organization/:orgId" element={<Organization />} />
          <Route path="/project/:projectId" element={<ProjectLayout />} />
          <Route path="/project/create" element={<CreateProject />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </Layout>
  );
}

export default App;
