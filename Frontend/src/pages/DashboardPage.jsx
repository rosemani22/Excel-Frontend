import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import Dashboard from "../DashboardComponents/Dashboard"


const DashboardPage = () => {
	const { user, logout } = useAuthStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		setTimeout(() => navigate("/"), 100); // Optional slight delay 
	};
	return (
		<>
		<Dashboard />
		<button
			onClick={handleLogout}
			className='w-25 absolute py-3 px-4 top-4 right-10 bg-gradient-to-r from-blue-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
		>
			Logout
		</button>
		</>

	);
};
export default DashboardPage;
