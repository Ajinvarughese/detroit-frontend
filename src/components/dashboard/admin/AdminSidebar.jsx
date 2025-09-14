import { Cog8ToothIcon, HomeIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { Link, useLocation, useNavigate } from "react-router";
import { Feedback } from "@mui/icons-material";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const linkClass = (path) =>
    `flex items-center gap-2 p-3 rounded-md hover:bg-blue-800 transition ${
      location.pathname === path ? 'bg-blue-700' : ''
    }`;

  return (
    <aside className="fixed w-64 bg-blue-900 text-white h-screen p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link to="/admin" className={linkClass('/admin/dashboard')}>
          <HomeIcon className="h-5 w-5" />
          Dashboard
        </Link>
        <Link to="/admin/rules" className={linkClass('/admin/rules')}>
          <PencilSquareIcon className="h-5 w-5" />
          Rule Editor
        </Link>
        <Link to="/admin/feedbacks" className={linkClass('/admin/feedbacks')}>
          <Feedback className="h-5 w-5" />
          Feedbacks
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;