// src/constants/status.js

/**
 * Labels amigáveis (UI) para os valores técnicos (ENUM).
 * Regra: o backend/MySQL recebe SEMPRE o "value" (técnico).
 * A tela mostra SEMPRE o "label" (amigável).
 */
export const STATUS_LABELS = Object.freeze({
    EM_USO: "Em uso",
    EM_MANUTENCAO: "Em manutenção",
    EM_ESTOQUE: "Em estoque",
    DESCARTADO: "Baixado/Descartado",
    RESERVADO: "Reservado",
    EM_GARANTIA: "Em garantia",
    AGUARDANDO_DESCARTE: "Aguardando descarte",
    PERDIDO_OU_ROUBADO: "Perdido ou roubado",
});

/**
 * Lista oficial (técnica) de valores aceitos.
 * Use esta lista para:
 * - montar <option>
 * - validar PropTypes
 * - garantir que só sai ENUM correto no payload (PUT/POST)
 *
 * Obs: mantive uma ordem “boa de UX”.
 */
export const STATUS_VALUES = Object.freeze([
    "EM_USO",
    "EM_MANUTENCAO",
    "EM_ESTOQUE",
    "RESERVADO",
    "EM_GARANTIA",
    "AGUARDANDO_DESCARTE",
    "DESCARTADO",
    "PERDIDO_OU_ROUBADO",
]);

/**
 * Conveniência: lista pronta para selects (value/label).
 */
export const STATUS_OPTIONS = Object.freeze(
    STATUS_VALUES.map((value) => ({
        value,
        label: STATUS_LABELS[value] ?? value,
    }))
);

/**
 * Helper para exibir label (sem quebrar se vier algo inesperado).
 */
export function getStatusLabel(status) {
    return STATUS_LABELS[status] ?? status ?? "—";
}
