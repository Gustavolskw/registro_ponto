// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login.jsx";
import NotFound from "../pages/NotFound";
import FuncionarioCadastro from "../pages/FuncionarioCadastro";
import NewUserFirstLogin from "../pages/newUserFirstLogin.jsx";
import RelatorioGeral from "../pages/RelatorioGeral.jsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro/funcionario" element={<FuncionarioCadastro />} />
            <Route path="/cadastro/new/user/password" element={<NewUserFirstLogin />} />
            <Route path="/relatorios/geral" element={<RelatorioGeral />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
