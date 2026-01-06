// src/forms/AssetItem.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { STATUS_LABELS, STATUS_VALUES } from "../constants/status";

const EQUIPMENT_TYPES = [
    { value: "NOTEBOOK", label: "Notebook" },
    { value: "DESKTOP", label: "Desktop" },
    { value: "SERVIDOR", label: "Servidor" },
    { value: "MONITOR", label: "Monitor" },
    { value: "IMPRESSORA", label: "Impressora" },
    { value: "ROTEADOR", label: "Roteador" },
    { value: "SWITCH", label: "Switch" },
    { value: "SMARTPHONE", label: "Smartphone" },
];

const TYPE_LABELS = Object.fromEntries(
    EQUIPMENT_TYPES.map((t) => [t.value, t.label])
);

export default function AssetItem({ asset, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(asset);

    // Mantém o form sincronizado quando a linha (asset) muda
    useEffect(() => {
        setForm(asset);
    }, [asset]);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // No backend: acquisitionValue
    const costValue = asset.acquisitionValue ?? asset.cost ?? 0;
    const formattedCost = `R$ ${Number(costValue || 0).toLocaleString("pt-BR")}`;

    const getStatusLabel = (status) => STATUS_LABELS[status] ?? status ?? "—";

    const save = () => {
        const value = Number(form.acquisitionValue ?? costValue ?? 0);

        // Payload EXATO do DTO (sem espalhar ...form)
        const payload = {
            type: form.type ?? asset.type,
            brand: String(form.brand ?? asset.brand ?? "").trim(),
            model: String(form.model ?? asset.model ?? "").trim(),
            assetNumber: String(form.assetNumber ?? asset.assetNumber ?? "").trim(),
            status: form.status ?? asset.status,
            location: String(form.location ?? asset.location ?? "").trim(),
            responsible: String(form.responsible ?? asset.responsible ?? "").trim(),
            acquisitionDate: form.acquisitionDate ?? asset.acquisitionDate,
            acquisitionValue: value,
        };

        // Validações mínimas (evitam 500 por payload inválido/incompleto)
        if (!payload.type) {
            alert("Selecione uma categoria (tipo) válida.");
            return;
        }
        if (!payload.status) {
            alert("Selecione um status válido.");
            return;
        }
        if (
            !payload.brand ||
            !payload.model ||
            !payload.assetNumber ||
            !payload.location ||
            !payload.responsible
        ) {
            alert("Preencha todos os campos obrigatórios antes de salvar.");
            return;
        }
        if (!payload.acquisitionDate) {
            alert("Informe a data de aquisição (campo obrigatório).");
            return;
        }
        if (!Number.isFinite(payload.acquisitionValue) || payload.acquisitionValue <= 0) {
            alert("Informe um custo de aquisição maior que zero.");
            return;
        }

        onUpdate(asset.id, payload);
        setIsEditing(false);
    };

    if (!isEditing) {
        const statusKey = asset.status || "";
        const statusClass = statusKey.toLowerCase(); // EM_ESTOQUE -> em_estoque

        return (
            <tr>
                <td>{asset.assetNumber}</td>
                <td>{asset.model}</td>
                <td>{TYPE_LABELS[asset.type] ?? asset.type}</td>
                <td>{asset.location}</td>
                <td>{formattedCost}</td>
                <td>
          <span className={`status ${statusClass}`}>
            {getStatusLabel(statusKey)}
          </span>
                </td>
                <td className="actions">
                    <button className="panel" onClick={() => setIsEditing(true)}>
                        Alterar
                    </button>
                    <button className="panel danger" onClick={() => onDelete(asset.id)}>
                        Excluir
                    </button>
                </td>
            </tr>
        );
    }

    return (
        <tr>
            <td>
                <input
                    name="assetNumber"
                    value={form.assetNumber || ""}
                    onChange={handleChange}
                />
            </td>

            <td>
                <input
                    name="model"
                    value={form.model || ""}
                    onChange={handleChange}
                />
            </td>

            <td>
                <select name="type" value={form.type || ""} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    {EQUIPMENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </td>

            <td>
                <input
                    name="location"
                    value={form.location || ""}
                    onChange={handleChange}
                />
            </td>

            <td>
                <input
                    name="acquisitionValue"
                    type="number"
                    value={form.acquisitionValue ?? costValue ?? 0}
                    onChange={handleChange}
                />
            </td>

            <td>
                <select name="status" value={form.status || "EM_USO"} onChange={handleChange}>
                    {STATUS_VALUES.map((value) => (
                        <option key={value} value={value}>
                            {STATUS_LABELS[value] ?? value}
                        </option>
                    ))}
                </select>
            </td>

            <td className="actions">
                <button className="panel" onClick={save} style={{ borderColor: "var(--accent)" }}>
                    Salvar
                </button>
                <button className="panel" onClick={() => setIsEditing(false)}>
                    Cancelar
                </button>
            </td>
        </tr>
    );
}

AssetItem.propTypes = {
    asset: PropTypes.shape({
        id: PropTypes.number.isRequired,
        assetNumber: PropTypes.string,
        model: PropTypes.string,
        type: PropTypes.string,
        brand: PropTypes.string,
        status: PropTypes.oneOf(STATUS_VALUES),
        location: PropTypes.string,
        responsible: PropTypes.string,
        acquisitionDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        acquisitionValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        cost: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
