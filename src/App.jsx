import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';

function App() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/key/:id" element={<Detail />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
