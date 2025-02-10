import Providers from "../components/Providers";
import Navbar from "../components/Navbar"; // Import Navbar
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main> {/* Add padding for navbar */}
        </Providers>
      </body>
    </html>
  );
}
