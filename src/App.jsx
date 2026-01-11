import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ThemeToggle from './components/ThemeToggle';


function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen theme-bg-primary">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
          <PWAInstallPrompt />
          <ThemeToggle />
        </div>
      </Router>
    </ThemeProvider>
  );
}


export default App;
