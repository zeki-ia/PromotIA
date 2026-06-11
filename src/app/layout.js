import "./globals.css";

export const metadata = {
  title: "PromotIA — NPS Analytics con IA para B2B",
  description: "Medí tu NPS, analizá comentarios con IA y actuá antes de perder cuentas clave.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
