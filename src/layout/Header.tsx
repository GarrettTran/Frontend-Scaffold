import { useAuthStore } from "@/stores/authStore"
import { useNavigate } from "react-router-dom";
export function Header() {
    const navigate = useNavigate();
    const {
        isAuthenticated,
        user,
        signOut
    } = useAuthStore();

    const handleLogout = () => {
        signOut();
        navigate('/auth');
    };
    return (
        <>
            <p>This is a Header</p>
            <p>This user is Authenticated?: {isAuthenticated ? "true" : "false"}</p>
            {user && (
                <>
                    <p>id: {user.id}</p>
                    <p>name: {user.name}</p>
                    <p>address: {user.address}</p>
                </>
            )}

            <div
                onClick={() => {
                    handleLogout();
                }}
                className="block py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
            >
                Logout
            </div>
        </>
    )
}