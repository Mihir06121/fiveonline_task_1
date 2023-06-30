import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import RegistrationForm from "./components/RegistrationForm"
import NoMatch from './components/NoMatch';

function App() {
  return (
    <Routes>
      <Route index element={<RegistrationForm/>} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
