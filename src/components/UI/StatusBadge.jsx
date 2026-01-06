import PropTypes from "prop-types";

export default function StatusBadge({ status }) {
    const map = {
        ACTIVE: "Ativo",
        MAINTENANCE: "Manutenção",
        DISPOSED: "Baixado" };
    const color =
        status === "ACTIVE" ? "#4ade80" :
            status === "MAINTENANCE" ? "#facc15" : "#f87171";
    return (
        <span style={{
            padding: "2px 8px",
            borderRadius: 999,
            border: `1px solid ${color}`,
            color, fontSize: 12
        }}>
      {map[status] ?? status}
    </span>
    );
}

StatusBadge.propTypes = {
    status: PropTypes.oneOf(["ACTIVE", "MAINTENANCE", "DISPOSED"]).isRequired,
};