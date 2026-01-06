// src/constants/equipmentEnums.js

export const TYPE_OPTIONS = [
    { value: "NOTEBOOK", label: "Notebook" },
    { value: "DESKTOP", label: "Desktop" },
    { value: "MONITOR", label: "Monitor" },
    { value: "SERVIDOR", label: "Servidor" },
    { value: "IMPRESSORA", label: "Impressora" },
    { value: "ROTEADOR", label: "Roteador" },
    { value: "SWITCH", label: "Switch" },
    { value: "SMARTPHONE", label: "Smartphone" },
];

export const STATUS_OPTIONS = [
    { value: "EM_ESTOQUE", label: "Em estoque" },
    { value: "EM_USO", label: "Em uso" },
    { value: "RESERVADO", label: "Reservado" },
    { value: "EM_MANUTENCAO", label: "Em manutenção" },
    { value: "EM_GARANTIA", label: "Em garantia" },
    { value: "AGUARDANDO_DESCARTE", label: "Aguardando descarte" },
    { value: "DESCARTADO", label: "Descartado" },
    { value: "PERDIDO_OU_ROUBADO", label: "Perdido ou roubado" },
];

export const TYPE_LABEL = Object.fromEntries(TYPE_OPTIONS.map(o => [o.value, o.label]));
export const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map(o => [o.value, o.label]));
