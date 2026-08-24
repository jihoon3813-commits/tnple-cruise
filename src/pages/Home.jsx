import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Ship, Calendar, Users, MapPin, CreditCard, ArrowRight, 
  ChevronRight, Star, Check, Sparkles, Compass, ShieldCheck, 
  Award, Coffee, Utensils, Anchor, PhoneCall, ArrowUpRight, ChevronLeft, Gift
} from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import SafeMedia from '../components/SafeMedia';
import BookingModal from '../components/BookingModal';

// --- Kensington 4-Equal Vivid Hero Data ---
const HERO_PANELS = [
  {
    id: 'cruise',
    enCategory: 'Cruise',
    korTitle: '동남아 럭셔리 크루즈',
    desc: '고객을 위해 엄선된 프리미엄 선박으로\n최상의 해상 여정을 선사해 드립니다',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_34_1_vmxjzd.png',
    IconComponent: Ship
  },
  {
    id: 'promotion',
    enCategory: 'Promotion',
    korTitle: '파격 특가 & 혜택',
    desc: '시즌 한정 파격 할인 혜택을 모아\n합리적인 가격으로 제안하는 프로모션',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_35_3_w0nsuf.png',
    IconComponent: Gift
  },
  {
    id: 'theme',
    enCategory: 'Theme',
    korTitle: '시그니처 미식 & 갈라',
    desc: '고객의 라이프 스타일에 맞추어\n티앤플에서 제안하는 차별화된 테마 상품',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_34_2_jupqnk.png',
    IconComponent: Sparkles
  },
  {
    id: 'package',
    enCategory: 'Package',
    korTitle: '1:1 VIP 컨시어지',
    desc: '국내 출발부터 기항지 투어까지\n한국인 전문 가이드가 선사하는 안심 올케어',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_35_4_uegadi.png',
    IconComponent: Award
  }
];

// --- Curated Packages Data ---
const CURATED_PACKAGES = [
  {
    id: 'pkg-1',
    badge: '티앤플 베스트셀러',
    title: '싱가포르 · 말레이시아 · 태국 5박 6일',
    subtitle: '싱가포르 마리나베이 출항 - 페낭 - 푸켓 에메랄드 비치 기항지 투어',
    ship: '로얄캐리비안 스펙트럼 오브 더 시즈',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    bookingPeriod: '예약기간 : 상시 접수 중',
    travelPeriod: '출발일정 : 매주 화/금 출발 (연중 운항)',
    price: '2,900,000원',
    postPay: '월 185,000원 (12개월)',
    features: ['발코니 오션뷰 객실', '전 일정 선상 뷔페 & 정찬', '기항지 한국인 가이드 투어']
  },
  {
    id: 'pkg-2',
    badge: '프리미엄 지중해',
    title: '지중해 클래식 그랜드 오디세이 8박 9일',
    subtitle: '이탈리아 로마 · 나폴리 · 프랑스 니스 · 스페인 바르셀로나 예술 항해',
    ship: 'MSC 월드 유로파 (21만 톤급 최신 선박)',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    bookingPeriod: '예약기간 : 2026.03.01 ~ 2026.11.30',
    travelPeriod: '출발일정 : 2026년 4월 ~ 11월 시즌 운항',
    price: '5,400,000원',
    postPay: '월 340,000원 (12개월)',
    features: ['지중해 4개국 기항지 올패스', '갈라 디너 3회 포함', '전담 VIP 컨시어지']
  },
  {
    id: 'pkg-3',
    badge: '가족 · 힐링 추천',
    title: '일본 오키나와 & 대만 에메랄드 4박 5일',
    subtitle: '나하 국제거리 - 이시가키섬 - 대만 지룽/타이베이 완벽 힐링 코스',
    ship: '프린세스 크루즈 다이아몬드호',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    bookingPeriod: '예약기간 : 2026.04.01 ~ 2026.10.31',
    travelPeriod: '출발일정 : 2026년 5월 ~ 10월 상시',
    price: '1,980,000원',
    postPay: '월 129,000원 (12개월)',
    features: ['부모님 효도 여행 1순위', '선상 천연 온천 스파', '무제한 음료 패키지']
  },
  {
    id: 'pkg-4',
    badge: '대자연 스페셜',
    title: '알래스카 빙하 피오르드 7박 8일',
    subtitle: '시애틀 출항 - 주노 - 스캐그웨이 - 엔디콧 암 빙하 파노라마',
    ship: '노르웨이지안 블리스호',
    image: 'https://images.unsplash.com/photo-1488441770602-aed21fc49bd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80',
    bookingPeriod: '예약기간 : 2026.05.01 ~ 2026.09.15',
    travelPeriod: '출발일정 : 2026년 6월 ~ 9월 한정 운항',
    price: '4,800,000원',
    postPay: '월 310,000원 (12개월)',
    features: ['빙하 전망 프라이빗 라운지', '고래 관찰 익스플로러 투어', '기항지 헬기 투어 지원']
  }
];

