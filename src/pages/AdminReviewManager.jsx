import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Star, Trash2, Plus, X, MessageSquare, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminReviewManager = () => {
  const { config, addReview, deleteReview } = useConfig();
  const [isAdding, setIsAdding] = useState(false);
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 5,
    content: "",
    images: [""]
  });

  const handleSave = () => {
    addReview({ ...newReview, id: `review-${Date.now()}` });
    setIsAdding(false);
    setNewReview({ user: "", rating: 5, content: "", images: [""] });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="luxury-btn" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> 신규 리뷰 등록
        </button>
      </div>

      <div style={{ columns: '2 400px', columnGap: '24px' }}>
        {config.reviews.map(review => (
          <motion.div 
            key={review.id} 
            className="admin-card-glass" 
            style={{ marginBottom: '24px', breakInside: 'avoid', padding: '24px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} className="text-gold" />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '16px' }}>{review.user}</h4>
                  <div style={{ display: 'flex', color: 'var(--gold-primary)', marginTop: '4px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "var(--gold-primary)" : "none"} />)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteReview(review.id)}
                style={{ color: '#ef4444', opacity: 0.5 }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-gray)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
               "{review.content}"
            </p>

            {review.images && review.images[0] && (
              <img 
                src={review.images[0]} 
                alt="Review" 
                style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }} 
              />
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)', 
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
          }}>
            <motion.div 
              className="admin-card-glass" 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ width: '100%', maxWidth: '500px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MessageSquare className="text-gold" size={20} />
                  <h2 style={{ fontSize: '20px', fontWeight: '700' }}>신규 리뷰 작성</h2>
                </div>
                <button onClick={() => setIsAdding(false)}><X size={24} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>작성자 이름</label>
                  <input 
                    className="glass-light" 
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={newReview.user}
                    onChange={e => setNewReview({...newReview, user: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>매칭 평점 (1-5)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[1,2,3,4,5].map(nu => (
                      <button 
                        key={nu}
                        onClick={() => setNewReview({...newReview, rating: nu})}
                        style={{ 
                          flex: 1, padding: '10px', borderRadius: '8px', 
                          background: newReview.rating >= nu ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                          color: newReview.rating >= nu ? '#000' : '#fff'
                        }}
                      >
                        {nu}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>리뷰 메시지</label>
                  <textarea 
                    className="glass-light" 
                    style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    rows={4}
                    value={newReview.content}
                    onChange={e => setNewReview({...newReview, content: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>포토 후기 URL</label>
                  <input 
                    className="glass-light" 
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    value={newReview.images[0]}
                    onChange={e => setNewReview({...newReview, images: [e.target.value]})}
                  />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                  <button className="luxury-btn outline" style={{ flex: 1 }} onClick={() => setIsAdding(false)}>취소</button>
                  <button className="luxury-btn" style={{ flex: 1 }} onClick={handleSave}>리뷰 등록하기</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReviewManager;
