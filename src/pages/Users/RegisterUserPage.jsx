// src/pages/Users/RegisterUserPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../../services/UserService.js";
import styles from "./RegisterUserPage.module.css";

export default function RegisterUserPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [profile, setProfile] = useState("Administrador do Sistema");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mapeamento mínimo name -> idProfile (ajuste se seus IDs mudarem)
    const profileNameToId = {
        "Administrador do Sistema": 1,
        "Gestor de TI": 2,
        "Analista de Suporte de TI": 3,
        "Usuário Operacional": 4,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirmPassword) {
            setError("As senhas não conferem.");
            return;
        }
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        const payload = {
            name,
            jobTitle: profile, // aqui você está usando o "nome amigável" como jobTitle
            email,
            dominio: null, // opcional
            password,
            idProfile: profileNameToId[profile],
            ativo: true,
        };

        try {
            setLoading(true);
            await createUser(payload);

            setSuccess("Usuário cadastrado com sucesso.");
            // NÃO redireciona automaticamente (ADMIN decide nos botões)
        } catch (err) {
            console.error(err);
            const msg =
                err?.response?.data?.message || // axios (ApiError do backend)
                err?.message ||
                "Não foi possível cadastrar o usuário.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // Navegação pós-sucesso (ADMIN escolhe)
    const handleGoUsers = () => navigate("/users", { replace: true });
    const handleGoLogin = () => navigate("/login", { replace: true });
    const handleGoPublicHome = () => navigate("/", { replace: true });

    // Cadastrar outro sem sair da tela
    const handleNewRegister = () => {
        setName("");
        setEmail("");
        setProfile("Administrador do Sistema");
        setPassword("");
        setConfirmPassword("");
        setError(null);
        setSuccess(null);
    };

    const locked = Boolean(success);

    return (
        <div className={styles.wrap}>
            <div className={styles.card} role="dialog" aria-labelledby="register-title">
                <div className={styles.header}>
                    <div className={styles.logo} aria-hidden>
                        ATIVOS
                    </div>
                    <h1 id="register-title" className={styles.title}>
                        Cadastrar novo usuário
                    </h1>
                    <p className={styles.subtitle}>
                        Preencha os dados abaixo para criar um novo acesso.
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Nome
                        <input
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ex.: Ana Paula Souza"
                            disabled={locked}
                        />
                    </label>

                    <label className={styles.label}>
                        E-mail
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="ex.: ana.souza@empresa.com"
                            disabled={locked}
                        />
                    </label>

                    <label className={styles.label}>
                        Perfil
                        <select
                            className={styles.input}
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                            required
                            disabled={locked}
                        >
                            <option>Administrador do Sistema</option>
                            <option>Gestor de TI</option>
                            <option>Analista de Suporte de TI</option>
                            <option>Usuário Operacional</option>
                        </select>
                    </label>

                    <label className={styles.label}>
                        Senha
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="mínimo 6 caracteres"
                            disabled={locked}
                        />
                    </label>

                    <label className={styles.label}>
                        Confirmar senha
                        <input
                            type="password"
                            className={styles.input}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={locked}
                        />
                    </label>

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}

                    <div className={styles.actions}>
                        {!success ? (
                            <>
                                <button className={styles.btnPrimary} type="submit" disabled={loading}>
                                    {loading ? "Salvando..." : "Cadastrar"}
                                </button>

                                <Link className={styles.btnSecondary} to="/users">
                                    Voltar para Usuários
                                </Link>
                            </>
                        ) : (
                            <>
                                <button className={styles.btnPrimary} type="button" onClick={handleGoUsers}>
                                    Ir para Usuários
                                </button>

                                <button className={styles.btnSecondary} type="button" onClick={handleGoLogin}>
                                    Ir para Login
                                </button>

                                <button className={styles.btnSecondary} type="button" onClick={handleGoPublicHome}>
                                    Ir para área pública
                                </button>

                                <button className={styles.btnSecondary} type="button" onClick={handleNewRegister}>
                                    Cadastrar outro
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
