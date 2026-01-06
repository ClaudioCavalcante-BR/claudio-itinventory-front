// src/components/UI/Card.jsx
import PropTypes from "prop-types";

export default function Card({ title, children, footer }) {
    return (
        <section className="panel card">
            {title && (
                <header className="card-header">
                    <h2>{title}</h2>
                </header>
            )}

            <div className="card-body">{children}</div>

            {footer && <footer className="card-footer">{footer}</footer>}
        </section>
    );
}

Card.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.node,
    footer: PropTypes.node,
};
