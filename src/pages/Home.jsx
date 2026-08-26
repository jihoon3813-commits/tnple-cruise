import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Ship, Calendar, Users, MapPin, CreditCard, ArrowRight, 
  ChevronRight, Star, Check, Sparkles, Compass, ShieldCheck, 
  Award, Coffee, Utensils, Anchor, PhoneCall, ArrowUpRight, ChevronLeft, Gift,
  CheckCircle2, ChevronDown, ChevronUp, LayoutGrid, Square
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
    desc: '엄선된 프리미엄 선박으로\n최상의 해상 여정을 선사합니다',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_34_1_vmxjzd.png',
    hoverImage: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787557770/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_48_28_1_wxq2vb.png',
    IconComponent: Ship
  },
  {
    id: 'promotion',
    enCategory: 'Promotion',
    korTitle: '파격 특가 & 혜택',
    desc: '시즌 한정 파격 특별 혜택\n합리적인 가격의 프로모션',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_35_3_w0nsuf.png',
    hoverImage: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787557771/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_48_29_2_ko38qv.png',
    IconComponent: Gift
  },
  {
    id: 'theme',
    enCategory: 'Theme',
    korTitle: '시그니처 미식 & 갈라',
    desc: '라이프 스타일에 맞춘\n차별화된 시그니처 테마 상품',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_34_2_jupqnk.png',
    hoverImage: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787557771/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_48_32_3_j1ds99.png',
    IconComponent: Compass
  },
  {
    id: 'package',
    enCategory: 'Package',
    korTitle: '1:1 VIP 컨시어지',
    desc: '출발부터 기항지 투어까지\n전문 가이드의 안심 올케어',
    image: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787555800/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_15_35_4_uegadi.png',
    hoverImage: 'https://res.cloudinary.com/lyjyvy54/image/upload/v1787557771/ChatGPT_Image_2026%EB%85%84_8%EC%9B%94_24%EC%9D%BC_%EC%98%A4%ED%9B%84_04_48_35_4_rcrgyx.png',
    IconComponent: Award
  }
];

