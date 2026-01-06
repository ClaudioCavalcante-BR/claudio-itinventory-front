import { FaLinkedin, FaGlobe } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer">
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px" }}>
                <div style={{
                    display: "flex",
                    gap: "18px",
                    alignItems: "center" }}>
                    <a
                        href="https://portfolio-react-omega-vert.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px" }}
                    >
                        <FaGlobe size={17} color="#dbe1e9" />
                        <span>Portfólio</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/claudio-cavalcante-almeida"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#0077b5",
                            color: "#fff",
                            padding: "1px 6px",
                            borderRadius: "6px",
                            fontWeight: 500,
                            textDecoration: "none",
                            transition: "all 0.25s ease",
                        }}
                    >
                        <FaLinkedin size={17} color="#fff" />
                        <span>Claudio Cavalcante</span>
                    </a>
                </div>

                <div>
                    © {new Date().getFullYear()} Claudio Cavalcante —{" "}
                    <a href="https://github.com/ClaudioCavalcante-BR" target="_blank" rel="noreferrer">
                        GitHub
                    </a>{" "}
                    • Desenvolvido com React + Vite.
                </div>
            </div>
        </footer>
    );
}
