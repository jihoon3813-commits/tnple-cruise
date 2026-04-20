import { useConfig } from '../context/ConfigContext';
import SafeMedia from './SafeMedia';
import { Ship, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const context = useConfig();
  const config = context?.config || {};
  const hasLogo = !!config.logo;
  const footer = config.footer || {
    menus: [
      { id: '1', label: '이용약관', url: '/terms' },
      { id: '2', label: '개인정보처리방침', url: '/privacy' }
    ],
    companyInfo: "회사명: 티앤플코리아\n대표자: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123\n사업자등록번호: 123-45-67890 | TEL: 02-1234-5678",
    copyright: "© 2024 T&PLE KOREA. All rights reserved.",
    externalLinks: []
  };

  return (
    <footer style={{ 
      background: hasLogo ? '#ffffff' : '#050c18', 
      color: hasLogo ? 'var(--text-main)' : '#fff', 
      padding: '100px 0 50px',
      borderTop: hasLogo ? '1px solid var(--border-light)' : 'none'
    }}>
      <div className="container" style={{ padding: window.innerWidth < 768 ? '0 20px' : '0' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1.5fr 2fr 1fr 1fr', 
          gap: window.innerWidth < 1024 ? '50px' : '60px', 
          marginBottom: '80px' 
        }}>
          {/* Logo & Intro Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: '700', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--accent, #D4AF37)' }}>
                  <Ship size={22} strokeWidth={2} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <span style={{ fontWeight: '900', fontSize: '18px', color: hasLogo ? 'var(--text-main)' : '#fff' }}>
                    티앤플 코리아
                  </span>
                  <span style={{ fontWeight: '600', fontSize: '9px', letterSpacing: '0.1em', opacity: 0.7, color: hasLogo ? 'var(--text-main)' : '#fff' }}>
                    T&PLE KOREA
                  </span>
                </div>
            </div>
            <p style={{ 
              color: hasLogo ? '#64748b' : '#8c95a1', 
              fontSize: '14px', 
              lineHeight: '1.8' 
            }}>
              {footer.logoDescription || "프리미엄 럭셔리 크루즈 멤버십 서비스. 품격 있는 해상 여행의 정수를 T&PLE KOREA와 함께 경험해 보세요."}
            </p>
          </div>

          {/* Company Info Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <h4 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff', fontWeight: '800' }}>회사 정보</h4>
            <p style={{ 
              color: hasLogo ? '#64748b' : '#8c95a1', 
              fontSize: '14px', 
              lineHeight: '2',
              whiteSpace: 'pre-wrap'
            }}>
              {footer.companyInfo}
            </p>
          </div>
          
          {/* Menu Column */}
          <div>
            <h4 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff', fontWeight: '800' }}>메뉴</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px' }}>
              {(footer.menus || []).map(menu => (
                <li key={menu.id}>
                  <Link to={menu.url} style={{ color: 'inherit', textDecoration: 'none' }}>{menu.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CS Center Column (Keep this as static or add to config if needed, but current request focuses on the others) */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '30px', color: hasLogo ? 'var(--text-main)' : '#fff', fontWeight:'800' }}>CS CENTER</h3>
            <div style={{ color: hasLogo ? '#64748b' : '#8c95a1', fontSize: '14px', lineHeight: '1.8' }}>
               <p style={{ fontSize: '24px', fontWeight: '800', color: hasLogo ? 'var(--primary)' : '#fff', marginBottom: '10px' }}>1600-0000</p>
               <p>운영시간: 평일 09:00 ~ 18:00</p>
               <p style={{ fontSize: '12px', marginTop: '4px' }}>점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)</p>
               
               {/* External Links */}
               {footer.externalLinks && footer.externalLinks.length > 0 && (
                 <div style={{ marginTop: '24px', display: 'flex', gap: '15px' }}>
                   {footer.externalLinks.map(link => (
                     <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid currentColor' }}>
                       {link.label}
                     </a>
                   ))}
                 </div>
               )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${hasLogo ? 'var(--border-light)' : 'rgba(255,255,255,0.05)'}`, paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: hasLogo ? '#94a3b8' : '#555', fontSize: '12px' }}>
          <p>{footer.copyright || `© ${new Date().getFullYear()} T&PLE KOREA. All rights reserved.`}</p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/admin" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.5, fontSize: '11px' }}>Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