// --- Customer Reviews Data ---
const REAL_REVIEWS = [
  {
    id: 1,
    name: '김*현 고객님',
    route: '동남아 3개국 5박 6일 (싱가포르·말레이시아·태국)',
    rating: 5,
    date: '2026.02 이용',
    title: '목돈 부담 없이 다녀온 인생 최고의 여행이었습니다.',
    content: '부모님 칠순 기념으로 처음 크루즈를 준비했는데, 후불제 시스템 덕분에 부담 없이 예약할 수 있었습니다. 특히 한국인 전담 컨시어지 매니저님이 출국부터 기항지 투어까지 꼼꼼하게 챙겨주셔서 부모님이 너무 편안해하셨어요.',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: '박*서 고객님',
    route: '지중해 그랜드 오디세이 8박 9일',
    rating: 5,
    date: '2026.01 이용',
    title: '매일 아침 눈뜰 때마다 새로운 나라가 펼쳐지는 마법',
    content: '짐을 풀고 싸는 번거로움 없이 로마, 니스, 바르셀로나를 이동할 수 있어 정말 만족스러웠습니다. 선상 파인다이닝 코스 요리와 오션뷰 테라스에서 마시는 와인은 잊지 못할 추억이 되었습니다. 티앤플 멤버십 가입을 강력 추천합니다.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: '이*진 고객님',
    route: '일본 오키나와 & 대만 에메랄드 4박 5일',
    rating: 5,
    date: '2025.12 이용',
    title: '아이들과 함께한 완벽한 힐링 크루즈 휴가',
    content: '아이들이 수영장과 키즈 클럽 프로그램을 너무 좋아했고, 어른들은 선상 온천과 라운지에서 여유를 만끽했습니다. 여행 다녀와서 분할 납부로 정산하니 결제 부담도 전혀 없어서 다음엔 알래스카 코스로 또 가기로 했습니다.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  }
];

const Home = () => {
  const { config } = useConfig();
  const dbProducts = config?.products || [];

  const [activePanel, setActivePanel] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('티앤플 코리아 프리미엄 크루즈');

  // Quick Bar Form State
  const [searchDestination, setSearchDestination] = useState('동남아 3개국 (싱가포르·말레이시아·태국)');
  const [searchSchedule, setSearchSchedule] = useState('2026년 상반기 (3월~6월)');
  const [searchMembers, setSearchMembers] = useState('성인 2인');
  const [searchPayment, setSearchPayment] = useState('스마트 후불 분할 납부');

  // Normalize Admin Database Products to Kensington luxury grid format
  const displayPackages = (dbProducts && dbProducts.length > 0)
    ? dbProducts.map((p, idx) => {
        const thumb = p.thumbnails && p.thumbnails.length > 0 
          ? p.thumbnails[0] 
          : 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80';
        
        const isSplit = p.paymentType === 'split';
        const downPayment = p.downPayment || 0;
        const installments = p.installments || 12;
        const monthlyAmount = isSplit 
          ? Math.round((p.price - downPayment) / installments)
          : Math.round(p.price / 12);

        let badge = p.badge;
        if (!badge) {
          if (isSplit) badge = '스마트 후불제';
          else if (p.originalPrice && p.originalPrice > p.price) badge = '특별 할인 상품';
          else if (idx === 0) badge = '티앤플 베스트셀러';
          else badge = '티앤플 추천';
        }

        const ship = p.ship || (p.schedule && p.schedule.length > 0 
          ? `${p.schedule.length}일 올케어 여정` 
          : '로얄캐리비안 스펙트럼호');

        const features = (p.features && p.features.length > 0)
          ? p.features
          : (p.schedule && p.schedule.length > 0
              ? p.schedule.slice(0, 3).map(s => `${s.day}일차: ${s.title}`)
              : ['발코니 오션뷰 객실', '전 일정 선상 뷔페 & 정찬', '기항지 한국인 가이드 투어']);

        const bookingPeriod = p.bookingPeriod || '예약기간 : 상시 접수 중';
        const travelPeriod = p.travelPeriod || '출발일정 : 시즌 연중 운항';

        return {
          id: p.id || p._id,
          raw: p,
          isDb: true,
          badge,
          title: p.title,
          subtitle: p.description || '티앤플 코리아 멤버십 회원 전용 크루즈 패키지',
          ship,
          image: thumb,
          bookingPeriod,
          travelPeriod,
          price: `${p.price?.toLocaleString()}원`,
          originalPrice: p.originalPrice ? `${p.originalPrice.toLocaleString()}원` : null,
          postPay: `월 ${monthlyAmount.toLocaleString()}원 (${installments}개월)`,
          downPayment: isSplit && downPayment > 0 ? `(예약금 ${downPayment.toLocaleString()}원)` : null,
          features
        };
      })
    : CURATED_PACKAGES;

  const handleQuickConsultation = (e) => {
    e.preventDefault();
    setModalTitle(`${searchDestination} (${searchSchedule} / ${searchMembers} / ${searchPayment})`);
    setIsBookingModalOpen(true);
  };

  const handleOpenProductConsultation = (pkg) => {
    setModalTitle(`[추천 패키지] ${pkg.title}`);
    setIsBookingModalOpen(true);
  };

  return (
    <div style={{ background: '#FFFFFF', color: '#1A202C', minHeight: '100vh', paddingTop: '110px' }}>

      {/* =========================================================================
          1. KENSINGTON 4-EQUAL VIVID SPLIT HERO (첨부 켄싱턴 레퍼런스 스타일)
          ========================================================================= */}
      <section style={{ position: 'relative', width: '100%', height: 'calc(100vh - 110px)', minHeight: '620px', background: '#0B132B', overflow: 'hidden' }}>
        
        {/* 1A. DESKTOP 4 EQUAL VIVID PANELS */}
        <div className="hero-desktop-panels" style={{ display: 'flex', width: '100%', height: '100%' }}>
          {HERO_PANELS.map((panel, idx) => {
            const Icon = panel.IconComponent;
            return (
              <div
                key={panel.id}
                onClick={() => {
                  setModalTitle(`[메인] ${panel.korTitle} (${panel.enCategory})`);
                  setIsBookingModalOpen(true);
                }}
                className="kensington-hero-col"
                style={{
                  flex: 1,
                  position: 'relative',
                  height: '100%',
                  borderRight: idx < HERO_PANELS.length - 1 ? '1px solid rgba(255,255,255,0.25)' : 'none',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {/* Crisp Vivid Background Image */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  <img
                    src={panel.image}
                    alt={panel.korTitle}
                    className="hero-col-img"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.96)',
                      transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                  />
                  {/* Subtle Elegant Gradient: Keeps photo bright while text remains sharp */}
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to bottom, rgba(7, 13, 30, 0.45) 0%, rgba(7, 13, 30, 0.6) 26%, rgba(7, 13, 30, 0.08) 55%, rgba(7, 13, 30, 0.35) 100%)' 
                  }} />
                </div>

                {/* Upper-Center Kensington Icon & Typography */}
                <div style={{ 
                  position: 'absolute', 
                  top: '22%', 
                  left: '0', 
                  right: '0', 
                  zIndex: 10,
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  padding: '0 24px',
                  pointerEvents: 'none'
                }}>
                  {/* White Minimalist Icon */}
                  <div style={{ 
                    width: '52px', 
                    height: '52px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: '#FFFFFF',
                    filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.85))',
                    marginBottom: '8px'
                  }}>
                    <Icon size={38} strokeWidth={1.4} />
                  </div>

                  {/* English Serif Title */}
                  <h2 style={{ 
                    fontFamily: "'Cinzel', 'Noto Serif KR', serif", 
                    fontSize: '28px', 
                    fontWeight: '700', 
                    color: '#FFFFFF', 
                    letterSpacing: '0.06em', 
                    margin: '0 0 8px 0',
                    textShadow: '0 2px 12px rgba(0,0,0,0.9)'
                  }}>
                    {panel.enCategory}
                  </h2>

                  {/* Korean Subtitle / Description */}
                  <p style={{ 
                    fontFamily: "'Pretendard', sans-serif", 
                    fontSize: '13px', 
                    fontWeight: '400', 
                    color: 'rgba(255,255,255,0.92)', 
                    lineHeight: '1.6', 
                    whiteSpace: 'pre-line',
                    textShadow: '0 2px 8px rgba(0,0,0,0.95)',
                    margin: 0
                  }}>
                    {panel.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* 1B. MOBILE 2x2 CRISP GRID */}
        <div className="hero-mobile-slider" style={{ display: 'none', height: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', height: '100%', width: '100%' }}>
            {HERO_PANELS.map((panel, idx) => {
              const Icon = panel.IconComponent;
              return (
                <div
                  key={panel.id}
                  onClick={() => {
                    setModalTitle(`[메인] ${panel.korTitle} (${panel.enCategory})`);
                    setIsBookingModalOpen(true);
                  }}
                  style={{
                    position: 'relative',
                    height: '100%',
                    minHeight: '270px',
                    borderRight: idx % 2 === 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={panel.image}
                    alt={panel.korTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.92)' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(7, 13, 30, 0.5) 0%, rgba(7, 13, 30, 0.7) 35%, rgba(7, 13, 30, 0.2) 100%)'
                  }} />
                  
                  <div style={{
                    position: 'absolute',
                    top: '18%',
                    left: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '0 12px',
                    zIndex: 10
                  }}>
                    <Icon size={28} strokeWidth={1.4} color="#FFFFFF" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.8))' }} />
                    <h3 style={{
                      fontFamily: "'Cinzel', 'Noto Serif KR', serif",
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      letterSpacing: '0.06em',
                      margin: '6px 0 4px 0',
                      textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                    }}>
                      {panel.enCategory}
                    </h3>
                    <p style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.92)',
                      lineHeight: '1.4',
                      whiteSpace: 'pre-line',
                      textShadow: '0 2px 6px rgba(0,0,0,0.95)',
                      margin: 0
                    }}>
                      {panel.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* =========================================================================
          2. INTEGRATED QUICK BOOKING & ESTIMATE BAR (각진 퀵 검색/견적 바)
          ========================================================================= */}
      <section style={{ position: 'relative', zIndex: 30, background: '#F8F9FA', borderBottom: '1px solid #E2E8F0', padding: '24px 0' }}>
        <div className="container">
          <form onSubmit={handleQuickConsultation} className="kensington-quick-bar-grid">
            
            {/* Field 1: Destination */}
            <div style={{ background: '#FFFFFF', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--navy-deep)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--accent-gold-dark)" /> 희망 여행지 / 노선
              </label>
              <select 
                value={searchDestination} 
                onChange={(e) => setSearchDestination(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                <option value="동남아 3개국 (싱가포르·말레이시아·태국)">동남아 3개국 (싱가포르·말레이시아·태국)</option>
                <option value="지중해 클래식 (이탈리아·프랑스·스페인)">지중해 클래식 (이탈리아·프랑스·스페인)</option>
                <option value="일본 오키나와 & 대만 에메랄드">일본 오키나와 & 대만 에메랄드</option>
                <option value="알래스카 빙하 피오르드">알래스카 빙하 피오르드</option>
              </select>
            </div>

            {/* Field 2: Schedule */}
            <div style={{ background: '#FFFFFF', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--navy-deep)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} color="var(--accent-gold-dark)" /> 희망 출발 시기
              </label>
              <select 
                value={searchSchedule} 
                onChange={(e) => setSearchSchedule(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                <option value="2026년 상반기 (3월~6월)">2026년 상반기 (3월~6월)</option>
                <option value="2026년 여름 성수기 (7월~8월)">2026년 여름 성수기 (7월~8월)</option>
                <option value="2026년 가을 시즌 (9월~11월)">2026년 가을 시즌 (9월~11월)</option>
                <option value="2026-2027 겨울 방학 시즌">2026-2027 겨울 방학 시즌</option>
              </select>
            </div>

            {/* Field 3: Members */}
            <div style={{ background: '#FFFFFF', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--navy-deep)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={13} color="var(--accent-gold-dark)" /> 여행 인원
              </label>
              <select 
                value={searchMembers} 
                onChange={(e) => setSearchMembers(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                <option value="성인 2인 (부부/커플)">성인 2인 (부부/커플)</option>
                <option value="가족 (성인2 + 아동1~2)">가족 (성인2 + 아동1~2)</option>
                <option value="부모님 동반 (3~4인)">부모님 동반 (3~4인)</option>
                <option value="단체/모임 (5인 이상)">단체/모임 (5인 이상)</option>
              </select>
            </div>

            {/* Field 4: Payment Plan */}
            <div style={{ background: '#FFFFFF', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--navy-deep)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={13} color="var(--accent-gold-dark)" /> 결제 방식 선택
              </label>
              <select 
                value={searchPayment} 
                onChange={(e) => setSearchPayment(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                <option value="스마트 후불 분할 납부">스마트 후불 분할 납부</option>
                <option value="멤버십 일시불 특별 우대">멤버십 일시불 특별 우대</option>
                <option value="맞춤 상담 후 결정">맞춤 상담 후 결정</option>
              </select>
            </div>

            {/* Submit Button (Sharp Navy Kensington Style) */}
            <button 
              type="submit" 
              className="sharp-btn-dark"
              style={{ width: '100%', height: '100%', minHeight: '64px', fontSize: '14px', letterSpacing: '0.04em' }}
            >
              상담 예약
            </button>

          </form>
        </div>
      </section>

      {/* =========================================================================
          3. KENSINGTON EDITORIAL THEME SECTION (기획전 & 테마 배너)
          ========================================================================= */}
      <section style={{ padding: '90px 0', background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
        <div className="container">
          
          <div className="kensington-editorial-grid">
            
            {/* Left Editorial Text Column */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
                  T&PLE SPECIAL CURATION
                </span>
                <h2 style={{ 
                  fontFamily: "'Pretendard', sans-serif", 
                  fontSize: '34px', 
                  fontWeight: '800', 
                  color: 'var(--navy-deep)', 
                  lineHeight: '1.2', 
                  marginTop: '10px', 
                  marginBottom: '16px' 
                }}>
                  T&PLE KOREA<br />
                  <span style={{ fontStyle: 'italic', color: 'var(--accent-gold-dark)' }}>Theme Journey</span>
                </h2>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
                  고객의 품격 있는 라이프스타일에 맞추어 티앤플 코리아에서 특별히 기획한 테마 크루즈 여정입니다.
                </p>
              </div>

              {/* Promo Banner Card (Sharp Kensington Style) */}
              <div style={{ 
                background: 'var(--bg-warm)', 
                border: '1px solid #E2D9C8', 
                padding: '24px', 
                position: 'relative' 
              }}>
                <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--accent-gold-dark)', letterSpacing: '0.08em' }}>EXCLUSIVE BENEFIT</span>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '4px', marginBottom: '8px' }}>
                  2026 얼리버드 선상 크레딧
                </h4>
                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.6' }}>
                  지금 상담 예약하시는 고객님께 객실당 최대 50만원 상당의 선상 크레딧 바우처를 지원합니다.
                </p>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to="/service" style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    멤버십 혜택 보기 <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Center Featured Editorial Banner 1 (동남아 오션 테라피) */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: '380px', border: '1px solid #E2E8F0' }}>
              <img 
                src="https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="동남아 럭셔리 크루즈 테마" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(11, 19, 43, 0.9) 0%, rgba(11, 19, 43, 0.2) 60%, transparent 100%)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>FEATURED THEME 01</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '6px', marginBottom: '8px' }}>
                  동남아 에메랄드 힐링 항해
                </h3>
                <p style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  싱가포르 야경부터 페낭의 역사 문화, 푸켓의 청정 해변까지 이어지는 올케어 힐링 코스
                </p>
                <button 
                  onClick={() => { setModalTitle("동남아 에메랄드 힐링 항해 (기획전)"); setIsBookingModalOpen(true); }}
                  className="sharp-btn-gold" 
                  style={{ alignSelf: 'flex-start', padding: '10px 20px', fontSize: '12px' }}
                >
                  기획전 자세히 보기
                </button>
              </div>
            </div>

            {/* Right Featured Editorial Banner 2 (지중해 파인다이닝) */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: '380px', border: '1px solid #E2E8F0' }}>
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="지중해 미식 크루즈" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(11, 19, 43, 0.9) 0%, rgba(11, 19, 43, 0.2) 60%, transparent 100%)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>FEATURED THEME 02</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '6px', marginBottom: '8px' }}>
                  지중해 미식 & 와인 갈라
                </h3>
                <p style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  이탈리아·프랑스 최고급 와이너리 테이스팅과 셰프 특선 갈라 디너의 향연
                </p>
                <button 
                  onClick={() => { setModalTitle("지중해 미식 & 와인 갈라 (기획전)"); setIsBookingModalOpen(true); }}
                  className="sharp-btn-white" 
                  style={{ alignSelf: 'flex-start', padding: '10px 20px', fontSize: '12px' }}
                >
                  기획전 자세히 보기
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. CURATED PACKAGES GRID (티앤플이 추천하는 패키지 - Kensington Style)
          ========================================================================= */}
      <section id="packages" style={{ padding: '100px 0', background: '#F8F9FA' }}>
        <div className="container">
          
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', borderBottom: '2px solid var(--navy-deep)', paddingBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
                CURATED CRUISE PACKAGES
              </span>
              <h2 style={{ 
                fontFamily: "'Pretendard', sans-serif", 
                fontSize: '32px', 
                fontWeight: '800', 
                color: 'var(--navy-deep)', 
                marginTop: '6px',
                letterSpacing: '-0.02em'
              }}>
                티앤플이 추천하는 패키지
              </h2>
            </div>
            <button 
              onClick={() => { setModalTitle("전체 크루즈 패키지 맞춤 견적"); setIsBookingModalOpen(true); }}
              style={{ background: 'none', border: 'none', fontSize: '13px', fontWeight: '700', color: 'var(--navy-deep)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              전체 패키지 문의 <ArrowUpRight size={16} />
            </button>
          </div>

          {/* 4-Card Sharp Grid */}
          <div className="kensington-packages-grid">
            {displayPackages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="sharp-card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                }}
              >
                {/* Photo & Badge */}
                <Link to={pkg.isDb ? `/product/${pkg.id}` : '#'} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                    <SafeMedia 
                      src={pkg.image} 
                      alt={pkg.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    />
                    <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, background: 'var(--navy-deep)', color: 'var(--accent-gold)', fontSize: '10px', fontWeight: '800', padding: '4px 10px', letterSpacing: '0.05em' }}>
                      {pkg.badge}
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', zIndex: 10, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)', padding: '12px 16px', color: '#fff', fontSize: '11px', fontWeight: '600' }}>
                      {pkg.ship}
                    </div>
                  </div>
                </Link>

                {/* Card Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <Link to={pkg.isDb ? `/product/${pkg.id}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--navy-deep)', lineHeight: '1.4', marginBottom: '8px', fontFamily: "'Pretendard', sans-serif", transition: 'color 0.2s' }}>
                        {pkg.title}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.6', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {pkg.subtitle}
                    </p>

                    <div style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '12px 0', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#475569' }}>
                      <div>📅 {pkg.bookingPeriod}</div>
                      <div>🚢 {pkg.travelPeriod}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--accent-gold-dark)' }}>▪</span> {feat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Buttons */}
                  <div>
                    <div style={{ background: '#F8FAFC', padding: '12px 14px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B' }}>
                        <span>스마트 후불제</span>
                        <span style={{ fontWeight: '800', color: 'var(--accent-gold-dark)', fontSize: '13px' }}>{pkg.postPay}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>총 상품가</span>
                        <span style={{ fontSize: '15px', fontWeight: '900', color: 'var(--navy-deep)' }}>{pkg.price}</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: pkg.isDb ? '1fr 1fr' : '1fr', gap: '8px' }}>
                      {pkg.isDb && (
                        <Link 
                          to={`/product/${pkg.id}`}
                          className="sharp-btn-outline"
                          style={{ textAlign: 'center', padding: '11px 0', fontSize: '12px', color: 'var(--navy-deep)', textDecoration: 'none', fontWeight: '700' }}
                        >
                          상세보기
                        </Link>
                      )}
                      <button 
                        onClick={() => handleOpenProductConsultation(pkg)}
                        className="sharp-btn-dark"
                        style={{ width: '100%', padding: '11px 0', fontSize: '12px' }}
                      >
                        상담 신청
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. KENSINGTON SIGNATURE SERVICES (티앤플 시그니처 서비스)
          ========================================================================= */}
      <section id="membership" style={{ padding: '100px 0', background: '#FFFFFF' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
              SIGNATURE BENEFITS
            </span>
            <h2 style={{ 
              fontFamily: "'Pretendard', sans-serif", 
              fontSize: '32px', 
              fontWeight: '800', 
              color: 'var(--navy-deep)', 
              marginTop: '6px' 
            }}>
              티앤플 시그니처 서비스
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginTop: '10px' }}>
              오직 티앤플 코리아 멤버십 회원만을 위해 완성된 3대 핵심 프리미엄 가치
            </p>
          </div>

          <div className="kensington-signature-grid">
            
            {/* Service 1: Gourmet Dining */}
            <div style={{ position: 'relative', height: '420px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="미식의 정점" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(7, 13, 30, 0.95) 0%, rgba(7, 13, 30, 0.3) 50%, transparent 100%)',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <div style={{ width: '36px', height: '36px', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '16px' }}>
                  <Utensils size={18} />
                </div>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>01. FINE DINING</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
                  미식의 정점 & 파인다이닝
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: '1.6' }}>
                  세계적인 마스터 셰프가 선사하는 선상 정찬 코스와 매일 새롭게 펼쳐지는 글로벌 뷔페 다이닝
                </p>
              </div>
            </div>

            {/* Service 2: Dedicated Concierge */}
            <div style={{ position: 'relative', height: '420px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="전담 컨시어지 케어" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(7, 13, 30, 0.95) 0%, rgba(7, 13, 30, 0.3) 50%, transparent 100%)',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <div style={{ width: '36px', height: '36px', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '16px' }}>
                  <Award size={18} />
                </div>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>02. VIP CONCIERGE</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
                  1:1 전담 컨시어지 올케어
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: '1.6' }}>
                  국내 출발부터 기항지 투어, 귀국까지 한국인 전문 가이드가 언어와 동선 걱정 없이 안전하게 밀착 동행
                </p>
              </div>
            </div>

            {/* Service 3: Special Benefits & Discounts */}
            <div style={{ position: 'relative', height: '420px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <img 
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="멤버십 특별 우대 및 파격 할인 혜택" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(7, 13, 30, 0.95) 0%, rgba(7, 13, 30, 0.3) 50%, transparent 100%)',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <div style={{ width: '36px', height: '36px', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)', marginBottom: '16px' }}>
                  <ShieldCheck size={18} />
                </div>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>03. EXCLUSIVE BENEFITS</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px', marginBottom: '8px' }}>
                  멤버십 특별 우대 & 파격 할인
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '13px', lineHeight: '1.6' }}>
                  시즌 한정 파격 할인과 객실당 최대 50만원 상당 선상 크레딧, 동반 할인 등 차별화된 멤버십 특전
                </p>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link to="/service" className="sharp-btn-gold" style={{ padding: '14px 36px', fontSize: '14px' }}>
              서비스 및 멤버십 상세 보기 <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. REAL CUSTOMER REVIEWS (생생한 고객 여행후기)
          ========================================================================= */}
      <section id="reviews" style={{ padding: '100px 0', background: '#F8F9FA', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', borderBottom: '2px solid var(--navy-deep)', paddingBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
                VOYAGER STORIES
              </span>
              <h2 style={{ 
                fontFamily: "'Pretendard', sans-serif", 
                fontSize: '32px', 
                fontWeight: '800', 
                color: 'var(--navy-deep)', 
                marginTop: '6px' 
              }}>
                생생한 고객 여행후기
              </h2>
            </div>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              평균 만족도 4.9 / 5.0 ({config?.reviews?.length ? `${config.reviews.length}개 등록` : '2,400+ 회원 이용'})
            </span>
          </div>

          <div className="kensington-reviews-grid">
            {(config?.reviews && config.reviews.length > 0 ? config.reviews : REAL_REVIEWS).map((rev, rIdx) => {
              const authorName = rev.author || rev.user || rev.name || '고객님';
              const rating = rev.rating || 5;
              const route = rev.productTitle || rev.route || '동남아 럭셔리 크루즈';
              const date = rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : (rev.date || '최근 이용');
              const title = rev.title || (rev.content.length > 25 ? `${rev.content.slice(0, 25)}...` : rev.content);

              return (
                <div key={rev.id || rev._id || rIdx} className="sharp-card" style={{ background: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '2px', color: '#EAB308' }}>
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} size={15} fill="#EAB308" />
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{date}</span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--navy-deep)', lineHeight: '1.4', marginBottom: '12px', fontFamily: "'Pretendard', sans-serif" }}>
                      "{title}"
                    </h4>

                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', marginBottom: '24px' }}>
                      {rev.content}
                    </p>

                    {rev.images && rev.images.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
                        {rev.images.map((img, iIdx) => (
                          <SafeMedia 
                            key={iIdx} 
                            src={img} 
                            alt={`후기 이미지 ${iIdx + 1}`} 
                            style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E2E8F0' }} 
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--navy-deep)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>
                      {authorName[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--navy-deep)' }}>{authorName}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{route}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. BOTTOM LUXURY CALL-TO-ACTION BANNER
          ========================================================================= */}
      <section style={{ background: 'var(--navy-deep)', color: '#FFFFFF', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              RESERVE YOUR VOYAGE
            </span>
            <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '32px', fontWeight: '800', marginTop: '8px', marginBottom: '12px' }}>
              크루즈 여행, 더 이상 망설이지 마세요.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>
              전담 크루즈 컨시어지가 맞춤 여정 설계부터 후불 결제 승인까지 원스톱으로 안내해 드립니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => { setModalTitle("티앤플 코리아 1:1 맞춤 견적 및 상담"); setIsBookingModalOpen(true); }}
              className="sharp-btn-gold" 
              style={{ padding: '16px 36px', fontSize: '14px' }}
            >
              1:1 무료 상담 신청하기 <ArrowRight size={16} />
            </button>
            <Link 
              to="/service" 
              className="sharp-btn-outline" 
              style={{ padding: '16px 30px', fontSize: '14px', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              서비스 안내서 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        productTitle={modalTitle}
        accentColor="var(--accent-gold-dark)"
      />

    </div>
  );
};

export default Home;
