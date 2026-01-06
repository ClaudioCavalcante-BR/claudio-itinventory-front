/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useAuth } from "./AuthContext.jsx";
import {
    fetchEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
} from "../services/EquipmentService.js";
import {
    setItems,
    addItem,
    updateItem,
    removeItem,
} from "../store/index.js";

const AssetsActionsContext = createContext(null);

// Hook para usar as ações (CRUD + reload)
export function useAssetsActions() {
    const ctx = useContext(AssetsActionsContext);
    if (!ctx) throw new Error("useAssetsActions must be used within AssetsProvider");
    return ctx;
}

function normalizeEquipmentPayload(data) {
    const assetNumber = data.assetNumber ?? data.asset_number ?? "";
    let type = data.type ?? "";

    if (type && typeof type === "object") {
        type = type.value ?? "";
    }

    if (typeof type === "string" && type.includes("-")) {
        type = type.split("-")[0];
    }

    return {
        assetNumber,
        type,
        brand: data.brand ?? "",
        model: data.model ?? "",
        location: data.location ?? "",
        responsible: data.responsible ?? "",
        status: data.status ?? "",
        acquisitionDate: data.acquisitionDate ?? null,
        acquisitionValue: data.acquisitionValue ?? null,
    };
}

export default function AssetsProvider({ children }) {
    const { isLogged } = useAuth();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const loadAssets = useCallback(async () => {
        if (!isLogged) return;
        setLoading(true);
        try {
            const list = await fetchEquipments({ page: 0, size: 100 });
            dispatch(setItems(list));
        } catch (err) {
            console.error("Erro ao buscar equipamentos", err);
            // (mensagem global, se existir, vem do api.js)
        } finally {
            setLoading(false);
        }
    }, [isLogged, dispatch]);

    useEffect(() => {
        loadAssets();
    }, [loadAssets]);

    async function createAsset(data) {
        try {
            const created = await createEquipment(data);
            dispatch(addItem(created));
        } catch (err) {
            // mensagem já é tratada no interceptor (api.js)
            // evita Uncaught (in promise)
        }
    }

    async function updateAsset(id, data) {
        try {
            const payload = normalizeEquipmentPayload(data);
            const updated = await updateEquipment(id, payload);
            dispatch(updateItem(updated));
        } catch (err) {
            // mensagem já é tratada no interceptor (api.js)
            // evita Uncaught (in promise)
        }
    }

    async function deleteAsset(id) {
        try {
            await deleteEquipment(id);
            dispatch(removeItem(id));
        } catch (err) {
            // mensagem já é tratada no interceptor (api.js)
            // evita Uncaught (in promise)
        }
    }

    const value = {
        reload: loadAssets,
        createAsset,
        updateAsset,
        deleteAsset,
        loading,
    };

    return (
        <AssetsActionsContext.Provider value={value}>
            {children}
        </AssetsActionsContext.Provider>
    );
}

AssetsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
