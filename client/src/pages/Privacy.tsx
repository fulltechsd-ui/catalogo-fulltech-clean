import { TopBar } from "../components/TopBar";
import { Link } from "wouter";

export default function Privacy() {
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
            <div className="bg-card rounded-xl shadow-sm border border p-6">
              <h1 className="text-2xl font-bold text-primary mb-6">Política de Privacidad</h1>
              
              <div className="prose prose-sm max-w-none text-card-foreground">
                <p className="mb-4 text-sm text-muted-foreground">
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Información que Recopilamos</h2>
                <p className="mb-4">
                  En FULLTECH respetamos tu privacidad. Recopilamos la siguiente información:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li><strong>Información Personal:</strong> Nombre, email, teléfono, dirección</li>
                  <li><strong>Información de Cuenta:</strong> Datos de Google OAuth</li>
                  <li><strong>Información de Compra:</strong> Historial de pedidos, preferencias</li>
                  <li><strong>Información Técnica:</strong> IP, dispositivo, navegador</li>
                  <li><strong>Cookies:</strong> Para mejorar la experiencia de usuario</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Cómo Usamos tu Información</h2>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Procesamiento de pedidos y envíos</li>
                  <li>Comunicación sobre productos y servicios</li>
                  <li>Soporte técnico y atención al cliente</li>
                  <li>Mejora de nuestros servicios</li>
                  <li>Programa de referidos y recompensas</li>
                  <li>Cumplimiento de obligaciones legales</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Compartir Información</h2>
                <p className="mb-4">
                  <strong>NO vendemos ni alquilamos</strong> tu información personal. Solo compartimos información con:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Proveedores de servicios de pago</li>
                  <li>Servicios de envío y logística</li>
                  <li>Servicios de soporte técnico</li>
                  <li>Autoridades legales cuando sea requerido por ley</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Seguridad de Datos</h2>
                <p className="mb-4">Implementamos medidas de seguridad avanzadas:</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Encriptación SSL/TLS</li>
                  <li>Autenticación segura con Google</li>
                  <li>Acceso restringido a datos personales</li>
                  <li>Copias de seguridad regulares</li>
                  <li>Monitoreo continuo de seguridad</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Tus Derechos</h2>
                <p className="mb-4">Tienes derecho a:</p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar eliminación de tu cuenta</li>
                  <li>Portabilidad de datos</li>
                  <li>Oposición al procesamiento</li>
                  <li>Limitar el uso de tus datos</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Cookies y Tecnologías Similares</h2>
                <p className="mb-4">
                  Utilizamos cookies para mejorar tu experiencia. Puedes configurar tu navegador para rechazar cookies, 
                  aunque esto puede afectar la funcionalidad del sitio.
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Retención de Datos</h2>
                <p className="mb-4">
                  Conservamos tu información personal durante el tiempo necesario para cumplir con los propósitos 
                  descritos en esta política, salvo que la ley requiera un período de retención más largo.
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Contacto</h2>
                <p className="mb-4">
                  Para consultas sobre privacidad:
                </p>
                <p className="mb-2">📧 Email: privacidad@fulltech.com</p>
                <p className="mb-2">📱 WhatsApp: +1 (555) 123-4567</p>
                <p className="mb-4">📍 Dirección: [Dirección de la empresa]</p>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Actualizaciones:</strong> Esta política puede actualizarse ocasionalmente. 
                    Te notificaremos sobre cambios importantes por email.
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