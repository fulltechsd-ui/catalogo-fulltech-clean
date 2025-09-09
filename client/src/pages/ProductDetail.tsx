import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { ImageCarousel } from "@/components/ImageCarousel";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(-1); // -1 means no video selected
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch real products from API
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Find the specific product by ID
  const product = products.find((p) => p.id === params.id);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="w-full min-h-screen">
          <div className="w-full min-h-screen">
            <TopBar />
            <div className="flex items-center justify-center h-full pt-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm font-medium text-foreground">Cargando producto...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="w-full min-h-screen">
          <div className="w-full min-h-screen">
            <TopBar />
            <div className="flex items-center justify-center h-full pt-20">
              <div className="text-center">
                <p className="text-4xl md:text-6xl mb-4">😕</p>
                <h3 className="text-lg md:text-2xl font-semibold mb-2">Producto no encontrado</h3>
                <p className="text-muted-foreground mb-4 md:text-lg max-w-md">
                  El producto que buscas no existe o fue removido.
                </p>
                <button 
                  onClick={() => setLocation("/")}
                  className="bg-primary text-primary-foreground px-6 py-2 md:px-8 md:py-3 rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base"
                  data-testid="button-back-to-catalog"
                >
                  Volver al catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(0)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i 
        key={i} 
        className={`${i < rating ? 'fas' : 'far'} fa-star text-sm text-yellow-400`}
      />
    ));
  };

  const getFallbackIcon = () => {
    switch (product.category) {
      case 'smartphones': return 'fas fa-mobile-alt';
      case 'laptops': return 'fas fa-laptop';
      case 'audio': return 'fas fa-headphones';
      case 'gaming': return 'fas fa-gamepad';
      case 'tablets': return 'fas fa-tablet-alt';
      case 'wearables': return 'fas fa-clock';
      default: return 'fas fa-box';
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Quiero más información sobre el producto: ${product.name} - ${formatPrice(product.price)}`;
    const whatsappUrl = `https://wa.me/18295344286?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = () => {
    const shareData = {
      title: `${product.name} - FULLTECH`,
      text: `¡Mira este producto! ${product.name} - ${formatPrice(product.price)}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      const message = `¡Mira este producto! ${product.name} - ${formatPrice(product.price)} \n${window.location.href}`;
      const whatsappUrl = `https://wa.me/18295344286?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleGoBack = () => {
    setLocation("/");
  };

  return (
    <div className="w-full min-h-screen bg-background">
          {/* Full screen product image */}
          <div className="relative w-full h-screen">
            {/* Product Image/Video Background */}
            <div className="absolute inset-0" onClick={() => setIsFullscreen(true)}>
              {selectedVideoIndex >= 0 && product.videos && product.videos[selectedVideoIndex] ? (
                <video 
                  src={product.videos[selectedVideoIndex]}
                  className="w-full h-full object-cover cursor-pointer"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : product.images && product.images.length > 0 && product.images[selectedImageIndex] ? (
                <img 
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <i className={`${getFallbackIcon()} text-gray-400 text-6xl md:text-8xl`}></i>
                </div>
              )}
            </div>
            
            {/* Transparent header overlay */}
            <div className="absolute top-0 left-0 w-full z-50">
              <TopBar />
            </div>
            
            {/* Back button */}
            <button 
              onClick={handleGoBack}
              className="absolute top-20 md:top-24 left-4 md:left-8 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-40"
              data-testid="button-back"
              title="Volver al catálogo"
            >
              <i className="fas fa-arrow-left text-white text-sm md:text-base"></i>
            </button>
            
            {/* Thumbnails */}
            {((product.images && product.images.length > 1) || (product.videos && product.videos.length)) && (
              <div className="absolute bottom-20 md:bottom-24 left-0 w-full z-40 px-4 md:px-8">
                <div className="flex gap-2 md:gap-4 justify-center overflow-x-auto pb-2">
                  {product.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                        setSelectedVideoIndex(-1); // Reset video selection
                      }}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index && selectedVideoIndex === -1
                          ? 'border-white ring-2 ring-white/50' 
                          : 'border-white/50 hover:border-white'
                      }`}
                      data-testid={`thumbnail-${index}`}
                    >
                      <img 
                        src={image}
                        alt={`${product.name} imagen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {product.videos?.map((video, index) => (
                    <button
                      key={`video-${index}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideoIndex(index);
                        setSelectedImageIndex(0); // Reset to first image
                      }}
                      className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all bg-black/50 flex items-center justify-center ${
                        selectedVideoIndex === index
                          ? 'border-white ring-2 ring-white/50'
                          : 'border-white/50 hover:border-white'
                      }`}
                      data-testid={`video-thumbnail-${index}`}
                    >
                      <i className="fas fa-play text-white text-lg md:text-xl"></i>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Product info at bottom */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 md:p-8 lg:p-12 z-50">
              <div className="max-w-md mx-auto md:max-w-2xl lg:max-w-4xl space-y-3 md:space-y-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{product.name}</h1>
                  <p className="text-white/90 text-base md:text-lg lg:text-xl">{product.description}</p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(product.rating || 5)}
                  </div>
                  <span className="text-sm md:text-base text-white/80">({product.reviewCount || 0} reseñas)</span>
                </div>
                
                {/* Price */}
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  {product.onSale && product.originalPrice && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white/60 line-through">{formatPrice(product.originalPrice)}</span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                  <span className="text-3xl lg:text-4xl font-bold text-white">{formatPrice(product.price)}</span>
                  <p className="text-sm text-white/80 mt-1">Precio incluye envío gratis</p>
                </div>
                
                {/* Action buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-3 animate-pulse-ring"
                    data-testid="button-whatsapp-order"
                  >
                    <i className="fab fa-whatsapp text-xl"></i>
                    Pedir por WhatsApp
                  </button>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={handleShare}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      data-testid="button-share"
                    >
                      <i className="fas fa-share-alt"></i>
                      Compartir
                    </button>
                    
                    <button 
                      className="flex-1 bg-gray-500/50 backdrop-blur-sm text-white py-3 rounded-xl font-medium hover:bg-gray-600/70 transition-colors flex items-center justify-center gap-2"
                      data-testid="button-favorite"
                    >
                      <i className="far fa-heart"></i>
                      Favorito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fullscreen Image Modal */}
          {isFullscreen && (
            <div className="fixed inset-0 z-[100] bg-black">
              <button 
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-10"
                data-testid="button-exit-fullscreen"
                title="Regresar"
              >
                <i className="fas fa-times text-white text-lg"></i>
              </button>
              
              <img 
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-contain"
                onClick={() => setIsFullscreen(false)}
              />
            </div>
          )}
    </div>
  );
}