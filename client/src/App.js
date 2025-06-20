import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calendrier from "./components/Calendrier";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./store";

const App = () => {
    return (
        <Provider store={store}>
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Calendrier />} />
                        <Route path='/calendar' element={<Calendrier />} />
                    </Routes>
                </BrowserRouter>
                <ToastContainer />
            </div>
        </Provider>
    );
};

export default App;