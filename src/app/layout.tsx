import AppHeader from "@/components/AppHeader";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";

export const metadata = {
  title: "My App",
  description: "Simple react app with JWT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <UserProvider>
            <div className="app">
              <AppHeader />
              <main className="main-content">{children}</main>
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
