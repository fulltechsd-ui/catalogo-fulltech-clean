import { useState, useEffect } from "react";
import { useCustomer } from "@/hooks/useCustomer";
import { useCustomPages } from "@/hooks/useCustomPages";
import { useInstantNavigation } from "@/hooks/useInstantNavigation";
import { useConfigLoader, getConfigValue } from "@/lib/config";
import { Link } from "wouter";
import type { CustomPage } from "@shared/schema";
// Logo por defecto - emoji o texto
const logoDefault = "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234F46E5'/%3E%3Ctext x='20' y='28' text-anchor='middle' fill='white' font-family='sans-serif' font-size='16' font-weight='bold'%3EFT%3C/text%3E%3C/svg%3E";

export function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const { customer, isAuthenticated, logout } = useCustomer();
  const { groupedPages } = useCustomPages();
  const { goHome, goToCustomPage } = useInstantNavigation();
  
  // Cargar configuraciones del sitio
  useConfigLoader();
  
  // Obtener configuraciones con valores por defecto
  const logoUrl = getConfigValue("logo_url", logoDefault);
  const siteName = getConfigValue("site_name", "FULLTECH");
  const logoAlt = getConfigValue("logo_alt", "FULLTECH Logo");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    // Detectar si la app ya está instalada
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = (window.navigator as any).standalone;
      const appInstalled = isStandalone || isIosStandalone;
      setIsAppInstalled(appInstalled);
      
      // Mostrar botón de instalar si no está instalada (para PWA)
      if (!appInstalled) {
        setShowInstallButton(true);
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Asegurar que el botón se muestre cuando el navegador lo permita
      setShowInstallButton(true);
    };

    // Evento cuando se instala la app
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Si tenemos el prompt nativo, úsalo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallButton(false);
        setIsAppInstalled(true);
      }
      
      setDeferredPrompt(null);
    } else {
      // Fallback: mostrar instrucciones para instalar manualmente
      const userAgent = navigator.userAgent.toLowerCase();
      let instructions = "";
      
      if (userAgent.includes('chrome') || userAgent.includes('edge')) {
        instructions = "Para instalar: Ve al menú del navegador (⋮) → 'Instalar FULLTECH' o busca el ícono de instalación en la barra de direcciones.";
      } else if (userAgent.includes('firefox')) {
        instructions = "Para instalar: Ve al menú del navegador (☰) → 'Instalar' o busca el ícono de instalación en la barra de direcciones.";
      } else if (userAgent.includes('safari')) {
        instructions = "Para instalar en iOS: Toca el botón 'Compartir' (□↗) → 'Añadir a pantalla de inicio'.";
      } else {
        instructions = "Para instalar: Busca la opción 'Instalar' o 'Añadir a pantalla de inicio' en el menú de tu navegador.";
      }
      
      alert(`¡Instala FULLTECH como app!\n\n${instructions}\n\nTendrás acceso rápido y una experiencia como app nativa.`);
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Catálogo FULLTECH',
          text: '¡Descubre los mejores productos tech en FULLTECH! Ofertas increíbles y tecnología de vanguardia.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      const shareData = {
        title: 'Catálogo FULLTECH',
        text: '¡Descubre los mejores productos tech en FULLTECH!',
        url: window.location.href,
      };
      
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('¡Enlace copiado al portapapeles!');
      } else {
        // Último fallback
        const textArea = document.createElement('textarea');
        textArea.value = `${shareData.text} ${shareData.url}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('¡Enlace copiado al portapapeles!');
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 safe-area-top">
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg px-4 py-3 flex items-center justify-between h-16">
        <button 
          onClick={goHome}
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          data-testid="button-home-logo"
        >
          <img 
            src={logoUrl} 
            alt={logoAlt} 
            className="w-10 h-10 object-contain filter drop-shadow-md animate-spin-slow rounded-full"
          />
          <div>
            <h1 className="text-white font-bold text-xl tracking-wider drop-shadow-xl bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent filter brightness-150 contrast-125">{siteName}</h1>
            {isAuthenticated && customer && (
              <p className="text-white/80 text-xs drop-shadow-sm">
                Hola, {customer.name.split(' ')[0]} 👋
              </p>
            )}
          </div>
        </button>
        <div className="flex items-center gap-2">
          {/* Botón Compartir - siempre visible */}
          <button 
            onClick={handleShareClick}
            className="icon-button bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            data-testid="button-share-app"
            title="Compartir App"
          >
            <i className="text-white fas fa-share-alt text-sm"></i>
          </button>
          
          {/* Botón Instalar - solo si no está instalada */}
          {showInstallButton && !isAppInstalled && (
            <button 
              onClick={handleInstallClick}
              className="icon-button bg-green-500/80 backdrop-blur-sm rounded-full p-2 hover:bg-green-600 transition-colors animate-pulse"
              data-testid="button-install-app"
              title="Instalar App"
            >
              <i className="text-white fas fa-download text-sm"></i>
            </button>
          )}
          
          {isAuthenticated && customer && (
            <div className="flex items-center gap-2">
              <img 
                src={customer.picture} 
                alt={customer.name}
                className="w-8 h-8 rounded-full border-2 border-white/30"
              />
            </div>
          )}
          <button 
            id="menu-toggle" 
            className="icon-button bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            onClick={toggleMenu}
            data-testid="button-menu-toggle"
          >
            <i className="text-white fas fa-bars text-sm"></i>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div 
        className={`absolute top-20 right-4 w-64 bg-white border border-border rounded-xl shadow-lg p-4 z-50 transition-all duration-200 ${
          isMenuOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
        }`}
        data-testid="dropdown-menu"
      >
        {isAuthenticated ? (
          <>
            {/* Información del usuario */}
            <div className="px-3 py-2 bg-muted/50 rounded-lg mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={customer?.picture} 
                  alt={customer?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-sm">{customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{customer?.email}</p>
                  <p className="text-xs text-green-600 font-medium">
                    Código: {customer?.referralCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Opciones para usuarios logueados */}
            <button 
              className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
              onClick={closeMenu}
              data-testid="button-profile"
            >
              <i className="fas fa-user text-muted-foreground"></i>
              <span>Mi Perfil</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
              onClick={closeMenu}
              data-testid="button-favorites"
            >
              <i className="fas fa-heart text-muted-foreground"></i>
              <span>Favoritos</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
              onClick={closeMenu}
              data-testid="button-cart"
            >
              <i className="fas fa-shopping-cart text-muted-foreground"></i>
              <span>Carrito</span>
            </button>
            
            <hr className="my-2 border-border" />
            
            {/* Páginas principales dinámicas */}
            {groupedPages.main && groupedPages.main.map((page) => (
              <button 
                key={page.id} 
                onClick={() => {
                  closeMenu();
                  goToCustomPage(page.slug);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" 
              >
                <i className="fas fa-file-alt text-muted-foreground"></i>
                <span>{page.title}</span>
              </button>
            ))}
            
            {/* Páginas de soporte dinámicas */}
            {groupedPages.support && groupedPages.support.map((page) => (
              <button 
                key={page.id} 
                onClick={() => {
                  closeMenu();
                  goToCustomPage(page.slug);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" 
              >
                <i className="fas fa-headset text-muted-foreground"></i>
                <span>{page.title}</span>
              </button>
            ))}
            
            {/* Páginas legales estáticas */}
            <Link href="/garantia" className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" onClick={closeMenu}>
              <i className="fas fa-shield-alt text-muted-foreground"></i>
              <span>Garantía</span>
            </Link>
            <Link href="/contacto" className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" onClick={closeMenu}>
              <i className="fas fa-headset text-muted-foreground"></i>
              <span>Contacto</span>
            </Link>
            
            <hr className="my-2 border-border" />
            
            <button 
              className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
              onClick={() => {
                closeMenu();
                logout();
              }}
              data-testid="button-logout"
            >
              <i className="fas fa-sign-out-alt text-red-600"></i>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <>
            {/* Páginas principales dinámicas */}
            {groupedPages.main && groupedPages.main.map((page) => (
              <button 
                key={page.id} 
                onClick={() => {
                  closeMenu();
                  goToCustomPage(page.slug);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" 
              >
                <i className="fas fa-file-alt text-muted-foreground"></i>
                <span>{page.title}</span>
              </button>
            ))}
            
            {/* Páginas de soporte dinámicas */}
            {groupedPages.support && groupedPages.support.map((page) => (
              <button 
                key={page.id} 
                onClick={() => {
                  closeMenu();
                  goToCustomPage(page.slug);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" 
              >
                <i className="fas fa-headset text-muted-foreground"></i>
                <span>{page.title}</span>
              </button>
            ))}
            
            {/* Páginas legales estáticas */}
            <Link href="/garantia" className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" onClick={closeMenu}>
              <i className="fas fa-shield-alt text-muted-foreground"></i>
              <span>Garantía</span>
            </Link>
            <Link href="/contacto" className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors" onClick={closeMenu}>
              <i className="fas fa-headset text-muted-foreground"></i>
              <span>Contacto</span>
            </Link>
            
            <hr className="my-2 border-border" />
            
            {/* Login para usuarios no autenticados */}
            <button 
              className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
              onClick={() => {
                closeMenu();
                window.location.href = '/login';
              }}
              data-testid="button-login"
            >
              <i className="fas fa-sign-in-alt text-blue-600"></i>
              <span className="font-medium">Iniciar Sesión</span>
            </button>
          </>
        )}
      </div>

      {/* Overlay to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
