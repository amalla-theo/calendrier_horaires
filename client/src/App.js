import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Calendrier from "./components/Calendrier";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Composant principal de l'application gérant les routes
const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>

                    <Route path='/' element={<Calendrier />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Signup />} />
                    <Route path='/calendar' element={<Calendrier />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </div>
    );
};

export default App;