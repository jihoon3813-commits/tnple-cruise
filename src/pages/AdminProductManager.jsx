import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Edit, Save, X, Package, CreditCard, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProductManager = () => {
  const { config, addProduct, updateProduct } = useConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      id: `product-${Date.now()}`,
      title: "",
      description: "",
      price: 0,
      thumbnails: [""],
      paymentType: "full",
      downPayment: 0,
      installments: 12,
      schedule: [{ day: 1, title: "", content: "" }],
      scheduleImage: ""
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const exists = config.products.find(p => p.id === currentProduct.id);
    if (exists) {
      updateProduct(currentProduct.id, currentProduct);
    } else {
      addProduct(currentProduct);
    }
    setIsEditing(false);
    setCurrentProduct(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="luxury-btn" onClick={handleAddNew}>
          <Plus size={16} /> 신규 크루즈 등록
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {config.products.map(product => (
          <motion.div 
            key={product.id} 
            className="admin-card-glass" 
            style={{ padding: '0', overflow: 'hidden' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{ height: '200px', position: 'relative' }}>
              <img src={product.thumbnails[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ 
                position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' 
              }}></div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                 <p style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: '800' }}>Product ID: {product.id.slice(0, 8)}</p>
                 <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{product.title}</h3>
              </div>
              <button 
                onClick={() => handleEdit(product)}
                style={{ 
                  position: 'absolute', top: '16px', right: '16px', 
                  background: 'var(--gold-gradient)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' 
                }}
              >
                <Edit size={16} />
              </button>
            </div>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '800' }} className="text-gradient">{product.price.toLocaleString()} KRW</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="glass-light" style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '10px' }}>
                  {product.paymentType === 'full' ? '일시불' : '분할납부'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isEditing && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(20px)', 
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' 
          }}>
            <motion.div 
              className="admin-card-glass" 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{ width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Package className="text-gold" />
                  <h2 style={{ fontSize: '24px', fontWeight: '800' }}>상품 마스터 정보 편집</h2>
                </div>
                <button onClick={() => setIsEditing(false)}><X size={24} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-gray)', marginBottom: '10px', display: 'block' }}>전시 상품명</label>
                  <input 
                    className="glass-light" 
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={currentProduct.title} 
                    onChange={e => setCurrentProduct({...currentProduct, title: e.target.value})} 
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-gray)', marginBottom: '10px', display: 'block' }}>상품 슬로건 및 설명</label>
                  <textarea 
                    className="glass-light" 
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={currentProduct.description} 
                    onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-gray)', marginBottom: '10px', display: 'block' }}>판매가액 (KRW)</label>
                  <input 
                    type="number" className="glass-light" 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={currentProduct.price} 
                    onChange={e => setCurrentProduct({...currentProduct, price: parseInt(e.target.value)})} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-gray)', marginBottom: '10px', display: 'block' }}>결제 솔루션</label>
                  <select 
                    className="glass-light" 
                    style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={currentProduct.paymentType}
                    onChange={e => setCurrentProduct({...currentProduct, paymentType: e.target.value})}
                  >
                    <option value="full" style={{ background: '#0F172A' }}>일시불 즉시할인 적용</option>
                    <option value="split" style={{ background: '#0F172A' }}>선납금 + 월 분할납부</option>
                  </select>
                </div>

                {currentProduct.paymentType === 'split' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', background: 'rgba(212, 175, 55, 0.05)', padding: '24px', borderRadius: '16px' }}
                  >
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--gold-primary)', marginBottom: '10px', display: 'block' }}>초기 선납금 (KRW)</label>
                      <input 
                        type="number" className="glass-light" 
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--gold-primary)', color: '#fff' }}
                        value={currentProduct.downPayment} 
                        onChange={e => setCurrentProduct({...currentProduct, downPayment: parseInt(e.target.value)})} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', color: 'var(--gold-primary)', marginBottom: '10px', display: 'block' }}>납부 기간 (개월)</label>
                      <input 
                        type="number" className="glass-light" 
                        style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--gold-primary)', color: '#fff' }}
                        value={currentProduct.installments} 
                        onChange={e => setCurrentProduct({...currentProduct, installments: parseInt(e.target.value)})} 
                      />
                    </div>
                  </motion.div>
                )}

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-gray)', marginBottom: '10px', display: 'block' }}>대표 썸네일 URL</label>
                  <input 
                    className="glass-light" 
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={currentProduct.thumbnails[0]} 
                    onChange={e => setCurrentProduct({...currentProduct, thumbnails: [e.target.value]})} 
                  />
                </div>
              </div>

              <div style={{ marginTop: '48px', display: 'flex', gap: '20px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '32px' }}>
                <button 
                  className="luxury-btn outline" 
                  onClick={() => setIsEditing(false)}
                >
                  변경 취소
                </button>
                <button 
                  className="luxury-btn" 
                  onClick={handleSave}
                >
                  데이터 저장
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductManager;
