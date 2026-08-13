import './globals.css';

export const metadata = {
  title: 'Multicotizador Naviero | Almar Rosario (DCSA API)',
  description: 'Comparador de fletes marítimos, tiempos de tránsito e itinerarios en tiempo real para Maersk, CMA CGM, Hapag-Lloyd y MSC.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
