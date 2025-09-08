import { TopBar } from "../components/TopBar";
import { Link } from "wouter";

export default function Warranty() {
  return (
    <div className="phone-frame">
      <div className="phone-notch"></div>
      <div className="phone-screen">
        <div className="phone-content">
          <TopBar />
          
          <div className="pt-20 px-4 py-8 max-w-4xl mx-auto">
            {/* Botón regresar */}
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <i className="fas fa-arrow-left"></i>
                <span>Regresar al catálogo</span>
              </Link>
            </div>
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h1 className="text-2xl font-bold text-primary mb-6">Política de Garantía</h1>
              
              <div className="prose prose-sm max-w-none text-card-foreground">
                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Cobertura de Garantía</h2>
                <p className="mb-4">
                  En FULLTECH ofrecemos garantía completa en todos nuestros productos tecnológicos por un período de 12 meses 
                  a partir de la fecha de compra.
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">¿Qué Cubre Nuestra Garantía?</h2>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Defectos de fabricación</li>
                  <li>Fallas de hardware no causadas por uso indebido</li>
                  <li>Problemas de software preinstalado</li>
                  <li>Componentes defectuosos</li>
                  <li>Mal funcionamiento sin daños físicos evidentes</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">¿Qué NO Cubre?</h2>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Daños por agua o líquidos</li>
                  <li>Daños físicos por caídas o golpes</li>
                  <li>Uso indebido o negligencia</li>
                  <li>Modificaciones no autorizadas</li>
                  <li>Desgaste normal por uso</li>
                  <li>Daños por virus o software malicioso</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Proceso de Garantía</h2>
                <ol className="list-decimal list-inside mb-4 space-y-2">
                  <li>Contacta nuestro servicio técnico</li>
                  <li>Proporciona número de factura y descripción del problema</li>
                  <li>Evaluación técnica gratuita</li>
                  <li>Reparación o reemplazo según corresponda</li>
                  <li>Devolución del producto en perfecto estado</li>
                </ol>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Contacto para Garantías</h2>
                <p className="mb-2">📧 Email: garantias@fulltech.com</p>
                <p className="mb-2">📱 WhatsApp: +1 (555) 123-4567</p>
                <p className="mb-4">🕒 Horario: Lunes a Viernes 9:00 AM - 6:00 PM</p>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Importante:</strong> Conserva tu factura de compra. Es requerida para hacer válida la garantía.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}