// src/forms/AssetForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { STATUS_LABELS, STATUS_VALUES } from "../constants/status";

export default function AssetForm({ onCreate }) {
    const [form, setForm] = useState({
        type: "",
        brand: "",
        model: "",
        assetNumber: "",
        location: "",
        responsible: "",
        acquisitionDate: "",
        acquisitionValue: "",
        status: "EM_USO", // ajuste conforme enum do backend
        lifecycleMonths: 36,
    });

    const [flash, setFlash] = useState(null); // { type: "success"|"error", message: string }


    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // validação mínima (evita cadastro "silencioso")
        if (!form.assetNumber || !form.model || !form.type) {
            setFlash({ type: "error", message: "Preencha TAG, Nome/Modelo e Categoria." });
            setTimeout(() => setFlash(null), 3000);
            return;
        }
        //PARTE INSERIDA PARA
        const value = Number(form.acquisitionValue);

        if (!value || value <= 0) {
            setFlash({ type: "error", message: "Informe um valor de aquisição maior que zero." });
            setTimeout(() => setFlash(null), 3000);
            return;
        }


        const payload = {
            type: form.type,
            brand: form.brand,
            model: form.model,
            assetNumber: form.assetNumber,
            location: form.location,
            responsible: form.responsible,
            acquisitionDate: form.acquisitionDate,
            acquisitionValue: value,
            //acquisitionValue: Number(form.acquisitionValue) || 0,
            status: form.status,
        };

        try {
            await onCreate(payload);

            // mensagem de sucesso
            setFlash({ type: "success", message: "Ativo cadastrado com sucesso." });
            setTimeout(() => setFlash(null), 3000);

            // limpa o formulário
            setForm((prev) => ({
                ...prev,
                type: "",
                brand: "",
                model: "",
                assetNumber: "",
                location: "",
                responsible: "",
                acquisitionDate: "",
                acquisitionValue: "",
                status: "EM_USO",
            }));
        } catch (err) {
            // mensagem de erro (caso falhe)
            setFlash({ type: "error", message: "Falha ao cadastrar. Tente novamente." });
            setTimeout(() => setFlash(null), 3000);
        }

    }

    return (

        <form className="panel form-grid" onSubmit={handleSubmit}>

            {/* (banner) */}
            {flash && (
                <div className={`flash ${flash.type}`}>
                    {flash.message}
                </div>
            )}
            {/* FIM do banner */}

            <input
                name="assetNumber"
                placeholder="TAG (patrimônio)"
                value={form.assetNumber}
                onChange={handleChange}
            />
            <input
                name="model"
                placeholder="Nome / Modelo do Ativo"
                value={form.model}
                onChange={handleChange}
            />
            <input
                name="type"
                placeholder="Categoria (Notebook, Servidor...)"
                value={form.type}
                onChange={handleChange}
            />
            <input
                name="brand"
                placeholder="Marca"
                value={form.brand}
                onChange={handleChange}
            />
            <input
                name="location"
                placeholder="Localização"
                value={form.location}
                onChange={handleChange}
            />
            <input
                name="responsible"
                placeholder="Responsável"
                value={form.responsible}
                onChange={handleChange}
            />
            <input
                type="date"
                name="acquisitionDate"
                placeholder="Data de Aquisição"
                value={form.acquisitionDate}
                onChange={handleChange}
            />
            <input
                name="acquisitionValue"
                placeholder="Custo de Aquisição"
                value={form.acquisitionValue}
                onChange={handleChange}
            />

            <select
                name="status"
                value={form.status || "EM_USO"}
                onChange={handleChange}
            >
                {STATUS_VALUES.map((value) => (
                    <option key={value} value={value}>
                        {STATUS_LABELS[value]}
                    </option>
                ))}
            </select>

            <button type="submit" className="btn-primary">
                Salvar
            </button>

        </form>
    );
}

AssetForm.propTypes = {
    onCreate: PropTypes.func.isRequired,
};
