import { TopBar } from "../components/TopBar";
import { Link } from "wouter";

export default function About() {
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
              <h1 className="text-2xl font-bold text-primary mb-6">Sobre FULLTECH</h1>
              
              <div className="prose prose-sm max-w-none text-card-foreground">
                <div className="text-center mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200" 
                    alt="FULLTECH Logo" 
                    className="w-24 h-24 object-contain mx-auto mb-4 rounded-full"
                  />
                  <p className="text-lg text-primary font-semibold">
                    Tu destino tecnológico de confianza
                  </p>
                </div>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Nuestra Historia</h2>
                <p className="mb-4">
                  FULLTECH nació en 2020 con la visión de democratizar el acceso a la tecnología más avanzada. 
                  Comenzamos como una pequeña tienda especializada y hemos crecido hasta convertirnos en una 
                  plataforma líder en comercio electrónico tecnológico.
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Nuestra Misión</h2>
                <p className="mb-4">
                  Conectar a las personas con la tecnología que mejora sus vidas, ofreciendo productos 
                  de calidad, precios competitivos y una experiencia de compra excepcional.
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Nuestra Visión</h2>
                <p className="mb-4">
                  Ser la plataforma tecnológica más confiable y innovadora de América Latina, 
                  donde cada cliente encuentre exactamente lo que busca.
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Nuestros Valores</h2>
                <div className="grid gap-4 md:grid-cols-2 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🔒 Confianza</h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Productos auténticos y garantizados
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">⚡ Innovación</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Siempre a la vanguardia tecnológica
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">💎 Calidad</h3>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      Solo marcas líderes y productos premium
                    </p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🤝 Comunidad</h3>
                    <p className="text-orange-700 dark:text-orange-300 text-sm">
                      Creamos vínculos duraderos con nuestros clientes
                    </p>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Lo Que Nos Hace Únicos</h2>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li><strong>Programa de Referidos:</strong> Gana 5% de descuento por cada amigo que refiere</li>
                  <li><strong>Rifas Mensuales:</strong> Participación automática con cada compra</li>
                  <li><strong>Garantía Extendida:</strong> 12 meses de garantía en todos los productos</li>
                  <li><strong>Soporte 24/7:</strong> Atención personalizada cuando la necesites</li>
                  <li><strong>Envío Rápido:</strong> Entrega en tiempo récord</li>
                </ul>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Nuestro Catálogo</h2>
                <div className="grid gap-3 md:grid-cols-2 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <i className="fas fa-mobile-alt text-primary text-xl"></i>
                    <span className="font-medium">Smartphones y Tablets</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <i className="fas fa-laptop text-primary text-xl"></i>
                    <span className="font-medium">Laptops y Computadoras</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <i className="fas fa-headphones text-primary text-xl"></i>
                    <span className="font-medium">Audio y Video</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <i className="fas fa-gamepad text-primary text-xl"></i>
                    <span className="font-medium">Gaming y Entretenimiento</span>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Nuestro Equipo</h2>
                <p className="mb-4">
                  Contamos con un equipo de expertos apasionados por la tecnología, dedicados a brindarte 
                  la mejor experiencia de compra y soporte técnico especializado.
                </p>

                <h2 className="text-lg font-semibold text-primary mt-6 mb-3">Compromiso Social</h2>
                <p className="mb-4">
                  Creemos en la responsabilidad social. Parte de nuestras ganancias se destinan a programas 
                  de educación tecnológica para comunidades de bajos recursos.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8 text-center">
                  <h3 className="text-lg font-bold text-primary mb-3">¡Únete a la Familia FULLTECH!</h3>
                  <p className="text-sm mb-4">
                    Más de 50,000 clientes satisfechos confían en nosotros para sus necesidades tecnológicas.
                  </p>
                  <div className="flex justify-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">50K+</div>
                      <div className="text-muted-foreground">Clientes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">10K+</div>
                      <div className="text-muted-foreground">Productos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">98%</div>
                      <div className="text-muted-foreground">Satisfacción</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}