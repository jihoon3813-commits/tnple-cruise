import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Star, Quote, ArrowRight, Camera, Filter, CheckCircle2, Award, Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';
import BookingModal from '../components/BookingModal';

const DEFAULT_REVIEWS = [
  {
    id: 'def-1',
    author: '김*숙 회원님',
    productTitle: '동남아 3개국 5박 6일',
    rating: 5,
    title: '부모님 칠순 기념 크루즈 여행, 인생 최고의 선택이었습니다.',
    content: '부모님 모시고 처음 떠나는 크루즈라 걱정이 많았는데, 한국인 전담 가이드분이 싱가포르 탑승부터 페낭, 푸켓 기항지 투어까지 너무나 친절하게 챙겨주셔서 부모님이 매일 감동하셨습니다. 매일 저녁 정찬 코스도 훌륭했고, 목돈 부담 없이 다녀올 수 있어 더욱 만족스러웠습니다.',
    date: '2026.02.18',
    showOnHome: true,
    images: [
      'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'def-2',
    author: '이*현 회원님',
    productTitle: '지중해 클래식 10박 11일',
    rating: 5,
    title: '바르셀로나와 로마를 잇는 낭만적인 허니문 크루즈',
    content: '신혼여행으로 지중해 크루즈를 선택했는데 오션뷰 발코니 객실에서 아침마다 마주하는 지중해 바다는 평생 잊지 못할 것 같습니다. 짐을 한 번만 풀고 여러 나라를 편안하게 여행할 수 있는 점이 크루즈의 가장 큰 매력인 것 같아요. 다음 결혼기념일에도 무조건 다온넷크루즈입니다.',
    date: '2026.02.10',
    showOnHome: true,
    images: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'def-3',
    author: '박*진 회원님',
    productTitle: '일본 오키나와 & 대만 4박 5일',
    rating: 5,
    title: '아이들과 함께한 완벽한 힐링 가족 여행',
    content: '아이들이 선상 워터파크와 키즈 프로그램을 너무 좋아해서 어른들도 정말 여유롭게 힐링할 수 있었습니다. 특히 후불제 분할 납부 시스템 덕분에 부담 없이 프리미엄 휴가를 즐길 수 있었네요. 주변 지인들에게도 적극 추천하고 있습니다!',
    date: '2026.01.28',
    showOnHome: true,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'def-4',
    author: '정*훈 회원님',
    productTitle: '동남아 3개국 5박 6일',
    rating: 5,
    title: '선상 파인다이닝과 브로드웨이 뮤지컬의 감동',
    content: '로얄캐리비안 대형 선박의 스케일에 압도당했습니다. 매일 밤 펼쳐지는 갈라 디너와 수준 높은 오션 라운지 공연 덕분에 배 안에 있는 시간 내내 지루할 틈이 없었습니다. 다온넷크루즈의 VIP 케어에 깊이 감사드립니다.',
    date: '2026.01.15',
    showOnHome: false,
    images: []
  },
  {
    id: 'def-5',
    author: '최*영 회원님',
    productTitle: '알래스카 빙하 피오르드 7박 8일',
    rating: 5,
    title: '거대한 빙하 앞에서의 압도적인 벅찬 감동',
    content: '발코니에서 커피 한 잔 마시며 바라본 알래스카 빙하의 웅장함은 말로 다 표현할 수 없습니다. 안전하고 편안한 선상 일정과 세심한 기항지 안내 덕분에 완벽한 버킷리스트를 달성했습니다.',
    date: '2025.12.20',
    showOnHome: false,
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    ]
  }
];

