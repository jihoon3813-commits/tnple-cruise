import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin, ArrowLeft, ChevronRight, ChevronLeft, Star, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';
import BookingModal from '../components/BookingModal';

const GALLERY_HEIGHT_DESKTOP = 600;
const GALLERY_HEIGHT_MOBILE = 280;

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [galleryIdx, setGalleryIdx] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const product = config.products.find(p => p.id === id);
  const branding = config.productDetailBranding || {};

  if (!product) return <div className="container" style={{ paddingTop: '160px' }}>상품을 찾을 수 없습니다.</div>;

  const typo = product.typography || {};
  const getStyle = (t, baseSize, scale = 1) => {
    let color = typo[t]?.color;
    if (t === 'title' && branding.titleColor) color = branding.titleColor;
    if (t === 'price' && branding.priceColor) color = branding.priceColor;
    if (t === 'description' && branding.descriptionColor) color = branding.descriptionColor;

    let fontSize = typo[t]?.fontSize ? typo[t].fontSize * scale : parseInt(baseSize);
    if (isMobile) {
        if (t === 'title') fontSize = Math.min(fontSize, 36);
        else if (t === 'description') fontSize = Math.min(fontSize, 16);
        else if (t === 'price') fontSize = Math.min(fontSize, 28);
        else fontSize = fontSize * 0.8;
    }

    return {
      fontSize: `${fontSize}px`,
      color: color,
      fontWeight: t === 'title' || t === 'price' ? '900' : '400'
    };
  };

  const isDark = branding.theme === 'dark';
  const isGlass = branding.theme === 'glass';
  
  const pageBg = isDark ? '#0F172A' : (isGlass ? '#F1F5F9' : '#ffffff');
  const textColor = isDark ? '#F8FAFC' : 'var(--text-main)';
  const mutedColor = isDark ? '#94A3B8' : (branding.descriptionColor || 'var(--text-muted)');
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : (isGlass ? 'rgba(255,255,255,0.7)' : '#ffffff');
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'var(--border-light)';

  const openGallery = (idx = 0) => {
    setGalleryIdx(idx);
    setIsGalleryOpen(true);
  };

  const galleryHeight = isMobile ? GALLERY_HEIGHT_MOBILE : GALLERY_HEIGHT_DESKTOP;
  const extraCount = product.thumbnails.length > 2 ? product.thumbnails.length - 2 : 0;

  const renderSchedule = () => {
    if (product.scheduleImage) {
        return <SafeMedia src={product.scheduleImage} style={{ width: '100%', borderRadius: isMobile ? '24px' : '40px', boxShadow: 'var(--shadow-md)' }} />;
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '40px' }}>
            {(product.schedule || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: isMobile ? '20px' : '40px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '900', color: branding.accentColor || 'var(--primary)', minWidth: isMobile ? '50px' : '60px', paddingTop: '4px' }}>DAY 0{item.day}</div>
                    <div>
                        <h4 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800', marginBottom: '8px', color: textColor }}>{item.title}</h4>
                        <p style={{ color: mutedColor, fontSize: isMobile ? '14px' : '16px', lineHeight: '1.7' }}>{item.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
  };

  const renderGalleryModal = () => (
    <AnimatePresence>
      {isGalleryOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsGalleryOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(16px)',
            zIndex: 5000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: isMobile ? '0' : '40px'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsGalleryOpen(false)}
            style={{
              position: 'absolute', top: '24px', right: '24px', zIndex: 5010,
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              border: 'none', borderRadius: '50%',
              width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff'
            }}
          >
            <X size={24} />
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)',
            color: '#fff', fontSize: '14px', fontWeight: '700', zIndex: 5010,
            background: 'rgba(255,255,255,0.1)', padding: '6px 20px', borderRadius: '100px'
          }}>
            {galleryIdx + 1} / {product.thumbnails.length}
          </div>

          {/* Image */}
          <motion.div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: '1000px',
              height: isMobile ? '70vh' : '80vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={galleryIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <SafeMedia
                  src={product.thumbnails[galleryIdx]}
                  style={{
                    maxWidth: '100%', maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: isMobile ? '0' : '24px'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation arrows */}
          {product.thumbnails.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + product.thumbnails.length) % product.thumbnails.length); }}
                style={{
                  position: 'absolute', left: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '50%',
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', zIndex: 5010
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % product.thumbnails.length); }}
                style={{
                  position: 'absolute', right: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '50%',
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', zIndex: 5010
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {product.thumbnails.length > 1 && (
            <div style={{
              position: 'absolute', bottom: isMobile ? '20px' : '32px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', zIndex: 5010,
              background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: '16px',
              backdropFilter: 'blur(8px)', maxWidth: '90vw', overflowX: 'auto'
            }}>
              {product.thumbnails.map((thumb, idx) => (
                <div
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setGalleryIdx(idx); }}
                  style={{
                    width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden',
                    cursor: 'pointer', flexShrink: 0,
                    border: idx === galleryIdx ? '2px solid #fff' : '2px solid transparent',
                    opacity: idx === galleryIdx ? 1 : 0.5,
                    transition: '0.2s'
                  }}
                >
                  <SafeMedia src={thumb} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="product-detail" style={{ 
      paddingTop: isMobile ? '80px' : '100px', 
      paddingBottom: isMobile ? '40px' : '100px', 
      background: pageBg,
      color: textColor,
      minHeight: '100vh',
      transition: '0.3s'
    }}>
      <div className="container" style={{ padding: isMobile ? '0 20px' : '0' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: isMobile ? '20px' : '32px', fontSize: '13px', color: mutedColor }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈</Link>
          <ChevronRight size={14} />
          <span style={{ color: textColor, fontWeight: '700' }}>{product.title}</span>
        </div>

        {/* Dynamic Layouts */}
        {branding.layout === 'split' ? (
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '32px' : '64px', marginBottom: isMobile ? '40px' : '80px', alignItems: 'center' }}>
              <div 
                onClick={() => openGallery(0)} 
                style={{ height: `${galleryHeight}px`, borderRadius: isMobile ? '24px' : '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', cursor: 'pointer' }}
              >
                 <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                 <h1 style={{ ...getStyle('title', '48px', 1.2), lineHeight: '1.2', marginBottom: '16px' }}>{product.title}</h1>
                 <p style={{ ...getStyle('description', '20px', 1.1), lineHeight: '1.7', color: mutedColor }}>{product.description}</p>
              </div>
           </div>
        ) : (
           /* Default/Luxury Layout Header — fixed height */
           <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: isMobile ? '12px' : '24px', height: `${galleryHeight}px`, maxHeight: `${galleryHeight}px`, overflow: 'hidden', marginBottom: isMobile ? '40px' : '64px' }}>
             <div 
               onClick={() => openGallery(0)} 
               style={{ overflow: 'hidden', borderRadius: isMobile ? '20px' : '32px', boxShadow: 'var(--shadow-lg)', cursor: 'pointer', minHeight: 0, height: '100%' }}
             >
               <SafeMedia src={product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
             </div>
             {!isMobile && (
               <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '24px', minHeight: 0, height: '100%' }}>
                 <div 
                   onClick={() => openGallery(1)} 
                   style={{ overflow: 'hidden', borderRadius: '32px', cursor: 'pointer', minHeight: 0 }}
                 >
                    <SafeMedia src={product.thumbnails[1] || product.thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.8)' }} />
                 </div>
                 <div 
                   onClick={() => openGallery(2)} 
                   style={{ 
                     background: cardBg, backdropFilter: isGlass ? 'blur(20px)' : 'none', 
                     borderRadius: '32px', display: 'flex', flexDirection: 'column', 
                     alignItems: 'center', justifyContent: 'center', 
                     border: `1px solid ${cardBorder}`, cursor: 'pointer',
                     minHeight: 0, transition: '0.3s'
                   }}
                   onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}
                   onMouseLeave={e => e.currentTarget.style.background = cardBg}
                 >
                    <span style={{ fontSize: '28px', fontWeight: '900', color: branding.accentColor || 'var(--primary)' }}>+{extraCount > 0 ? extraCount : product.thumbnails.length}</span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: mutedColor, marginTop: '4px' }}>사진 전체보기</span>
                 </div>
               </div>
             )}
           </div>
        )}

        <div style={{ 
          display: (branding.layout === 'modern' || isMobile) ? 'block' : 'grid', 
          gridTemplateColumns: branding.layout === 'modern' ? '1fr' : (branding.layout === 'split' ? '1fr 1fr' : '2fr 1fr'), 
          gap: (branding.layout === 'modern' || isMobile) ? '40px' : (branding.layout === 'split' ? '64px' : '24px'), 
          alignItems: 'start' 
        }}>
          {/* Main Content */}
          <div style={{ maxWidth: (branding.layout === 'modern' && !isMobile) ? '800px' : 'none', margin: (branding.layout === 'modern' && !isMobile) ? '0 auto' : '0' }}>
            {branding.layout !== 'split' && <h1 style={{ ...getStyle('title', '56px', 1.2), lineHeight: '1.2', marginBottom: '20px' }}>{product.title}</h1>}
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: isMobile ? '32px' : '48px', flexWrap: 'wrap' }}>
              <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: branding.badgeColor || cardBg, 
                  color: branding.badgeTextColor || textColor,
                  border: branding.badgeColor ? 'none' : `1px solid ${cardBorder}`, 
                  padding: '8px 18px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  fontWeight: '700' 
              }}>
                 <Clock size={14} color={branding.badgeColor ? branding.badgeTextColor : (branding.accentColor || "var(--primary)")} /> 14일 여정
              </div>
              <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: branding.badgeColor || cardBg, 
                  color: branding.badgeTextColor || textColor,
                  border: branding.badgeColor ? 'none' : `1px solid ${cardBorder}`, 
                  padding: '8px 18px', 
                  borderRadius: '100px', 
                  fontSize: '13px', 
                  fontWeight: '700' 
              }}>
                 <Ship size={14} color={branding.badgeColor ? branding.badgeTextColor : (branding.accentColor || "var(--primary)")} /> 럭셔리 크루즈
              </div>
            </div>

            {branding.layout !== 'split' && <p style={{ ...getStyle('description', '20px', 1.1), lineHeight: '1.7', marginBottom: isMobile ? '40px' : '80px', color: mutedColor }}>{product.description}</p>}

            <div style={{ borderTop: `1px solid ${cardBorder}`, paddingTop: isMobile ? '40px' : '80px', marginBottom: isMobile ? '40px' : '0' }}>
              <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '900', marginBottom: isMobile ? '32px' : '48px', color: branding.sectionTitleColor || textColor }}>상세 여행 데일리 루틴</h2>
              {renderSchedule()}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside style={{ 
            position: (branding.layout === 'modern' || isMobile) ? 'static' : 'sticky', 
            top: '120px', 
            marginTop: (branding.layout === 'modern' || isMobile) ? '40px' : '0',
            maxWidth: (branding.layout === 'modern' && !isMobile) ? '800px' : 'none',
            margin: (branding.layout === 'modern' && !isMobile) ? '0 auto' : '0'
          }}>
            <div style={{ 
              padding: isMobile ? '32px' : '48px', 
              borderRadius: isMobile ? '32px' : '40px', 
              background: cardBg,
              backdropFilter: isGlass ? 'blur(30px)' : 'none',
              border: `1px solid ${cardBorder}`,
              boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.5)' : '0 30px 60px rgba(0,0,0,0.08)' 
            }}>
               <div style={{ marginBottom: isMobile ? '32px' : '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                     <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: mutedColor }}>
                        {product.paymentType === 'split' ? '예약금 및 구성' : '총 패키지 금액'}
                     </span>
                     {product.paymentType === 'split' && (
                        <span style={{ fontSize: '10px', padding: '2px 8px', background: branding.accentColor || 'var(--primary)', color: '#fff', borderRadius: '4px', fontWeight: '800' }}>분할납부형</span>
                     )}
                  </div>
                  
                  <div style={{ marginTop: '8px' }}>
                     {product.paymentType === 'split' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                           <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                              <span style={{ fontSize: '14px', color: mutedColor }}>패키지 정가:</span>
                              <span style={{ fontSize: '18px', fontWeight: '700', color: textColor }}>{product.originalPrice?.toLocaleString()}원</span>
                           </div>
                           <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'var(--bg-sub)', padding: '20px', borderRadius: '20px', border: `1px solid ${cardBorder}` }}>
                              <div style={{ fontSize: '13px', color: branding.accentColor || 'var(--primary)', fontWeight: '800', marginBottom: '4px' }}>지금 필요한 예약금</div>
                              <div style={{ fontSize: '32px', fontWeight: '900', color: branding.accentColor || 'var(--primary)' }}>{product.downPayment?.toLocaleString()}원</div>
                              <p style={{ fontSize: '12px', color: mutedColor, marginTop: '8px', lineHeight: '1.5' }}>
                                 * 나머지 잔금은 여행을 안전하게 다녀오신 후<br/>납입하시는 안심 플랜 상품입니다.
                              </p>
                           </div>
                        </div>
                     ) : (
                        <>
                           {product.originalPrice > 0 && product.originalPrice > product.price && (
                             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '15px', color: mutedColor, textDecoration: 'line-through', fontWeight: '500' }}>{product.originalPrice.toLocaleString()}원</span>
                                <span style={{ fontSize: '16px', color: '#ef4444', fontWeight: '900' }}>{Math.round((1 - product.price / product.originalPrice) * 100)}% 할인</span>
                             </div>
                           )}
                           <div style={{ ...getStyle('price', '42px', 1.2), color: branding.accentColor || (isDark ? '#fff' : 'var(--primary)') }}>
                              {product.price.toLocaleString()}원
                           </div>
                           {product.originalPrice > product.price ? (
                             <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: '700', marginTop: '12px' }}>* 총 {(product.originalPrice - product.price).toLocaleString()}원 즉시 할인 적용됨</p>
                           ) : (
                             <p style={{ fontSize: '13px', color: mutedColor, fontWeight: '700', marginTop: '12px' }}>* 오직 티앤플코리아에서만 가능한 특별가</p>
                           )}
                        </>
                     )}
                  </div>
               </div>

               <button 
                  className="luxury-btn" 
                  onClick={() => setIsBookingOpen(true)}
                  style={{ 
                    width: '100%', 
                    padding: '18px', 
                    borderRadius: '16px', 
                    fontSize: '15px', 
                    justifyContent: 'center',
                    background: branding.buttonColor || 'var(--primary)',
                    color: branding.buttonTextColor || '#ffffff'
                  }}
               >
                  전문 상담 신청하기
               </button>
               <p style={{ textAlign: 'center', fontSize: '11px', color: mutedColor, marginTop: '16px' }}>* 전문가 상담 후 최종 예약이 확정됩니다.</p>
            </div>
          </aside>
        </div>
      </div>
      
      {renderGalleryModal()}

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        productTitle={product.title}
        accentColor={branding.buttonColor || 'var(--primary)'}
      />
    </div>
  );
};

export default ProductDetail;
