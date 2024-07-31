import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserManager from './components/user-manager';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div>
      <ToastContainer />
        <Routes>
          <Route path="/manage-users" element={<UserManager />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
