import { useParams } from "react-router-dom";

export default function UserEditPage() {
    const { id } = useParams();

    return (
        <div style={{ padding: 24 }}>
            <h2>Editar Usuário</h2>
            <p>ID: {id}</p>
        </div>
    );
}
