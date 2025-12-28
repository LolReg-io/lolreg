import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Contribute from './pages/Contribute';
import RegistryTree from './pages/RegistryTree';

function App() {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tree" element={<RegistryTree />} />
                    <Route path="/contribute" element={<Contribute />} />
                    <Route path="/key/:id" element={<Detail />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
