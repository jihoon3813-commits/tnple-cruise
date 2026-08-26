import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';
import { Calendar, CreditCard, Ship, MapPin, ArrowLeft, ChevronRight, ChevronLeft, Star, Clock, X, CheckCircle2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';
import BookingModal from '../components/BookingModal';

const GALLERY_HEIGHT_DESKTOP = 460;
const GALLERY_HEIGHT_MOBILE = 280;

const ProductDetail = () => {
  const { id } = useParams();
  const { config } = useConfig();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const product = config?.products?.find(p => p.id === id);

  if (!product) {
    return (
      <div style={{ paddingTop: '160px', paddingBottom: '120px', minHeight: '80vh', textAlign: 'center', background: '#FFFFFF' }}>
        <div className="container">
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '16px' }}>상품을 찾을 수 없습니다.</h2>
          <p style={{ color: '#64748B', marginBottom: '24px' }}>요청하신 크루즈 상품이 존재하지 않거나 삭제되었습니다.</p>
          <Link to="/#packages" className="sharp-btn-dark" style={{ padding: '12px 24px', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> 추천 패키지 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const thumbnails = product.thumbnails && product.thumbnails.length > 0 
    ? product.thumbnails 
    : ['https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'];

  const features = product.features && product.features.length > 0
    ? product.features
    : (product.schedule && product.schedule.length > 0
        ? product.schedule.slice(0, 3).map(s => `${s.day}일차: ${s.title}`)
        : ['발코니 오션뷰 객실', '전 일정 선상 뷔페 & 정찬', '기항지 한국인 가이드 투어']);

  const isSplit = product.paymentType === 'split';
  const downPayment = product.downPayment || 0;
  const installments = product.installments || 12;
  const monthlyAmount = isSplit 
    ? Math.round((product.price - downPayment) / installments)
    : Math.round(product.price / 12);

  const discountRate = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const galleryHeight = isMobile ? GALLERY_HEIGHT_MOBILE : GALLERY_HEIGHT_DESKTOP;
  const extraCount = thumbnails.length > 2 ? thumbnails.length - 2 : 0;

  const openGallery = (idx = 0) => {
    setGalleryIdx(idx);
    setIsGalleryOpen(true);
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
            background: 'rgba(7, 13, 30, 0.95)',
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
              border: 'none', borderRadius: '0px',
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff'
            }}
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: '28px', left: '50%', transform: 'translateX(-50%)',
            color: '#fff', fontSize: '13px', fontWeight: '800', zIndex: 5010,
            background: 'rgba(255,255,255,0.1)', padding: '6px 18px', borderRadius: '0px', border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {galleryIdx + 1} / {thumbnails.length}
          </div>

          {/* Image Viewer */}
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
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <SafeMedia
                  src={thumbnails[galleryIdx]}
                  style={{
                    maxWidth: '100%', maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '0px'
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation arrows */}
          {thumbnails.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx - 1 + thumbnails.length) % thumbnails.length); }}
                style={{
                  position: 'absolute', left: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '0px',
                  width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', zIndex: 5010
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setGalleryIdx((galleryIdx + 1) % thumbnails.length); }}
                style={{
                  position: 'absolute', right: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                  border: 'none', borderRadius: '0px',
                  width: '44px', height: '44px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', zIndex: 5010
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          {thumbnails.length > 1 && (
            <div style={{
              position: 'absolute', bottom: isMobile ? '20px' : '32px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', zIndex: 5010,
              background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: '0px',
              border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', maxWidth: '90vw', overflowX: 'auto'
            }}>
              {thumbnails.map((thumb, idx) => (
                <div
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setGalleryIdx(idx); }}
                  style={{
                    width: '48px', height: '48px', borderRadius: '0px', overflow: 'hidden',
                    cursor: 'pointer', flexShrink: 0,
                    border: idx === galleryIdx ? '2px solid var(--accent-gold)' : '2px solid transparent',
                    opacity: idx === galleryIdx ? 1 : 0.4,
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
    <div style={{ 
      paddingTop: '130px', 
      paddingBottom: '100px', 
      background: '#FFFFFF',
      color: '#1A202C',
      minHeight: '100vh'
    }}>
      <div className="container">
        
        {/* Prominent Back to Product List Button */}
        <div style={{ marginBottom: '24px' }}>
          <Link 
            to="/#packages" 
            className="sharp-btn-outline" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              fontSize: '13px', 
              fontWeight: '700', 
              color: 'var(--navy-deep)', 
              borderColor: '#CBD5E1', 
              background: '#F8FAFC',
              textDecoration: 'none',
              borderRadius: '0px'
            }}
          >
            <ArrowLeft size={16} /> 추천 상품 목록으로 가기
          </Link>
        </div>

        {/* 2-Column Split: Left Scrolls freely, Right stays Sticky Floating */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1.75fr 1fr', 
          gap: isMobile ? '36px' : '48px', 
          alignItems: 'start' 
        }}>

          {/* =========================================================================
              LEFT COLUMN: Photo Gallery + Title + Features + Description + Schedule
              ========================================================================= */}
          <div>
            
            {/* Sharp Kensington Photo Gallery (2fr 1fr Grid) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', 
              gap: '12px', 
              height: `${galleryHeight}px`, 
              maxHeight: `${galleryHeight}px`, 
              overflow: 'hidden', 
              marginBottom: '32px',
              border: '1px solid #E2E8F0'
            }}>
              {/* Big Main Image */}
              <div 
                onClick={() => openGallery(0)} 
                style={{ overflow: 'hidden', cursor: 'pointer', height: '100%', position: 'relative' }}
              >
                <SafeMedia priority={true} src={thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '0px' }} />
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--navy-deep)', color: 'var(--accent-gold)', padding: '4px 12px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em' }}>
                  {product.badge || '다온넷 추천'}
                </div>
              </div>

              {/* Stacked Right Images */}
              {!isMobile && (
                <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '12px', height: '100%' }}>
                  <div 
                    onClick={() => openGallery(1)} 
                    style={{ overflow: 'hidden', cursor: 'pointer', height: '100%' }}
                  >
                    <SafeMedia priority={true} src={thumbnails[1] || thumbnails[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.85)', borderRadius: '0px' }} />
                  </div>
                  <div 
                    onClick={() => openGallery(2)} 
                    style={{ 
                      background: 'var(--navy-deep)', 
                      color: '#FFFFFF',
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer',
                      height: '100%',
                      transition: '0.2s',
                      borderRadius: '0px'
                    }}
                  >
                    <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-gold)' }}>+{extraCount > 0 ? extraCount : thumbnails.length}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#E2E8F0', marginTop: '4px' }}>사진 전체보기</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Title */}
            <h1 style={{ 
              fontSize: isMobile ? '24px' : '32px', 
              fontWeight: '800', 
              color: 'var(--navy-deep)', 
              lineHeight: '1.3', 
              marginBottom: '16px', 
              letterSpacing: '-0.02em',
              fontFamily: "'Pretendard', sans-serif"
            }}>
              {product.title}
            </h1>

            {/* Dynamic Tag Badges from Database */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'var(--navy-deep)', 
                color: 'var(--accent-gold)', 
                padding: '6px 14px', 
                fontSize: '12px', 
                fontWeight: '700',
                borderRadius: '0px'
              }}>
                <Ship size={13} /> {product.ship || '로얄캐리비안 스펙트럼호'}
              </div>

              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: '#F1F5F9', 
                color: '#334155', 
                border: '1px solid #CBD5E1', 
                padding: '6px 14px', 
                fontSize: '12px', 
                fontWeight: '700',
                borderRadius: '0px'
              }}>
                <Clock size={13} /> {product.schedule?.length ? `${product.schedule.length}일 여정 코스` : '프리미엄 여정'}
              </div>

              {product.bookingPeriod && (
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  background: '#F8FAFC', 
                  color: '#475569', 
                  border: '1px solid #E2E8F0', 
                  padding: '6px 14px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  borderRadius: '0px'
                }}>
                  <Calendar size={13} /> {product.bookingPeriod}
                </div>
              )}
            </div>

            {/* Highlights Box: Features Entered in Admin */}
            <div style={{ 
              background: 'var(--bg-warm)', 
              border: '1px solid #E2D9C8', 
              padding: '24px', 
              marginBottom: '28px',
              borderRadius: '0px'
            }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold-dark)', letterSpacing: '0.12em', marginBottom: '14px', textTransform: 'uppercase' }}>
                PACKAGE HIGHLIGHTS & PRIVILEGES (주요 혜택 및 특장점)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                    <span style={{ color: 'var(--accent-gold-dark)', fontSize: '15px' }}>▪</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569', marginBottom: '48px', wordBreak: 'keep-all' }}>
              {product.description}
            </p>

            {/* Daily Schedule Section */}
            <div style={{ borderTop: '2px solid var(--navy-deep)', paddingTop: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.12em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
                    ITINERARY SCHEDULE
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '4px', fontFamily: "'Pretendard', sans-serif" }}>
                    상세 여행 데일리 루틴
                  </h2>
                </div>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  총 {product.schedule?.length || 0}개 일정
                </span>
              </div>

              {product.scheduleImage ? (
                <div style={{ border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                  <SafeMedia src={product.scheduleImage} style={{ width: '100%', display: 'block', borderRadius: '0px' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {(product.schedule || []).map((item, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        border: '1px solid #E2E8F0', 
                        padding: '24px', 
                        background: '#FFFFFF',
                        display: 'flex',
                        gap: isMobile ? '16px' : '24px',
                        alignItems: 'flex-start',
                        borderRadius: '0px'
                      }}
                    >
                      <div style={{ 
                        background: 'var(--navy-deep)', 
                        color: 'var(--accent-gold)', 
                        fontSize: '12px', 
                        fontWeight: '800', 
                        padding: '8px 14px', 
                        minWidth: '76px', 
                        textAlign: 'center',
                        borderRadius: '0px'
                      }}>
                        DAY 0{item.day}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '8px' }}>
                          {item.title}
                        </h4>
                        <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
                          {item.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: Sticky Floating Price Card (Kensington Sharp Box - 이미지 2번)
              ========================================================================= */}
          <aside style={{ 
            position: isMobile ? 'static' : 'sticky', 
            top: '120px', 
            alignSelf: 'start',
            zIndex: 30
          }}>
            <div style={{ 
              padding: isMobile ? '28px 20px' : '36px 32px', 
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
              borderRadius: '0px'
            }}>
              <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '20px', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold-dark)' }}>
                  {isSplit ? '스마트 후불제 플랜' : '총 패키지 금액'}
                </span>
                
                {isSplit ? (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>총 상품 정가</span>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#64748B', textDecoration: 'line-through' }}>
                        {(product.originalPrice || product.price).toLocaleString()}원
                      </span>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '16px', border: '1px solid #E2E8F0', marginTop: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy-deep)', marginBottom: '2px' }}>
                        매월 납부 분할액
                      </div>
                      <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-gold-dark)', letterSpacing: '-0.02em' }}>
                        월 {monthlyAmount.toLocaleString()}원
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                        * {installments}개월 분할 납부 (착수 예약금: {downPayment.toLocaleString()}원)
                      </div>
                    </div>

                    <p style={{ fontSize: '11px', color: '#64748B', marginTop: '12px', lineHeight: '1.6' }}>
                      * 여행을 먼저 다녀오신 후 편안하게 정산하시는 다온넷 안심 후불 멤버십입니다.
                    </p>
                  </div>
                ) : (
                  <div style={{ marginTop: '12px' }}>
                    {discountRate > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', color: '#94A3B8', textDecoration: 'line-through' }}>
                          {product.originalPrice?.toLocaleString()}원
                        </span>
                        <span style={{ fontSize: '14px', color: '#EF4444', fontWeight: '800' }}>
                          {discountRate}% 특별 할인
                        </span>
                      </div>
                    )}
                    
                    <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--navy-deep)', letterSpacing: '-0.02em' }}>
                      {product.price.toLocaleString()}원
                    </div>

                    {discountRate > 0 ? (
                      <p style={{ fontSize: '11px', color: '#EF4444', fontWeight: '700', marginTop: '8px' }}>
                        * 총 {(product.originalPrice - product.price).toLocaleString()}원 즉시 할인 적용됨
                      </p>
                    ) : (
                      <p style={{ fontSize: '11px', color: '#64748B', marginTop: '8px' }}>
                        * 멤버십 특별 우대가 적용
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Consultation CTA Button */}
              <button 
                className="sharp-btn-gold" 
                onClick={() => setIsBookingOpen(true)}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '14px', 
                  letterSpacing: '0.04em',
                  borderRadius: '0px'
                }}
              >
                전문 상담 신청하기
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '12px', marginBottom: 0 }}>
                * 전담 크루즈 컨시어지 상담 후 최종 예약이 확정됩니다.
              </p>
            </div>

            {/* Back to Product List Button Below Price Box */}
            <div style={{ marginTop: '14px' }}>
              <Link 
                to="/#packages" 
                className="sharp-btn-outline" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '8px', 
                  width: '100%',
                  padding: '14px 20px', 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  color: 'var(--navy-deep)', 
                  borderColor: '#CBD5E1', 
                  background: '#F8FAFC',
                  textDecoration: 'none',
                  borderRadius: '0px'
                }}
              >
                <ArrowLeft size={16} /> 추천 상품 목록으로 가기
              </Link>
            </div>

          </aside>

        </div>
      </div>
      
      {/* Mobile Fixed Bottom Floating Bar */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: '#FFFFFF',
          borderTop: '1px solid #CBD5E1',
          padding: '12px 18px',
          boxShadow: '0 -6px 24px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>
              {isSplit ? '스마트 후불 분할액' : (discountRate > 0 ? `${discountRate}% 특별할인가` : '회원 우대가')}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--navy-deep)', letterSpacing: '-0.02em' }}>
              {isSplit ? `월 ${monthlyAmount.toLocaleString()}원` : `${product.price.toLocaleString()}원`}
            </div>
          </div>
          <button 
            onClick={() => setIsBookingOpen(true)}
            className="sharp-btn-gold"
            style={{
              padding: '12px 22px',
              fontSize: '13px',
              fontWeight: '800',
              whiteSpace: 'nowrap',
              borderRadius: '0px'
            }}
          >
            전문 상담 신청
          </button>
        </div>
      )}

      {renderGalleryModal()}

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        productTitle={`[상세 페이지] ${product.title}`}
        accentColor="var(--accent-gold-dark)"
      />
    </div>
  );
};

export default ProductDetail;
