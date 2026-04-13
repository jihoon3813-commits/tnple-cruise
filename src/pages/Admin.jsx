import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image, Package, MessageSquare, Home as HomeIcon, LogOut, ChevronRight, Settings, Bell } from 'lucide-react';
import AdminHomeEditor from './AdminHomeEditor';
import AdminProductManager from './AdminProductManager';
import AdminReviewManager from './AdminReviewManager';

const Admin = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', name: '홈 레이아웃', icon: <HomeIcon size={18} /> },
    { path: '/admin/products', name: '상품 마스터', icon: <Package size={18} /> },
    { path: '/admin/reviews', name: '리뷰 데이터', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-nav">
        <div style={{ padding: '0 20px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'var(--gold-gradient)', borderRadius: '6px' }}></div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em' }}>OLIGO</h2>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management Console</p>
        </div>
        
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span style={{ fontSize: '14px', flex: 1 }}>{item.name}</span>
              {location.pathname === item.path && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '20px' }}>
           <div className="glass-light" style={{ padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-white)', fontWeight: '600', marginBottom: '4px' }}>시스템 알림</p>
              <p style={{ fontSize: '11px', color: 'var(--text-gray)' }}>3개의 미승인 리뷰가 있습니다.</p>
           </div>
          <Link to="/" className="flex items-center gap-3 text-sm color-text-gray hover:text-white transition-all">
            <LogOut size={16} />
            <span>프론트 사이트 보기</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-view">
        {/* Admin Header */}
        <header style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '48px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' 
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
              {navItems.find(i => i.path === location.pathname)?.name || '데이터 관리'}
            </h1>
            <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>실시간으로 웹사이트의 콘텐츠와 상품 데이터를 제어하세요.</p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="glass-light" style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Bell size={20} /></div>
            <div className="glass-light" style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Settings size={20} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#334155', border: '1px solid var(--gold-primary)' }}></div>
               <div style={{ fontSize: '13px' }}>
                 <p style={{ fontWeight: '700' }}>Admin User</p>
                 <p style={{ fontSize: '11px', color: 'var(--text-gray)' }}>Master Account</p>
               </div>
            </div>
          </div>
        </header>

        <div className="admin-content-inner">
          <Routes>
            <Route path="/" element={<AdminHomeEditor />} />
            <Route path="/products" element={<AdminProductManager />} />
            <Route path="/reviews" element={<AdminReviewManager />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Admin;
