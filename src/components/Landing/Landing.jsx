// src/components/Landing/Landing.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";
import { FaCheck } from "react-icons/fa";
import bgLanding from "../../assets/images/bg-landing.jpg";

export default function Landing() {
    const [now, setNow] = useState(new Date());
    const navigate = useNavigate();

    function handleEnter() {
        localStorage.setItem("itinventory_equip.welcome_seen", "true"); // opcional
        navigate("/login");
    }

    useEffect(() => {
        const img = new Image();
        img.src = bgLanding;
    }, []);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const timeBrasilia = now.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const dateBrasilia = now.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className={styles.wrap} style={{ backgroundImage: `url(${bgLanding})` }}>
            <div className={styles.overlay} />

            <div className={styles.card}>
                <h1>Controller Inventory</h1>
                <p className={styles.subtitle}>Inventário de equipamentos de TI</p>

                <div className={styles.text}>
                    <p>
                        O <strong>Controller-Inventory</strong> é um painel focado em
                        <em> controle de ativos de tecnologia</em> para empresas de pequeno,
                        médio e grande porte. A proposta é oferecer uma visão clara do
                        parque de TI — notebooks, desktops, monitores, servidores,
                        roteadores e demais dispositivos críticos para a operação.
                    </p>

                    <p>
                        A aplicação foi pensada para apoiar tanto o time de{" "}
                        <strong>Controladoria</strong> quanto a área de{" "}
                        <strong>Infraestrutura de TI</strong>, permitindo acompanhar o
                        ciclo de vida dos equipamentos: aquisição, alocação por unidade,
                        movimentações internas, manutenção e desativação.
                    </p>

                    <p>
                        O design prioriza <strong>usabilidade</strong>,{" "}
                        <strong>organização das informações</strong> e{" "}
                        <strong>rapidez na consulta</strong>. Cada tela foi planejada para
                        reduzir a curva de aprendizado e facilitar o trabalho diário de quem
                        precisa tomar decisões com base em dados confiáveis.
                    </p>
                </div>

                <ul className={styles.badges}>
                    <li>
                        <FaCheck className={styles.badgeIcon} />
                        Cadastro e rastreio de equipamentos
                    </li>
                    <li>
                        <FaCheck className={styles.badgeIcon} />
                        Filtros por unidade, setor e status
                    </li>
                    <li>
                        <FaCheck className={styles.badgeIcon} />
                        Visão pronta para Controladoria e TI
                    </li>
                    <li>
                        <FaCheck className={styles.badgeIcon} />
                        Layout responsivo para diferentes telas
                    </li>
                </ul>

                <button className={styles.button} onClick={handleEnter}>
                    Acessar o sistema
                </button>

                <p className={styles.note}>
                    *Para reexibir este painel de boas-vindas, limpe o{" "}
                    <code>localStorage.clear()</code>, se necessário.
                </p>
            </div>

            <div className={styles.clockStandalone}>
                <div className={styles.infoBox}>
          <span className={styles.flag} role="img" aria-label="Bandeira do Brasil">
            🇧🇷
          </span>
                    <div className={styles.clockText}>
                        <span className={styles.clockLabel}>Data em Brasília</span>
                        <span className={styles.clockValue}>{dateBrasilia}</span>
                    </div>
                </div>

                <div className={styles.infoBox}>
          <span className={styles.flag} role="img" aria-label="Bandeira do Brasil">
            🇧🇷
          </span>
                    <div className={styles.clockText}>
                        <span className={styles.clockLabel}>Horário de Brasília</span>
                        <span className={styles.clockValue}>{timeBrasilia}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
