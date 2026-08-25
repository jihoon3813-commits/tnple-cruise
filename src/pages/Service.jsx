import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ship, CreditCard, ShieldCheck, Award, Utensils, Users, 
  CheckCircle2, ArrowRight, Phone, Calendar, MapPin, 
  Sparkles, FileText, ChevronDown, ChevronUp, Anchor, Compass, Gift
} from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import BookingModal from '../components/BookingModal';

const SERVICE_PILLARS = [
  {
    number: '01',
    title: '멤버십 특별 우대 & 파격 할인 혜택',
    subtitle: '시즌 한정 파격 할인과 선상 크레딧 등 독점 우대 혜택',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: '다온넷크루즈 멤버십 고객님만을 위해 최고급 크루즈 여정을 가장 합리적인 특가로 제안합니다. 조기 예약 할인, 다인원 동반 할인, 특별 선상 크레딧 바우처 지원 등 풍성한 할인 혜택을 통해 프리미엄 크루즈를 최고의 가치로 경험하실 수 있습니다.',
    points: [
      '조기 예약(얼리버드) 및 시즌 한정 파격 특별 할인 제공',
      '가족/단체 동반 예약 시 추가 할인 프로모션 적용',
      '객실당 최대 50만원 상당 선상 크레딧 바우처 특별 지원'
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
      '인천/부산 국제공항 전용 미팅 & 그룹 수속 지원',
      '싱가포르·말레이시아·태국 등 기항지별 한국인 전담 가이드',
      '선상 선실 서비스 및 응급 상황 24시간 한국어 핫라인'
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
      '전 일정 정찬 레스토랑 & 뷔페 식사 100% 무료 포함',
      '대극장 갈라 쇼, 아이스 쇼, 아쿠아 시어터 무료 관람',
      '피트니스 센터, 조깅 트랙, 수영장 및 자쿠지 무제한 이용'
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
      '예약 시 발코니 오션뷰 객실 우선 배정 프로모션',
      '객실당 최대 50만원 상당의 선상 크레딧(OBC) 바우처 제공',
      '직계 가족 동반 시 추가 할인 및 마일리지 적립'
    ]
  }
];

const STEPS = [
  { step: '01', title: '1:1 맞춤 상담 신청', desc: '온라인 또는 유선으로 희망 노선, 여행 일정, 인원을 접수합니다.' },
  { step: '02', title: '여정 설계 & 특별 혜택 적용', desc: '전문 컨시어지가 고객님께 맞는 최적의 객실과 맞춤 할인 혜택을 적용합니다.' },
  { step: '03', title: '설레는 크루즈 여행', desc: '공항 출국부터 기항지 투어까지 한국인 인솔자의 케어를 받으며 여행합니다.' },
  { step: '04', title: '완벽한 여행 & 사후 케어', desc: '설레는 크루즈 여행을 마치신 후에도 지속적인 멤버십 특전과 차기 할인 혜택을 제공합니다.' }
];

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

