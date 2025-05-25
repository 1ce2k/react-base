"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const router = useRouter();
  const { logout } = useAuth();
  const { user, clearUser } = useUser();

  const handleLogout = async () => {
    logout();
    clearUser();
    router.push("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3 d-flex align-items-center">
      <div className="container">
        {/* Left side navigation */}
        <div className="d-flex align-items-center">
          <Link href="/" className="navbar-brand">Home</Link>
          <Link href="/page1" className="nav-link px-2">Page1</Link>
          <Link href="/page2" className="nav-link px-2">Page2</Link>
        </div>

        {/* Right side user menu */}
        <div className="ms-auto d-flex align-items-center gap-2">
          {user ? (
            <div className="d-flex align-items-center">
              <Link href="/profile" className="btn btn-outline-secondary me-2">{user.firstName} {user.lastName}</Link>
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <Link href="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link href="/register" className="btn btn-outline-success">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
