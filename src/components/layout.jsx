import "../globals.css";
import { ThemeProvider } from "./theme-provider";
import Header from "./header";
import { Toaster } from "sonner";
import "react-day-picker/dist/style.css";

export default function Layout({ children }) {
  return (
      <div className="animated-dotted-background font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Header />
          <main className="min-h-screen m-6">{children}</main>
          <Toaster richColors />
          <footer className="bg-gray-900 py-12">
            <div className="container mx-auto px-4 text-center text-gray-200">
              <p>Build with Code, Care and Caeffine 🍵</p>
            </div>
          </footer>
        </ThemeProvider>
      </div>
  );
}
