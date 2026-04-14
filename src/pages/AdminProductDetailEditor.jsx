import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Settings, Image, Type, Palette, Layout, Save, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminProductDetailEditor = () => {
  const { config, updateProductDetailBranding } = useConfig();
  const [form, setForm] = useState(config.productDetailBranding);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (config.productDetailBranding) {
      setForm(config.productDetailBranding);
    }
  }, [config.productDetailBranding]);

  const handleSave = async () => {
    await updateProductDetailBranding(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="admin-editor-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Settings size={24} /></div>
            <div>
               <h2 style={{ fontSize: '20px', fontWeight: '800' }}>상품 상세 페이지 브랜딩</h2>
               <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>개별 상품 페이지의 디자인 테마와 레이아웃을 설정합니다.</p>
            </div>
         </div>
         <button className="luxury-btn" onClick={handleSave} style={{ gap: '8px' }}>
            {saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saveSuccess ? '저장 완료' : '설정 저장'}
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
         {/* Left: Settings */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <section className="admin-card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Layout size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>레이아웃 & 테마 설정</h3>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div className="form-group">
                     <label>페이지 레이아웃</label>
                     <select className="form-control" value={form.layout} onChange={e => setForm({...form, layout: e.target.value})}>
                        <option value="luxury">Luxury (Wide Gallery)</option>
                        <option value="split">Split (Half & Half)</option>
                        <option value="modern">Modern (Centered)</option>
                     </select>
                  </div>
                  <div className="form-group">
                     <label>컬러 테마</label>
                     <select className="form-control" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})}>
                        <option value="light">Light (깔끔한 화이트)</option>
                        <option value="dark">Dark (고급스러운 블랙)</option>
                        <option value="glass">Glass (투명한 유리질감)</option>
                     </select>
                  </div>
               </div>
            </section>

            <section className="admin-card">
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Palette size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>브랜드 컬러 시스템</h3>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                     <label>메인 상품명 색상</label>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={form.titleColor || "#0F172A"} onChange={e => setForm({...form, titleColor: e.target.value})} />
                        <input type="text" className="form-control" value={form.titleColor || "#0F172A"} onChange={e => setForm({...form, titleColor: e.target.value})} />
                     </div>
                  </div>
                  <div className="form-group">
                     <label>가격 강조 색상</label>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={form.priceColor || "#2563EB"} onChange={e => setForm({...form, priceColor: e.target.value})} />
                        <input type="text" className="form-control" value={form.priceColor || "#2563EB"} onChange={e => setForm({...form, priceColor: e.target.value})} />
                     </div>
                  </div>
                  <div className="form-group">
                     <label>포인트 액센트 컬러</label>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={form.accentColor || "#2563EB"} onChange={e => setForm({...form, accentColor: e.target.value})} />
                        <input type="text" className="form-control" value={form.accentColor || "#2563EB"} onChange={e => setForm({...form, accentColor: e.target.value})} />
                     </div>
                  </div>
                  <div className="form-group">
                     <label>주요 버튼 배경색</label>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={form.buttonColor || "#2563EB"} onChange={e => setForm({...form, buttonColor: e.target.value})} />
                        <input type="text" className="form-control" value={form.buttonColor || "#2563EB"} onChange={e => setForm({...form, buttonColor: e.target.value})} />
                     </div>
                  </div>
                  <div className="form-group">
                     <label>주요 버튼 글자색</label>
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="color" className="form-control" style={{ width: '60px', height: '42px', padding: '4px' }} value={form.buttonTextColor || "#ffffff"} onChange={e => setForm({...form, buttonTextColor: e.target.value})} />
                        <input type="text" className="form-control" value={form.buttonTextColor || "#ffffff"} onChange={e => setForm({...form, buttonTextColor: e.target.value})} />
                     </div>
                  </div>
               </div>
            </section>

         </div>

         {/* Right: Preview Preview (Simplified) */}
         <div>
            <div style={{ position: 'sticky', top: '120px' }}>
               <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-muted)' }}>미리보기 가이드</h3>
               <div style={{ 
                  background: form.theme === 'dark' ? '#0F172A' : (form.theme === 'glass' ? '#f0f4f8' : '#ffffff'), 
                  padding: '40px', 
                  borderRadius: '32px', 
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
               }}>
                  <div style={{ width: '100%', height: '180px', background: '#e2e8f0', borderRadius: '16px' }}></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                     <div style={{ fontSize: '24px', fontWeight: '900', color: form.titleColor }}>프리미엄 크루즈 상품명</div>
                     <div style={{ fontSize: '20px', fontWeight: '800', color: form.priceColor }}>₩ 2,500,000</div>
                     <div style={{ width: '60%', height: '10px', background: '#f1f5f9', borderRadius: '10px' }}></div>
                     <div style={{ width: '80%', height: '10px', background: '#f1f5f9', borderRadius: '10px' }}></div>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                     <div style={{ flex: 1, padding: '14px', borderRadius: '100px', background: form.buttonColor, color: form.buttonTextColor, fontWeight: '800', textAlign: 'center', fontSize: '14px' }}>예약하기</div>
                     <div style={{ flex: 1, padding: '14px', borderRadius: '100px', border: `1px solid ${form.accentColor}`, color: form.accentColor, fontWeight: '800', textAlign: 'center', fontSize: '14px' }}>장바구니</div>
                  </div>
               </div>
               <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>가상의 예시 화면이며, 실제 페이지에 실시간 반영됩니다.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminProductDetailEditor;
