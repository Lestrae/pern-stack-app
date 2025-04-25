import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import { useState } from "react";
import { Route, Routes } from 'react-router-dom';
import { useThemeStore } from "./store/useThemeStore";
import { Toaster } from "react-hot-toast";
function App() {
  const [search, setSearch] = useState('');
  const { theme } = useThemeStore();
  return (
    <div className = 'min-h-screen bg-base-100 transition-colors duration-300' data-theme= {theme}>

      <Navbar search={search} setSearch={setSearch} />

      <Routes>
        <Route path="/" element={<HomePage search={search} />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>

      <Toaster /> 
    </div>   
)};
export default App
