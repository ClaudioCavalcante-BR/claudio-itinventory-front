// src/pages/Users/userListUtils.js

export function unwrapList(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
}

export function normalizeUser(u) {
    const id =
        u?.id ??
        u?.idUser ??
        u?.id_user ??
        u?.idUsuario ??
        u?.id_usuario ??
        u?.userId ??
        null;

    const userAtivo = u?.userAtivo ?? u?.ativo ?? u?.active ?? u?.isActive ?? false;

    const jobTitle = u?.jobTitle ?? u?.job_title ?? u?.cargo ?? u?.jobtitle ?? "";

    const idProfile =
        u?.idProfile ??
        u?.id_profile ??
        u?.profileId ??
        u?.profile?.idProfile ??
        u?.profile?.id_profile ??
        null;

    const rawProfile = u?.profile; // pode ser objeto OU string ("ADMIN", etc.)
    const profileCode = (
        u?.profileCode ??
        u?.profile_code ??
        u?.profile?.code ??
        u?.profile?.profileCode ??
        (typeof rawProfile === "string" ? rawProfile : "") ??
        ""
    ).toString();

    const profileCodeNormalized = String(profileCode || "").toUpperCase();

    const profileName =
        u?.profileName ??
        u?.profile_name ??
        u?.profile?.name ??
        u?.profile?.label ??
        u?.profile?.descricao ??
        "";

    return {
        ...u,
        id,
        ativo: Boolean(userAtivo),
        name: u?.name ?? u?.nome ?? "",
        email: u?.email ?? "",
        jobTitle,
        idProfile: idProfile != null ? Number(idProfile) : null,
        profileCode: profileCodeNormalized,
        profileName,
    };
}

export function normalizeProfile(p) {
    // backend: { idProfile, code, name, descricao, nivelAcesso, ativo }
    const idProfile = p?.idProfile ?? p?.id_profile ?? p?.id ?? null;
    const code = (p?.code ?? p?.profileCode ?? p?.codigo ?? "").toString().toUpperCase();
    const name = p?.name ?? p?.descricao ?? p?.label ?? "";

    return { ...p, idProfile: idProfile != null ? Number(idProfile) : null, code, name };
}

export function buildProfileMaps(profiles) {
    const byCode = new Map();
    const byId = new Map();

    for (const p of profiles || []) {
        if (p?.code) byCode.set(String(p.code).toUpperCase(), p);
        if (p?.idProfile != null) byId.set(Number(p.idProfile), p);
    }

    return { profileByCode: byCode, profileById: byId };
}

export function getProfileCodeForRow(row, { profiles, profileById }) {
    if (row?.profileCode) return String(row.profileCode).toUpperCase();

    if (row?.idProfile != null) {
        const p = profileById.get(Number(row.idProfile));
        if (p?.code) return String(p.code).toUpperCase();
    }

    if (row?.profileName) {
        const label = String(row.profileName).toLowerCase().trim();
        const found = (profiles || []).find(
            (p) => String(p?.name ?? "").toLowerCase().trim() === label
        );
        if (found?.code) return String(found.code).toUpperCase();
    }

    return "";
}

export function getStatusLabel(row) {
    return row?.ativo ? "Ativo" : "Inativo";
}

export function resolveProfileCodeAndId(row, { profiles, profileById, profileByCode }) {
    const code = getProfileCodeForRow(row, { profiles, profileById });

    let idProfile = row?.idProfile != null ? Number(row.idProfile) : null;

    if (!idProfile && code && profileByCode.has(code)) {
        const p = profileByCode.get(code);
        if (p?.idProfile != null) idProfile = Number(p.idProfile);
    }

    return { code, idProfile };
}
