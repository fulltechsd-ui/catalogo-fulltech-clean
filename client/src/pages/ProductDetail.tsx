import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { TopBar } from "../components/TopBar";
import { ImageCarousel } from "../components/ImageCarousel";
import type { Product } from "../../../shared/schema";

// Same product data - in a real app this would come from an API
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description: "Último modelo con chip A17 Pro",
    price: 99900,
    category: "smartphones",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
    inStock: true,
    featured: true,
    onSale: true,
    originalPrice: 119900,
    rating: 5,
    reviewCount: 128,
  },
  {
    id: "2",
    name: "MacBook Pro M3",
    description: "Chip M3 Pro, 18GB RAM",
    price: 249900,
    category: "laptops",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"],
    inStock: true,
    featured: true,
    onSale: false,
    originalPrice: null,
    rating: 5,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "AirPods Pro (2ª gen)",
    description: "Cancelación activa de ruido",
    price: 24900,
    category: "audio",
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"],
    inStock: true,
    featured: true,
    onSale: true,
    originalPrice: 29900,
    rating: 5,
    reviewCount: 445,
  },
  {
    id: "4",
    name: "Teclado Mecánico RGB",
    description: "Switches Cherry MX Blue",
    price: 8900,
    category: "gaming",
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1572721546624-05bf65ad7679?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"],
    inStock: true,
    featured: true,
    onSale: false,
    originalPrice: null,
    rating: 4,
    reviewCount: 89,
  },
  {
    id: "5",
    name: "Mouse Gaming Pro",
    description: "12000 DPI, RGB personalizable",
    price: 6500,
    category: "gaming",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"],
    inStock: true,
    featured: true,
    onSale: true,
    originalPrice: 7900,
    rating: 5,
    reviewCount: 234,
  },
  {
    id: "6",
    name: "Tablet Android 12\"",
    description: "8GB RAM, 256GB almacenamiento",
    price: 39900,
    category: "tablets",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"],
    inStock: true,
    featured: true,
    onSale: false,
    originalPrice: null,
    rating: 4,
    reviewCount: 56,
  },
  {
    id: "7",
    name: "Audífonos Inalámbricos",
    description: "Cancelación de ruido, 30h batería",
    price: 17900,
    category: "audio",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"],
    inStock: true,
    featured: true,
    onSale: true,
    originalPrice: 21900,
    rating: 5,
    reviewCount: 445,
  },
  {
    id: "8",
    name: "Apple Watch Series 9",
    description: "GPS + Cellular, 45mm",
    price: 42900,
    category: "wearables",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      "https://images.unsplash.com/photo-1585682738429-c2b20c8e2de5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"],
    inStock: true,
    featured: true,
    onSale: false,
    originalPrice: null,
    rating: 5,
    reviewCount: 892,
  },
];

export default function ProductDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const product = sampleProducts.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen">
          <div className="phone-content">
            <TopBar />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-4xl mb-4">😕</p>
                <h3 className="text-lg font-semibold mb-2">Producto no encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  El producto que buscas no existe o fue removido.
                </p>
                <button 
                  onClick={() => setLocation("/")}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
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
    <div className="phone-frame">
      <div className="phone-notch"></div>
      <div className="phone-screen">
        <div className="phone-content">
          {/* Full screen product image */}
          <div className="relative w-full h-screen">
            {/* Product Image Background */}
            <div className="absolute inset-0" onClick={() => setIsFullscreen(true)}>
              {product.images[selectedImageIndex] ? (
                <img 
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <i className={`${getFallbackIcon()} text-gray-400 text-6xl`}></i>
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
              className="absolute top-20 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors z-40"
              data-testid="button-back"
              title="Volver al catálogo"
            >
              <i className="fas fa-arrow-left text-white"></i>
            </button>
            
            {/* Thumbnails */}
            {(product.images.length > 1 || product.videos?.length) && (
              <div className="absolute bottom-20 left-0 w-full z-40 px-4">
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
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
                      onClick={(e) => e.stopPropagation()}
                      className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-white/50 hover:border-white bg-black/50 flex items-center justify-center"
                      data-testid={`video-thumbnail-${index}`}
                    >
                      <i className="fas fa-play text-white text-lg"></i>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Product info at bottom */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 z-30">
              <div className="max-w-md mx-auto lg:max-w-2xl space-y-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{product.name}</h1>
                  <p className="text-white/90 text-lg">{product.description}</p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(product.rating || 5)}
                  </div>
                  <span className="text-sm text-white/80">({product.reviewCount} reseñas)</span>
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
      </div>
    </div>
  );
}