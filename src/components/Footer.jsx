import React from 'react';
import { Ship, Phone, Mail, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      background: '#0B132B', 
      color: '#CBD5E1', 
      borderTop: '3px solid var(--accent-gold)',
      fontSize: '13px',
      lineHeight: '1.7'
    }}>
      {/* Top Notice / Ticker Bar */}
      <div style={{ background: '#070D1E', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: 'var(--accent-gold)', color: '#0B132B', padding: '2px 8px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em' }}>NOTICE</span>
            <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: '500' }}>2026-2027 시즌 티앤플 코리아 프리미엄 크루즈 멤버십 특별 혜택 및 후불 결제 상담 오픈</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', opacity: 0.8 }}>
            <span>동남아 노선 예약 진행 중</span>
            <span>·</span>
            <span>지중해 얼리버드 혜택</span>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="container" style={{ padding: '60px 0 40px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1.8fr 1.2fr 1.2fr 1.8fr', 
          gap: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '50px'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <Ship size={18} />
              </div>
              <div>
                <div style={{ fontFamily: "'Cinzel', serif", fontWeight: '800', fontSize: '16px', letterSpacing: '0.06em', color: '#FFFFFF' }}>T&PLE KOREA</div>
                <div style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--accent-gold)', textTransform: 'uppercase' }}>Luxury Cruise & Resorts</div>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '20px' }}>
              티앤플 코리아는 크루즈 여행을 단순 예약을 넘어 멤버십 기반의 품격 있는 여정으로 제안합니다. 싱가포르·말레이시아·태국 및 전 세계 주요 해상 여행을 스마트 후불 결제와 전담 컨시어지로 편안하게 경험하세요.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', fontSize: '11px', color: '#CBD5E1' }}>1:1 전담 컨시어지</span>
              <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', fontSize: '11px', color: '#CBD5E1' }}>여행 후 분할 납부</span>
              <span style={{ border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', fontSize: '11px', color: '#CBD5E1' }}>올인클루시브 케어</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '800', letterSpacing: '0.06em', marginBottom: '20px', textTransform: 'uppercase' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/service" style={{ color: '#94A3B8', textDecoration: 'none' }}>서비스 소개 (Service)</Link></li>
              <li><a href="/#packages" style={{ color: '#94A3B8', textDecoration: 'none' }}>추천 크루즈 패키지</a></li>
              <li><a href="/#membership" style={{ color: '#94A3B8', textDecoration: 'none' }}>멤버십 특전 및 혜택</a></li>
              <li><a href="/#reviews" style={{ color: '#94A3B8', textDecoration: 'none' }}>생생한 고객 여행후기</a></li>
              <li><Link to="/admin" style={{ color: '#64748B', textDecoration: 'none', fontSize: '11px' }}>관리자 콘솔 (Admin)</Link></li>
            </ul>
          </div>

          {/* Col 3: Destinations */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '800', letterSpacing: '0.06em', marginBottom: '20px', textTransform: 'uppercase' }}>
              Destinations
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: '#94A3B8' }}>
              <li>동남아 3개국 (싱가포르·말레이시아·태국)</li>
              <li>지중해 클래식 (이탈리아·프랑스·스페인)</li>
              <li>동북아 힐링 (일본 오키나와·대만)</li>
              <li>알래스카 빙하 피오르드</li>
            </ul>
          </div>

          {/* Col 4: CS Center */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h4 style={{ color: 'var(--accent-gold)', fontSize: '13px', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
              Customer Care Center
            </h4>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              1600-0000
            </div>
            <div style={{ color: '#94A3B8', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><Clock size={12} style={{ display: 'inline', marginRight: '6px' }} />운영시간: 평일 09:00 ~ 18:00</div>
              <div>점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)</div>
              <div><Mail size={12} style={{ display: 'inline', marginRight: '6px' }} />이메일: contact@tnple-cruise.com</div>
            </div>
            <a 
              href="tel:1600-0000" 
              className="sharp-btn-gold" 
              style={{ width: '100%', marginTop: '16px', padding: '10px', fontSize: '12px', textAlign: 'center' }}
            >
              전화 상담 연결하기
            </a>
          </div>
        </div>

        {/* Company Legal Information */}
        <div style={{ paddingTop: '30px', color: '#64748B', fontSize: '12px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p>티앤플코리아 (주) | 대표자: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2024-서울강남-0000호</p>
            <p>주소: 서울특별시 강남구 테헤란로 123 티앤플빌딩 7층 | 개인정보보호책임자: 김크루즈</p>
            <p style={{ marginTop: '8px', color: '#475569' }}>© 2026 T&PLE KOREA. All rights reserved. 본 사이트의 모든 콘텐츠는 저작권법의 보호를 받습니다.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#94A3B8', cursor: 'pointer' }}>이용약관</span>
            <span style={{ color: '#94A3B8', cursor: 'pointer' }}>개인정보처리방침</span>
            <span style={{ color: '#94A3B8', cursor: 'pointer' }}>여행약관</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
