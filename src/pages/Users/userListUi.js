// src/pages/Users/userListUi.js

// Impede o DataGrid de capturar teclas durante a edição (ex.: BARRA DE ESPAÇO)
export const stopGridKeyDown = (e) => {
    e.stopPropagation();
};

export const actionsWrap = {
    display: "flex",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    width: "100%",
    marginTop: 0,
    paddingTop: 0,
};

export const inputStyle = {
    width: "100%",
    height: 32,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,.28)",
    background: "rgba(0,0,0,.15)",
    color: "inherit",
    padding: "0 10px",
    outline: "none",
};

export const selectStyle = { ...inputStyle, paddingRight: 30 };

// Mesmo “formato” do botão Novo Usuário (mantendo classes existentes)
export const actionBtnStyle = {
    padding: "6px 12px",
    lineHeight: 1,
    fontSize: 12,
    whiteSpace: "nowrap",
};
