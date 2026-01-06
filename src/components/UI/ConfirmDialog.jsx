import PropTypes from "prop-types";

export default function ConfirmDialog({ open, text, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 50
        }}>
            <div className="panel" style={{
                padding: 20,
                maxWidth: 420
            }}>
                <p style={{
                    marginTop: 0
                }}>{text}</p>
                <div style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "flex-end"
                }}>
                    <button className="panel" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="panel" onClick={onConfirm} style={{ borderColor: "var(--accent)" }}>
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    text: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

ConfirmDialog.defaultProps = {
    text: "Confirmar operação?",
};