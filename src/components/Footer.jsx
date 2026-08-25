import React from 'react';
import { Ship, Phone, Mail, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConfig } from '../context/ConfigContext';

const Footer = () => {
  const { config } = useConfig();
  const siteName = config?.siteName || '다온넷크루즈';
  const siteNameEn = config?.siteNameEn || 'DAONNET CRUISE';

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
            <span style={{ color: '#E2E8F0', fontSize: '13px', fontWeight: '500' }}>2026-2027 시즌 {siteName} 프리미엄 크루즈 멤버십 특별 혜택 및 예약 상담 오픈</span>
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
        <div className="kensington-footer-grid" style={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '50px'
        }}>
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', border: '1px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold)' }}>
                <Ship size={20} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: '900', fontSize: '18px', letterSpacing: '-0.02em', color: '#FFFFFF' }}>{siteName}</div>
                <div style={{ fontSize: '9px', letterSpacing: '0.18em', color: 'var(--accent-gold)', textTransform: 'uppercase', fontFamily: "'Cinzel', serif", fontWeight: '700' }}>{siteNameEn}</div>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '20px', lineHeight: '1.7' }}>
              {siteName}는 크루즈 여행을 단순 예약을 넘어 멤버십 기반의 품격 있는 여정으로 제안합니다. 싱가포르·말레이시아·태국 및 전 세계 주요 해상 여행을 특별 우대 혜택과 전담 컨시어지로 편안하게 경험하세요.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
              <li><a href="/#service" style={{ color: '#94A3B8', textDecoration: 'none' }}>4대 핵심 서비스</a></li>
              <li><a href="/#reviews" style={{ color: '#94A3B8', textDecoration: 'none' }}>생생한 고객 여행후기</a></li>
              <li><Link to="/admin" target="_blank" rel="noopener noreferrer" style={{ color: '#64748B', textDecoration: 'none', fontSize: '11px' }}>관리자 콘솔 (Admin)</Link></li>
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
              <div><Mail size={12} style={{ display: 'inline', marginRight: '6px' }} />이메일: contact@daonnet-cruise.com</div>
            </div>
            <a 
              href="tel:1600-0000" 
              className="sharp-btn-gold" 
              style={{ width: '100%', marginTop: '16px', padding: '12px 10px', fontSize: '13px', textAlign: 'center', display: 'block', textDecoration: 'none' }}
            >
              전화 상담 연결하기
            </a>
          </div>
        </div>

        {/* Company Legal Information */}
        <div className="kensington-footer-legal" style={{ paddingTop: '30px', color: '#64748B', fontSize: '12px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', lineHeight: '1.8' }}>
          <div>
            <p style={{ margin: '0 0 4px 0' }}>{siteName} (주) | 대표자: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2024-서울강남-0000호</p>
            <p style={{ margin: '0 0 4px 0' }}>주소: 서울특별시 강남구 테헤란로 123 빌딩 7층 | 개인정보보호책임자: 김크루즈</p>
            <p style={{ marginTop: '8px', color: '#475569', margin: '8px 0 0 0' }}>© 2026 {siteNameEn}. All rights reserved. 본 사이트의 모든 콘텐츠는 저작권법의 보호를 받습니다.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
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
