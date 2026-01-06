// src/pages/Auth/RegisterUserPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../services/api";               // usa o interceptor com token
import { createUser } from "../../services/UserService.js";

import styles from "./LoginPage.module.css";

export default function RegisterUserPage() {
    const navigate = useNavigate();

    // Lista de perfis vindos do backend: [{id, name}]
    const [profiles, setProfiles] = useState([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    const [form, setForm] = useState({
        name: "",
        email: "",
        dominio: "",
        password: "",
        idProfile: "",     // será preenchido após carregar profiles
        jobTitle: "",      // vamos sincronizar com o name do profile selecionado
        ativo: true,
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1) Carregar perfis (ADMIN) para preencher o select
    useEffect(() => {
        let alive = true;

        async function loadProfiles() {
            try {
                setLoadingProfiles(true);
                const { data } = await api.get("/api/profiles"); // ✅ Bearer vai no interceptor
                if (!alive) return;

                setProfiles(Array.isArray(data) ? data : []);

                // Define um default coerente (primeiro perfil da lista)
                if (Array.isArray(data) && data.length > 0) {
                    const first = data[0];
                    setForm((prev) => ({
                        ...prev,
                        idProfile: String(first.id),
                        jobTitle: first.name, // simples: jobTitle = nome amigável do perfil
                    }));
                }
            } catch (e) {
                if (!alive) return;
                setError("Não foi possível carregar os perfis. Verifique seu login/token (ADMIN).");
            } finally {
                if (alive) setLoadingProfiles(false);
            }
        }

        loadProfiles();
        return () => {
            alive = false;
        };
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;

        // Se mudou o perfil, sincroniza jobTitle com o name do profile
        if (name === "idProfile") {
            const selected = profiles.find((p) => String(p.id) === String(value));
            setForm((prev) => ({
                ...prev,
                idProfile: value,
                jobTitle: selected ? selected.name : prev.jobTitle,
            }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validação mínima
        if (!form.idProfile) {
            setError("Selecione um perfil (idProfile).");
            return;
        }

        try {
            setLoading(true);

            await createUser({
                name: form.name,
                jobTitle: form.jobTitle,                 // obrigatório no seu DTO
                email: form.email,
                dominio: form.dominio?.trim() || null,   // opcional
                password: form.password,
                idProfile: Number(form.idProfile),       // Long
                ativo: true,                             // simples e consistente
            });

            setSuccess("Usuário cadastrado com sucesso.");
            setTimeout(() => navigate("/users", { replace: true }), 900); // ou /login se preferir
        } catch (err) {
            console.error(err);
            setError(err?.message || "Erro ao cadastrar usuário.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo} aria-hidden>
                        ATIVOS
                    </div>
                    <h1 className={styles.title}>Cadastrar Usuário</h1>
                    <p className={styles.subtitle}>
                        Apenas ADMIN pode cadastrar novos usuários.
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label}>
                        Nome
                        <input
                            type="text"
                            name="name"
                            className={styles.input}
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className={styles.label}>
                        E-mail
                        <input
                            type="email"
                            name="email"
                            className={styles.input}
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className={styles.label}>
                        Domínio (opcional)
                        <input
                            type="text"
                            name="dominio"
                            className={styles.input}
                            value={form.dominio}
                            onChange={handleChange}
                            placeholder="ex.: URL do avatar ou domínio interno"
                        />
                    </label>

                    <label className={styles.label}>
                        Senha
                        <input
                            type="password"
                            name="password"
                            className={styles.input}
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label className={styles.label}>
                        Perfil
                        <select
                            name="idProfile"
                            className={styles.input}
                            value={form.idProfile}
                            onChange={handleChange}
                            disabled={loadingProfiles}
                            required
                        >
                            {loadingProfiles ? (
                                <option value="">Carregando perfis...</option>
                            ) : (
                                profiles.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </label>

                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>{success}</p>}

                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} type="submit" disabled={loading || loadingProfiles}>
                            {loading ? "Salvando..." : "Cadastrar"}
                        </button>

                        <Link to="/users" className={styles.btnSecondary}>
                            Voltar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