const Service = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultTitle, setConsultTitle] = useState('다온넷크루즈 서비스 상담');

  return (
    <div style={{ background: '#FFFFFF', color: '#1A202C', minHeight: '100vh', paddingTop: '110px' }}>

      {/* 1. Service Hero Banner (Kensington Resort Style) */}
      <section style={{ position: 'relative', height: '480px', background: 'var(--navy-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="다온넷크루즈 서비스 소개" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35)' }}
        />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px', maxWidth: '900px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid var(--accent-gold)', padding: '4px 14px', marginBottom: '16px', background: 'rgba(0,0,0,0.3)' }}>
            <Anchor size={14} color="var(--accent-gold)" />
            <span style={{ color: 'var(--accent-gold)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              DAONNET CRUISE MEMBERSHIP SERVICE
            </span>
          </div>
          <h1 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '42px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.3', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            크루즈 여행의 품격을 바꾸는<br />
            <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic' }}>다온넷크루즈 멤버십</span>
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '16px', lineHeight: '1.7', opacity: 0.9 }}>
            단순한 여행 상품 판매를 넘어, 출국부터 귀국까지<br />
            오직 고객님의 편안함과 특별한 감동만을 위해 설계된 독보적인 크루즈 서비스입니다.
          </p>
        </div>
      </section>

      {/* 2. 4 Core Value Pillars (Kensington Editorial Sharp Style) */}
      <section style={{ padding: '100px 0', background: '#FFFFFF' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '70px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
              FOUR EXCLUSIVE VALUES
            </span>
            <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '34px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '8px' }}>
              다온넷크루즈의 4대 핵심 서비스
            </h2>
            <div style={{ width: '60px', height: '2px', background: 'var(--accent-gold)', margin: '16px auto 0' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {SERVICE_PILLARS.map((pillar, idx) => {
              const isEven = idx % 2 === 1;
              const IconComp = pillar.icon;
              return (
                <div 
                  key={pillar.number} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 1.1fr', 
                    gap: '50px',
                    alignItems: 'center',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Image Block */}
                  <div style={{ position: 'relative', height: '420px', order: isEven && window.innerWidth >= 1024 ? 2 : 1, overflow: 'hidden' }}>
                    <img 
                      src={pillar.image} 
                      alt={pillar.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{ position: 'absolute', top: '24px', left: '24px', background: 'var(--navy-deep)', color: 'var(--accent-gold)', padding: '8px 16px', fontSize: '18px', fontWeight: '900', fontFamily: "'Pretendard', sans-serif" }}>
                      {pillar.number}
                    </div>
                  </div>

                  {/* Text Block */}
                  <div style={{ padding: window.innerWidth < 1024 ? '24px 30px 40px' : '40px 50px', order: isEven && window.innerWidth >= 1024 ? 1 : 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold-dark)', marginBottom: '10px' }}>
                      <IconComp size={18} />
                      <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>PILLAR {pillar.number}</span>
                    </div>

                    <h3 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '26px', fontWeight: '800', color: 'var(--navy-deep)', lineHeight: '1.3', marginBottom: '10px' }}>
                      {pillar.title}
                    </h3>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-gold-dark)', marginBottom: '16px' }}>
                      {pillar.subtitle}
                    </div>

                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px' }}>
                      {pillar.description}
                    </p>

                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {pillar.points.map((pt, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#1E293B', fontWeight: '600' }}>
                          <CheckCircle2 size={16} color="var(--accent-gold-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '30px' }}>
                      <button 
                        onClick={() => { setConsultTitle(`[${pillar.title}] 관련 맞춤 상담`); setIsModalOpen(true); }}
                        className="sharp-btn-dark"
                        style={{ padding: '12px 24px', fontSize: '13px' }}
                      >
                        해당 서비스 문의 <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. Step-by-Step Membership Journey (이용 절차) */}
      <section style={{ padding: '90px 0', background: '#F8F9FA', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
              HOW IT WORKS
            </span>
            <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '32px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '8px' }}>
              다온넷 멤버십 이용 프로세스
            </h2>
            <p style={{ color: '#64748B', fontSize: '14px', marginTop: '8px' }}>상담 신청부터 여행, 귀국 후 분할 정산까지 안전하고 편리한 4단계</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : (window.innerWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'), gap: '24px' }}>
            {STEPS.map((st) => (
              <div key={st.step} className="sharp-card" style={{ background: '#FFFFFF', padding: '36px 28px', border: '1px solid #E2E8F0', position: 'relative' }}>
                <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--accent-gold)', fontFamily: "'Pretendard', sans-serif", marginBottom: '16px', lineHeight: '1' }}>
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

      {/* 4. FAQ Section */}
      <section style={{ padding: '90px 0', background: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--accent-gold-dark)', textTransform: 'uppercase' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '32px', fontWeight: '800', color: 'var(--navy-deep)', marginTop: '8px' }}>
              자주 묻는 질문 (FAQ)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} style={{ border: '1px solid #E2E8F0', background: isOpen ? '#F8F9FA' : '#FFFFFF' }}>
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
                    {isOpen ? <ChevronUp size={18} color="var(--accent-gold-dark)" /> : <ChevronDown size={18} color="#94A3B8" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 24px', fontSize: '14px', color: '#475569', lineHeight: '1.8', borderTop: '1px solid #F1F5F9' }}>
                      <p style={{ marginTop: '16px' }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Bottom Consultation Banner */}
      <section style={{ background: 'var(--navy-deep)', color: '#FFFFFF', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div>
            <span style={{ color: 'var(--accent-gold)', fontSize: '12px', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              EXPERT CONSULTATION
            </span>
            <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '30px', fontWeight: '800', marginTop: '8px', marginBottom: '8px' }}>
              나에게 꼭 맞는 맞춤 크루즈 멤버십 플랜을 상담받으세요.
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '14px' }}>
              원하는 기항지, 출발 일정, 가족 인원에 따라 가장 합리적인 후불제 견적을 안내해 드립니다.
            </p>
          </div>

          <button 
            onClick={() => { setConsultTitle("다온넷크루즈 멤버십 서비스 맞춤 상담"); setIsModalOpen(true); }}
            className="sharp-btn-gold" 
            style={{ padding: '16px 36px', fontSize: '14px' }}
          >
            1:1 무료 상담 예약하기 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productTitle={consultTitle}
        accentColor="var(--accent-gold-dark)"
      />

    </div>
  );
};

export default Service;
