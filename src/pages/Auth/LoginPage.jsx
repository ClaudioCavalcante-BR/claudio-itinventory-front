// src/pages/Auth/LoginPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import styles from "./LoginPage.module.css";


export default function LoginPage() {
    const location = useLocation(); // 1) primeiro
    const registered = Boolean(location.state?.registered); // 2) depois que location existe
    const navigate = useNavigate();
    const { login, isLogged } = useAuth();
    const from = location.state?.from?.pathname || "/dashboard";


    useEffect(() => {
        if (isLogged) {
            navigate(from, { replace: true });
        }
    }, [isLogged, navigate, from]);



    const [email, setEmail] = useState("admin@empresa.com");
    // const [password, setPassword] = useState("123456");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setError("Usuário ou senha inválidos ou erro no servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.overlay} aria-hidden="true" />
            <div className={styles.card} role="dialog" aria-labelledby="login-title">
                <div className={styles.header}>
                    <div className={styles.logo} aria-hidden>
                        ATIVOS
                    </div>
                    <h1 id="login-title" className={styles.title}>
                        Entrar
                    </h1>
                    <p className={styles.subtitle}>
                        Acesse a área de gestão de ativos - Seja Bem-vindo
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    <label className={styles.label}>
                        E-mail
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label className={styles.label}>
                        Senha
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Digite a sua senha"
                            required
                        />
                    </label>

                    {error && <p className={styles.error}>{error}</p>}

                    <div className={styles.actions}>
                        <button
                            className={styles.btnPrimary}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar agora"}
                        </button>
                    </div>

                    {registered && (
                        <div className={styles.success}>
                            Cadastro realizado com sucesso. Faça login para acessar o sistema.
                            <button
                                type="button"
                                className={styles.btnSecondary}
                                onClick={() => navigate(location.pathname, { replace: true, state: {} })}
                            >
                                OK
                            </button>
                        </div>
                    )}



                </form>
                <p className={styles.hint}>
                    Não tem acesso? Solicite ao administrador do sistema.
                </p>
            </div>
        </div>
    );
}