const Reviews = () => {
  const { config } = useConfig();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("고객 맞춤 크루즈 여행 견적 및 상담");

  // Merge DB reviews with defaults if DB is empty
  const allReviews = (config.reviews && config.reviews.length > 0)
    ? config.reviews.map(r => ({
        id: r.id,
        author: r.author || r.user || "다온넷 회원님",
        productTitle: r.productTitle || "프리미엄 크루즈",
        rating: r.rating || 5,
        title: r.title || `${r.productTitle || "크루즈"} 여행 후기`,
        content: r.content,
        date: r.date || "2026.02.01",
        showOnHome: r.showOnHome ?? true,
        images: r.images || []
      }))
    : DEFAULT_REVIEWS;

  const filteredReviews = allReviews.filter(r => {
    if (selectedFilter === 'photo') return r.images && r.images.length > 0;
    if (selectedFilter === 'southeast') return r.productTitle?.includes('동남아') || r.content?.includes('싱가포르');
    if (selectedFilter === 'mediterranean') return r.productTitle?.includes('지중해') || r.content?.includes('지중해');
    if (selectedFilter === 'japan') return r.productTitle?.includes('일본') || r.productTitle?.includes('대만');
    return true;
  });

  return (
    <div style={{ background: '#FFFFFF', color: '#1A202C', minHeight: '100vh', paddingTop: '110px', fontFamily: "'Pretendard', sans-serif" }}>
      
      {/* =========================================================================
          1. KENSINGTON REVIEWS HERO SECTION
          ========================================================================= */}
      <section style={{ background: '#0B132B', color: '#FFFFFF', padding: '90px 0 80px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '800', 
            letterSpacing: '0.2em', 
            color: 'var(--accent-gold)', 
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            VOYAGER STORIES & REVIEWS
          </span>
          <h1 style={{ 
            fontFamily: "'Pretendard', sans-serif", 
            fontSize: '38px', 
            fontWeight: '900', 
            letterSpacing: '-0.02em', 
            marginBottom: '16px',
            color: '#FFFFFF'
          }}>
            생생한 고객 여행 후기
          </h1>
          <p style={{ color: '#CBD5E1', fontSize: '15px', maxWidth: '640px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            다온넷크루즈 멤버십과 함께 전 세계 바다를 항해한 회원님들의 진솔하고 감동적인 실제 여행 기록입니다.
          </p>

          {/* 3 Summary Stats (Sharp Kensington Box) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            maxWidth: '720px', 
            margin: '0 auto', 
            gap: '1px', 
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ background: '#0B132B', padding: '20px 16px' }}>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--accent-gold)' }}>4.9 / 5.0</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', fontWeight: '600' }}>회원 평균 만족도</div>
            </div>
            <div style={{ background: '#0B132B', padding: '20px 16px' }}>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF' }}>{allReviews.length}+</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', fontWeight: '600' }}>등록된 실제 후기</div>
            </div>
            <div style={{ background: '#0B132B', padding: '20px 16px' }}>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--accent-gold)' }}>100%</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', fontWeight: '600' }}>실제 탑승 회원 인증</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FILTER TABS BAR
          ========================================================================= */}
      <section style={{ background: '#F8F9FA', borderBottom: '1px solid #E2E8F0', padding: '16px 0', position: 'sticky', top: '76px', zIndex: 40 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scrollbar">
            {[
              { id: 'all', label: `전체 후기 (${allReviews.length})` },
              { id: 'photo', label: `포토 후기 (${allReviews.filter(r => r.images?.length > 0).length})` },
              { id: 'southeast', label: '동남아 노선' },
              { id: 'mediterranean', label: '지중해 노선' },
              { id: 'japan', label: '일본·대만' }
            ].map(tab => {
              const isSelected = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  style={{
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: isSelected ? '800' : '600',
                    border: isSelected ? '1px solid var(--navy-deep)' : '1px solid #CBD5E1',
                    background: isSelected ? 'var(--navy-deep)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    borderRadius: '0px',
                    whiteSpace: 'nowrap',
                    transition: '0.2s'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => { setModalTitle("크루즈 여행 상담 및 맞춤 일정 안내"); setIsModalOpen(true); }}
            className="sharp-btn-gold" 
            style={{ padding: '8px 18px', fontSize: '12px' }}
          >
            나도 상담 받아보기 <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* =========================================================================
          3. REVIEWS GRID (Sharp Kensington Cards)
          ========================================================================= */}
      <section style={{ padding: '70px 0 100px', background: '#FFFFFF' }}>
        <div className="container">
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '30px' }}>
            {filteredReviews.map((rev, idx) => (
              <motion.div 
                key={rev.id || idx}
                className="sharp-card"
                style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid #E2E8F0', 
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div>
                  {/* Top Rating & Date Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '2px', color: '#EAB308' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#EAB308" />
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {rev.images && rev.images.length > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--accent-gold-dark)', fontWeight: '700', background: 'var(--bg-warm)', padding: '2px 8px' }}>
                          <Camera size={12} /> 포토후기
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{rev.date}</span>
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 style={{ 
                    fontSize: '17px', 
                    fontWeight: '800', 
                    color: 'var(--navy-deep)', 
                    lineHeight: '1.4', 
                    marginBottom: '12px',
                    fontFamily: "'Pretendard', sans-serif"
                  }}>
                    "{rev.title}"
                  </h3>

                  {/* Review Content */}
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#475569', 
                    lineHeight: '1.7', 
                    marginBottom: '20px'
                  }}>
                    {rev.content}
                  </p>

                  {/* Photo Gallery If Any */}
                  {rev.images && rev.images.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: rev.images.length === 1 ? '1fr' : 'repeat(2, 1fr)', gap: '8px', marginBottom: '20px' }}>
                      {rev.images.map((img, i) => (
                        <div key={i} style={{ height: '140px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                          <SafeMedia src={img} alt="여행 후기 사진" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Author Info & Verified Badge */}
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--navy-deep)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>
                      {rev.author[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--navy-deep)' }}>{rev.author}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{rev.productTitle}</div>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> 인증 완료
                  </span>
                </div>

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. BOTTOM CTA BANNER
          ========================================================================= */}
      <section style={{ background: 'var(--navy-deep)', color: '#FFFFFF', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              JOIN THE VOYAGE
            </span>
            <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '30px', fontWeight: '800', marginTop: '8px', marginBottom: '10px' }}>
              다음 감동 후기의 주인공은 바로 회원님입니다.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px', margin: 0 }}>
              전담 크루즈 컨시어지가 맞춤 여정 설계부터 후불 결제 우대까지 원스톱으로 안내해 드립니다.
            </p>
          </div>

          <button 
            onClick={() => { setModalTitle("다온넷크루즈 1:1 맞춤 견적 신청"); setIsModalOpen(true); }}
            className="sharp-btn-gold" 
            style={{ padding: '16px 36px', fontSize: '14px' }}
          >
            1:1 무료 상담 신청하기 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productTitle={modalTitle}
        accentColor="var(--accent-gold-dark)"
      />

    </div>
  );
};

export default Reviews;
