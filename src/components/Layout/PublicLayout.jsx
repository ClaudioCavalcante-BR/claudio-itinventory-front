import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <div className="app__wrap">
            <Outlet />
        </div>
    );
}