// --- Curated Packages Data ---
const CURATED_PACKAGES = [
  {
    id: 'pkg-1',
    badge: '다온넷 베스트셀러',
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

// --- 4 Exclusive Service Pillars (서비스 소개) ---
const SERVICE_PILLARS = [
  {
    number: '01',
    title: '멤버십 특별 우대 & 파격 할인 혜택',
    subtitle: '시즌 한정 파격 할인과 선상 크레딧 등 독점 우대 혜택',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '다온넷크루즈 멤버십 고객님만을 위해 최고급 크루즈 여정을 가장 합리적인 특가로 제안합니다. 조기 예약 할인, 다인원 동반 할인, 특별 선상 크레딧 바우처 지원 등 풍성한 할인 혜택을 통해 프리미엄 크루즈를 최고의 가치로 경험하실 수 있습니다.',
    points: [
      '얼리버드 조기 예약 시즌 특별 할인',
      '가족·단체 동반 시 추가 할인 프로모션',
      '객실당 최대 50만원 선상 크레딧 지원'
    ]
  },
  {
    number: '02',
    title: '1:1 전담 VIP 컨시어지 올케어',
    subtitle: '출국부터 기항지 투어, 귀국까지 한국인 전문 매니저 밀착 동행',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '처음 크루즈를 경험하시거나 외국어 소통이 부담스러우신 고객님을 위해, 국내 공항 출국부터 기항지 투어 및 귀국까지 한국인 전문 컨시어지가 100% 밀착 동행합니다. 선상 시설 이용, 갈라 디너 예약, 기항지 투어까지 원스톱으로 케어해 드립니다.',
    points: [
      '국제공항 전용 미팅 & 그룹 수속 지원',
      '기항지별 한국인 전담 가이드 동행',
      '선상 생활 24시간 한국어 핫라인 케어'
    ]
  },
  {
    number: '03',
    title: '올인클루시브 선상 라이프 & 파인다이닝',
    subtitle: '미슐랭 스타 셰프의 정찬, 엔터테인먼트, 웰니스가 모두 포함',
    icon: Utensils,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '초대형 럭셔리 크루즈 선상에서 펼쳐지는 최고급 미식의 향연. 매일 밤 제공되는 정찬 코스 요리와 세계 각국의 요리를 맛볼 수 있는 글로벌 뷔페, 브로드웨이급 오리지널 뮤지컬 공연, 수영장과 스파 시설이 올인클루시브로 기본 제공됩니다.',
    points: [
      '전 일정 정찬 레스토랑 & 뷔페 식사 무료',
      '대극장 갈라 쇼 & 브로드웨이 뮤지컬 관람',
      '수영장·자쿠지·피트니스 무제한 이용'
    ]
  },
  {
    number: '04',
    title: '멤버십 회원 독점 특전 & 바우처',
    subtitle: '선상 크레딧, 객실 업그레이드, 면세점 바우처 등 VIP 혜택',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '다온넷크루즈 멤버십 회원만을 위한 차별화된 혜택입니다. 시즌별 객실 무료 업그레이드 기회는 물론, 선상에서 현금처럼 사용 가능한 선상 크레딧(OBC) 바우처 지원, 직계 가족 동반 할인 등 품격 높은 특전을 상시 제공합니다.',
    points: [
      '발코니 오션뷰 객실 우선 배정 혜택',
      '선상 크레딧(OBC) 바우처 전원 증정',
      '직계 가족 동반 시 추가 할인 및 적립'
    ]
  }
];

// --- 4-Step How It Works (이용 프로세스) ---
const STEPS = [
  { step: '01', title: '1:1 맞춤 상담 신청', desc: '온라인 또는 유선으로 희망 노선, 여행 일정, 인원을 접수합니다.' },
  { step: '02', title: '여정 설계 & 특별 혜택 적용', desc: '전문 컨시어지가 고객님께 맞는 최적의 객실과 맞춤 할인 혜택을 적용합니다.' },
  { step: '03', title: '설레는 크루즈 여행', desc: '공항 출국부터 기항지 투어까지 한국인 인솔자의 케어를 받으며 여행합니다.' },
  { step: '04', title: '완벽한 여행 & 사후 케어', desc: '설레는 크루즈 여행을 마치신 후에도 지속적인 멤버십 특전과 차기 할인 혜택을 제공합니다.' }
];

// --- FAQ Data (자주 묻는 질문) ---
const FAQS = [
  {
    q: '다온넷크루즈 멤버십 특별 할인은 어떻게 적용되나요?',
    a: '상담 신청 시 희망하시는 일정과 인원에 따라 얼리버드 조기 예약 할인, 동반 인원 추가 할인, 시즌 프로모션 및 선상 크레딧 바우처가 복합 적용되어 최저가 우대 혜택을 받으실 수 있습니다.'
  },
  {
    q: '해외여행이 처음인데 언어나 여권 준비가 걱정됩니다.',
    a: '다온넷크루즈는 여권 유효기간 확인, 전자입국신고서(SG Arrival Card 등) 작성부터 기항지 투어까지 1:1로 꼼꼼히 대행 및 안내해 드립니다. 전 일정 한국인 전문 인솔자가 동행하므로 언어 걱정 없이 안심하고 즐기실 수 있습니다.'
  },
  {
    q: '크루즈 선상에서 추가로 지출되는 비용이 있나요?',
    a: '기본적인 객실, 전 일정 식사(정찬/뷔페), 대다수 엔터테인먼트 및 수영장 이용은 올인클루시브로 무료입니다. 주류, 카지노, 유료 스파, 기항지 개인 쇼핑 등 선택 항목 외에는 추가 비용이 거의 발생하지 않습니다.'
  },
  {
    q: '가족(부모님, 아이들)과 함께 가도 편리한가요?',
    a: '크루즈는 짐을 싸고 푸는 이동 피로가 없어 3대가 함께하는 가족 여행에 최적화되어 있습니다. 아이들을 위한 무료 키즈 클럽과 부모님을 위한 힐링 스파/산책로가 모두 완비되어 있습니다.'
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
    content: '짐을 풀고 싸는 번거로움 없이 로마, 니스, 바르셀로나를 이동할 수 있어 정말 만족스러웠습니다. 선상 파인다이닝 코스 요리와 오션뷰 테라스에서 마시는 와인은 잊지 못할 추억이 되었습니다. 다온넷 멤버십 가입을 강력 추천합니다.',
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
  const dbFaqs = config?.faqs || [];

  const [activePanel, setActivePanel] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('다온넷크루즈 프리미엄 크루즈');
  const [openFaq, setOpenFaq] = useState(0);
  const [packageViewMode, setPackageViewMode] = useState('2col');

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
        
        const hasDiscount = p.originalPrice && p.originalPrice > p.price;
        const discountRate = hasDiscount
          ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
          : null;

        let badge = p.badge;
        if (!badge) {
          if (hasDiscount) badge = '특가 할인';
          else if (idx === 0) badge = '다온넷 베스트';
          else badge = '다온넷 추천';
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
          subtitle: p.description || '다온넷크루즈 멤버십 회원 전용 크루즈 패키지',
          ship,
          image: thumb,
          bookingPeriod,
          travelPeriod,
          price: `${p.price?.toLocaleString()}원`,
          originalPrice: p.originalPrice ? `${p.originalPrice.toLocaleString()}원` : null,
          discountRate,
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
    <div className="kensington-home-wrap" style={{ background: '#FFFFFF', color: '#1A202C', minHeight: '100vh' }}>

      {/* =========================================================================
          1. KENSINGTON 4-EQUAL VIVID SPLIT HERO (첨부 켄싱턴 레퍼런스 스타일)
          ========================================================================= */}
      <section className="kensington-hero-section" style={{ position: 'relative', width: '100%', background: '#0B132B', overflow: 'hidden' }}>
        
        {/* 1A. DESKTOP 4 EQUAL VIVID PANELS */}
        <div className="hero-desktop-panels" style={{ display: 'flex', width: '100%', height: '100%' }}>
          {HERO_PANELS.map((panel, idx) => {
            const Icon = panel.IconComponent;
            return (
              <div
                key={panel.id}
                className="kensington-hero-col"
                style={{
                  position: 'relative',
                  height: '100%',
                  borderRight: idx < HERO_PANELS.length - 1 ? '1px solid rgba(255,255,255,0.25)' : 'none',
                  overflow: 'hidden'
                }}
              >
                {/* Crisp Vivid Background Images (Base & Hover Cross-Fade) */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  <img
                    src={panel.image}
                    alt={panel.korTitle}
                    className="hero-col-base-img"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                  {panel.hoverImage && (
                    <img
                      src={panel.hoverImage}
                      alt={`${panel.korTitle} 호버`}
                      className="hero-col-hover-img"
                      loading="eager"
                      decoding="async"
                    />
                  )}
                  {/* Subtle Elegant Gradient: Keeps photo bright while text remains sharp */}
                  <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    zIndex: 2,
                    background: 'linear-gradient(to bottom, rgba(7, 13, 30, 0.45) 0%, rgba(7, 13, 30, 0.6) 26%, rgba(7, 13, 30, 0.08) 55%, rgba(7, 13, 30, 0.35) 100%)',
                    pointerEvents: 'none'
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
                    wordBreak: 'keep-all',
                    overflowWrap: 'break-word',
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

        {/* 1B. MOBILE 2x2 CRISP GRID (Full-Screen Responsive) */}
        <div className="hero-mobile-slider" style={{ display: 'none', height: '100%', width: '100%' }}>
          <div className="hero-mobile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', height: '100%', width: '100%' }}>
            {HERO_PANELS.map((panel, idx) => {
              const Icon = panel.IconComponent;
              return (
                <div
                  key={panel.id}
                  className="hero-mobile-cell"
                  style={{
                    position: 'relative',
                    height: '100%',
                    borderRight: idx % 2 === 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                    overflow: 'hidden'
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
                      lineHeight: '1.45',
                      whiteSpace: 'pre-line',
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                      maxWidth: '180px',
                      textShadow: '0 2px 6px rgba(0,0,0,0.95)',
                      margin: '0 auto'
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
          2. INTEGRATED QUICK BOOKING & ESTIMATE SECTION (내 계획에 맞춘 빠른 맞춤 견적 & 상담 신청)
          ========================================================================= */}
      <section style={{ position: 'relative', zIndex: 30, background: '#0B132B', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '56px 0 48px' }}>
        <div className="container">
          
          {/* Section Header & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              fontWeight: '800', 
              letterSpacing: '0.15em', 
              color: 'var(--accent-gold)', 
              background: 'rgba(217, 119, 6, 0.15)', 
              border: '1px solid rgba(217, 119, 6, 0.3)', 
              padding: '4px 14px', 
              marginBottom: '10px',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={13} color="var(--accent-gold)" /> {config?.quickPlanner?.badge || 'SMART CUSTOM PLANNER'}
            </span>
            <h2 className="kensington-quick-title" style={{ 
              fontFamily: "'Pretendard', sans-serif", 
              fontSize: '28px', 
              fontWeight: '900', 
              color: '#FFFFFF', 
              letterSpacing: '-0.02em', 
              marginBottom: '8px',
              lineHeight: '1.3'
            }}>
              내 여행 계획에 맞춘,<br className="mobile-break" /> 빠른 맞춤 견적 신청
            </h2>
            <p style={{ 
              color: '#CBD5E1', 
              fontSize: '14px', 
              maxWidth: '100%', 
              margin: '0 auto', 
              lineHeight: '1.6' 
            }}>
              {config?.quickPlanner?.subtitle || '희망하시는 여행지와 일정, 결제 방식을 선택하시면 전담 크루즈 플래너가 1:1 최적 여정과 특별 우대 혜택을 빠르게 안내해 드립니다.'}
            </p>
          </div>

          {/* 4-Field Grid Form Container */}
          <form onSubmit={handleQuickConsultation} style={{ 
            background: '#FFFFFF', 
            border: '2px solid var(--accent-gold)', 
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)' 
          }} className="kensington-quick-bar-grid">
            
            {/* Field 1: Destination */}
            <div style={{ background: '#FFFFFF', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '6px', borderRight: '1px solid #E2E8F0' }}>
              <label style={{ fontSize: '11px', fontWeight: '500', color: '#64748B', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--accent-gold-dark)" /> 희망 여행지 / 노선
              </label>
              <select 
                value={searchDestination} 
                onChange={(e) => setSearchDestination(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                {(config?.quickPlanner?.destinations || [
                  "동남아 3개국 (싱가포르·말레이시아·태국)",
                  "지중해 클래식 (이탈리아·프랑스·스페인)",
                  "일본 오키나와 & 대만 에메랄드",
                  "알래스카 빙하 피오르드"
                ]).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Field 2: Schedule */}
            <div style={{ background: '#FFFFFF', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '6px', borderRight: '1px solid #E2E8F0' }}>
              <label style={{ fontSize: '11px', fontWeight: '500', color: '#64748B', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="var(--accent-gold-dark)" /> 희망 출발 시기
              </label>
              <select 
                value={searchSchedule} 
                onChange={(e) => setSearchSchedule(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                {(config?.quickPlanner?.schedules || [
                  "2026년 상반기 (3월~6월)",
                  "2026년 여름 성수기 (7월~8월)",
                  "2026년 가을 시즌 (9월~11월)",
                  "2026-2027 겨울 방학 시즌"
                ]).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Field 3: Members */}
            <div style={{ background: '#FFFFFF', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '6px', borderRight: '1px solid #E2E8F0' }}>
              <label style={{ fontSize: '11px', fontWeight: '500', color: '#64748B', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="var(--accent-gold-dark)" /> 여행 인원
              </label>
              <select 
                value={searchMembers} 
                onChange={(e) => setSearchMembers(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                {(config?.quickPlanner?.members || [
                  "성인 2인 (부부/커플)",
                  "가족 (성인2 + 아동1~2)",
                  "부모님 동반 (3~4인)",
                  "단체/모임 (5인 이상)"
                ]).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Field 4: Payment Plan */}
            <div style={{ background: '#FFFFFF', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '500', color: '#64748B', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={14} color="var(--accent-gold-dark)" /> 결제 방식 선택
              </label>
              <select 
                value={searchPayment} 
                onChange={(e) => setSearchPayment(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '14px', fontWeight: '700', color: '#1E293B', outline: 'none', cursor: 'pointer' }}
              >
                {(config?.quickPlanner?.paymentPlans || [
                  "스마트 후불 분할 납부",
                  "멤버십 일시불 특별 우대",
                  "맞춤 상담 후 결정"
                ]).map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Submit Button (Sharp Gold Button) */}
            <button 
              type="submit" 
              className="sharp-btn-gold"
              style={{ width: '100%', height: '100%', minHeight: '48px', padding: '12px 16px', fontSize: '14px', fontWeight: '800', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {config?.quickPlanner?.buttonText || '맞춤 견적 신청'} <ArrowRight size={16} />
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
                <span className="kensington-theme-tag" style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
                  DAONNET SPECIAL CURATION
                </span>
                <h2 className="kensington-theme-title" style={{ 
                  fontFamily: "'Pretendard', sans-serif", 
                  fontSize: '32px', 
                  fontWeight: '800', 
                  color: 'var(--navy-deep)', 
                  lineHeight: '1.15', 
                  marginTop: '6px', 
                  marginBottom: '12px' 
                }}>
                  DAONNET CRUISE<br />
                  <span className="kensington-theme-sub" style={{ fontStyle: 'italic', color: 'var(--accent-gold-dark)' }}>Theme Journey</span>
                </h2>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.7', marginBottom: '28px' }}>
                  고객의 품격 있는 라이프스타일에 맞추어 다온넷크루즈에서 특별히 기획한 테마 크루즈 여정입니다.
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
            <div 
              onClick={() => { setModalTitle("동남아 에메랄드 힐링 항해 (기획전)"); setIsBookingModalOpen(true); }}
              className="kensington-editorial-banner" 
              style={{ position: 'relative', overflow: 'hidden', minHeight: '380px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="동남아 럭셔리 크루즈 테마" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="banner-overlay" style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(11, 19, 43, 0.92) 0%, rgba(11, 19, 43, 0.25) 60%, transparent 100%)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>FEATURED THEME 01</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '6px', marginBottom: '8px' }}>
                  동남아 에메랄드 힐링 항해
                </h3>
                <p style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  싱가포르 야경부터 페낭과 푸켓의 청정 해변 힐링 코스
                </p>
              </div>
            </div>

            {/* Right Featured Editorial Banner 2 (지중해 파인다이닝) */}
            <div 
              onClick={() => { setModalTitle("지중해 미식 & 와인 갈라 (기획전)"); setIsBookingModalOpen(true); }}
              className="kensington-editorial-banner" 
              style={{ position: 'relative', overflow: 'hidden', minHeight: '380px', border: '1px solid #E2E8F0', cursor: 'pointer' }}
            >
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="지중해 미식 크루즈" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div className="banner-overlay" style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(11, 19, 43, 0.92) 0%, rgba(11, 19, 43, 0.25) 60%, transparent 100%)',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}>
                <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>FEATURED THEME 02</span>
                <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '6px', marginBottom: '8px' }}>
                  지중해 미식 & 와인 갈라
                </h3>
                <p style={{ color: '#E2E8F0', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                  최고급 와이너리 테이스팅과 셰프 특선 갈라 디너의 향연
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          4. CURATED PACKAGES GRID (다온넷크루즈가 추천하는 패키지 - Kensington Style)
          ========================================================================= */}
      <section id="packages" style={{ padding: '70px 0', background: '#F8F9FA' }}>
        <div className="container">
          
          {/* Section Header */}
          <div className="kensington-packages-header" style={{ marginBottom: '36px', borderBottom: '2px solid var(--navy-deep)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
                  CURATED CRUISE PACKAGES
                </span>
                <h2 className="kensington-packages-title" style={{ 
                  fontFamily: "'Pretendard', sans-serif", 
                  fontSize: '28px', 
                  fontWeight: '900', 
                  color: 'var(--navy-deep)', 
                  marginTop: '4px',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.2'
                }}>
                  다온넷크루즈가 추천하는 패키지
                </h2>
              </div>

              {/* View Mode Toggle Switcher (1열 / 2열 보기) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#E2E8F0', padding: '3px', borderRadius: '4px' }}>
                <button
                  type="button"
                  onClick={() => setPackageViewMode('1col')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: packageViewMode === '1col' ? 'var(--navy-deep)' : 'transparent',
                    color: packageViewMode === '1col' ? '#FFFFFF' : '#475569',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Square size={12} /> 1열 보기
                </button>
                <button
                  type="button"
                  onClick={() => setPackageViewMode('2col')}
                  style={{
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: packageViewMode === '2col' ? 'var(--navy-deep)' : 'transparent',
                    color: packageViewMode === '2col' ? '#FFFFFF' : '#475569',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LayoutGrid size={12} /> 2열 보기
                </button>
              </div>
            </div>

            {/* Sub-bar: Entire Package Inquiry */}
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                onClick={() => { setModalTitle("전체 크루즈 패키지 맞춤 견적"); setIsBookingModalOpen(true); }}
                style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '700', color: 'var(--navy-deep)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0 }}
              >
                <span>전체 패키지 문의</span> <ArrowUpRight size={14} style={{ flexShrink: 0 }} />
              </button>
            </div>
          </div>

          {/* Sharp Grid with 1col/2col Mode */}
          <div className={`kensington-packages-grid ${packageViewMode === '1col' ? 'force-1col' : 'force-2col'}`}>
            {displayPackages.map((pkg, pIdx) => (
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
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                    <SafeMedia 
                      src={pkg.image} 
                      alt={pkg.title} 
                      priority={pIdx < 4}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'var(--navy-deep)', color: 'var(--accent-gold)', fontSize: '9.5px', fontWeight: '800', padding: '3px 8px', letterSpacing: '0.04em' }}>
                      {pkg.badge}
                    </div>
                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', zIndex: 10, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)', padding: '8px 12px', color: '#fff', fontSize: '10px', fontWeight: '600' }}>
                      {pkg.ship}
                    </div>
                  </div>
                </Link>

                {/* Card Content */}
                <div className="kensington-package-card-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <Link to={pkg.isDb ? `/product/${pkg.id}` : '#'} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 className="kensington-package-card-title" style={{ fontSize: '17px', fontWeight: '800', color: 'var(--navy-deep)', lineHeight: '1.4', marginBottom: '8px', fontFamily: "'Pretendard', sans-serif", transition: 'color 0.2s' }}>
                        {pkg.title}
                      </h3>
                    </Link>
                    <p className="kensington-package-card-sub" style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.6', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {pkg.subtitle}
                    </p>

                    <div className="kensington-package-card-info" style={{ borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', padding: '12px 0', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', color: '#475569' }}>
                      <div>📅 {pkg.bookingPeriod}</div>
                      <div>🚢 {pkg.travelPeriod}</div>
                    </div>

                    <div className="kensington-package-card-features" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--accent-gold-dark)' }}>▪</span> {feat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Buttons */}
                  <div>
                    <div className="kensington-package-card-pricing" style={{ background: '#F8FAFC', padding: '10px 12px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                      {pkg.originalPrice ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          {pkg.discountRate && (
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#DC2626' }}>
                              {pkg.discountRate}%
                            </span>
                          )}
                          <span style={{ fontSize: '11px', color: '#94A3B8', textDecoration: 'line-through' }}>
                            {pkg.originalPrice}
                          </span>
                        </div>
                      ) : null}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>판매가</span>
                        <span className="kensington-package-card-price" style={{ fontSize: '16px', fontWeight: '900', color: 'var(--navy-deep)', letterSpacing: '-0.02em' }}>
                          {pkg.price}
                        </span>
                      </div>
                    </div>

                    <div className="package-btn-grid" style={{ display: 'grid', gridTemplateColumns: pkg.isDb ? '1fr 1fr' : '1fr', gap: '6px' }}>
                      {pkg.isDb && (
                        <Link 
                          to={`/product/${pkg.id}`}
                          className="sharp-btn-outline"
                          style={{ textAlign: 'center', padding: '9px 0', fontSize: '11px', color: 'var(--navy-deep)', textDecoration: 'none', fontWeight: '700' }}
                        >
                          상세보기
                        </Link>
                      )}
                      <button 
                        onClick={() => handleOpenProductConsultation(pkg)}
                        className="sharp-btn-dark"
                        style={{ width: '100%', padding: '9px 0', fontSize: '11px' }}
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
          5. 4대 핵심 서비스 소개 (FOUR EXCLUSIVE CORE SERVICES - #service)
          ========================================================================= */}
      <section id="service" style={{ padding: '100px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
              FOUR EXCLUSIVE VALUES
            </span>
            <h2 className="kensington-pillar-title" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '32px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '8px', lineHeight: '1.25' }}>
              다온넷크루즈의<br className="mobile-break" /> 4대 핵심 서비스
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginTop: '10px' }}>
              단순한 여행 상품을 넘어, 출국부터 귀국까지 오직 고객님의 편안함과 특별한 감동만을 위해 설계되었습니다.
            </p>
            <div style={{ width: '60px', height: '2px', background: 'var(--accent-gold)', margin: '16px auto 0' }} />
          </div>

          <div className="kensington-pillars-container">
            {SERVICE_PILLARS.map((pillar, idx) => {
              const isEven = idx % 2 === 1;
              const IconComp = pillar.icon;
              return (
                <div 
                  key={pillar.number} 
                  className={`kensington-pillar-card sharp-card ${isEven ? 'pillar-even' : ''}`}
                >
                  {/* Image Block */}
                  <div className="kensington-pillar-img-block">
                    <img 
                      src={pillar.image} 
                      alt={pillar.title} 
                    />
                    <div className="kensington-pillar-badge">
                      {pillar.number}
                    </div>
                  </div>

                  {/* Text Block */}
                  <div className="kensington-pillar-text-block">
                    <div>
                      <div className="kensington-pillar-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold-dark)', marginBottom: '6px' }}>
                        <IconComp size={13} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PILLAR {pillar.number}</span>
                      </div>

                      <h3 className="kensington-pillar-card-title" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '24px', fontWeight: '800', color: 'var(--navy-deep)', lineHeight: '1.3', marginBottom: '8px' }}>
                        {pillar.title}
                      </h3>
                      <div className="kensington-pillar-card-sub" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-gold-dark)', marginBottom: '14px' }}>
                        {pillar.subtitle}
                      </div>

                      <p className="kensington-pillar-card-desc" style={{ color: '#475569', fontSize: '13px', lineHeight: '1.7', marginBottom: '20px' }}>
                        {pillar.description}
                      </p>

                      <div className="kensington-pillar-card-points" style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {pillar.points.map((pt, pIdx) => (
                          <div key={pIdx} className="kensington-pillar-point-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E293B', fontWeight: '600' }}>
                            <CheckCircle2 size={13} color="var(--accent-gold-dark)" style={{ flexShrink: 0 }} />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. REAL CUSTOMER REVIEWS (생생한 고객 여행후기 - 메인 3대 추천 후기)
          ========================================================================= */}
      <section id="reviews" style={{ padding: '100px 0', background: '#F8F9FA', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', borderBottom: '2px solid var(--navy-deep)', paddingBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
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
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', display: window.innerWidth < 640 ? 'none' : 'inline' }}>
                평균 만족도 4.9 / 5.0 (2,400+ 회원 이용)
              </span>
              <Link 
                to="/reviews" 
                className="sharp-btn-outline" 
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '9px 18px', 
                  fontSize: '12px', 
                  color: 'var(--navy-deep)', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  background: '#FFFFFF'
                }}
              >
                전체 후기 보기 <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="kensington-reviews-grid">
            {(() => {
              const dbReviews = config?.reviews || [];
              const featuredReviews = dbReviews.filter(r => r.showOnHome !== false);
              const activeList = featuredReviews.length > 0
                ? featuredReviews.slice(0, 3)
                : (dbReviews.length > 0 ? dbReviews.slice(0, 3) : REAL_REVIEWS.slice(0, 3));

              return activeList.map((rev, rIdx) => {
                const authorName = rev.author || rev.user || rev.name || '고객님';
                const rating = rev.rating || 5;
                const route = rev.productTitle || rev.route || '동남아 럭셔리 크루즈';
                const date = rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : '최근 이용');
                const title = rev.title || (rev.content.length > 25 ? `${rev.content.slice(0, 25)}...` : rev.content);

                return (
                  <div key={rev.id || rev._id || rIdx} className="sharp-card" style={{ background: '#FFFFFF', padding: '32px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
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
                            <div key={iIdx} style={{ width: '70px', height: '70px', flexShrink: 0, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                              <SafeMedia 
                                src={img} 
                                alt={`후기 이미지 ${iIdx + 1}`} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              />
                            </div>
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
              });
            })()}
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. HOW IT WORKS (다온넷 멤버십 이용 프로세스 - #process)
          ========================================================================= */}
      <section id="process" style={{ padding: '90px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
              HOW IT WORKS
            </span>
            <h2 className="kensington-process-title" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '30px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '8px', lineHeight: '1.25' }}>
              다온넷 멤버십,<br className="mobile-break" /> 이용 프로세스
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>
              상담 신청부터 여정 설계, 출국 인솔, 귀국 후 분할 정산까지 안전하고 편리한 4단계
            </p>
          </div>

          <div className="kensington-process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {STEPS.map((st) => (
              <div key={st.step} className="sharp-card kensington-process-card" style={{ background: '#FFFFFF', padding: '32px 24px', border: '1px solid #E2E8F0', position: 'relative' }}>
                <div className="kensington-process-step" style={{ fontSize: '32px', fontWeight: '900', color: 'var(--accent-gold)', fontFamily: "'Pretendard', sans-serif", marginBottom: '12px', lineHeight: '1' }}>
                  STEP {st.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '10px', fontFamily: "'Pretendard', sans-serif" }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.7' }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. FAQ SECTION (자주 묻는 질문 - #faq)
          ========================================================================= */}
      <section id="faq" style={{ padding: '90px 0', background: '#F8F9FA', borderTop: '1px solid #E2E8F0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="kensington-faq-title" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '30px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '8px', lineHeight: '1.25' }}>
              자주 묻는 질문 (FAQ)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(() => {
              const activeFaqs = (dbFaqs && dbFaqs.length > 0)
                ? dbFaqs.map(f => ({ q: f.question, a: f.answer }))
                : FAQS;
              return activeFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} style={{ border: '1px solid #E2E8F0', background: isOpen ? '#FFFFFF' : '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <button 
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    style={{ 
                      width: '100%', 
                      padding: '20px 24px', 
                      background: 'none', 
                      border: 'none', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      textAlign: 'left', 
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-deep)' }}>
                      Q. {faq.q}
                    </span>
                    {isOpen ? <ChevronDown size={18} color="var(--accent-gold-dark)" style={{ transform: 'rotate(180deg)', transition: '0.2s' }} /> : <ChevronDown size={18} color="#94A3B8" style={{ transition: '0.2s' }} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 24px', fontSize: '14px', color: '#475569', lineHeight: '1.8', borderTop: '1px solid #F1F5F9' }}>
                      <p style={{ marginTop: '16px' }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
              });
            })()}
          </div>

        </div>
      </section>

      {/* =========================================================================
          9. BOTTOM LUXURY CALL-TO-ACTION BANNER
          ========================================================================= */}
      <section style={{ background: 'var(--navy-deep)', color: '#FFFFFF', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              RESERVE YOUR VOYAGE
            </span>
            <h2 className="kensington-cta-title" style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '28px', fontWeight: '800', marginTop: '8px', marginBottom: '12px', lineHeight: '1.3' }}>
              크루즈 여행, 더 이상 망설이지 마세요.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>
              전담 크루즈 컨시어지가 맞춤 여정 설계부터 후불 결제 승인까지 원스톱으로 안내해 드립니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => { setModalTitle("다온넷크루즈 1:1 맞춤 견적 및 상담"); setIsBookingModalOpen(true); }}
              className="sharp-btn-gold" 
              style={{ padding: '16px 36px', fontSize: '14px' }}
            >
              1:1 무료 상담 신청하기 <ArrowRight size={16} />
            </button>
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
