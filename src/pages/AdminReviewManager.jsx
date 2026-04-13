import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Star, Trash2, Plus, X, MessageSquare, User, Smile } from 'lucide-react';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h2 style={{ fontSize: '20px', fontWeight: '800' }}>고객 여행 후기 관리</h2>
         <button className="luxury-btn" onClick={() => setIsAdding(true)}>
            <Plus size={16} /> 신규 리뷰 등록
         </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {config.reviews.map(review => (
          <motion.div 
            key={review.id} 
            className="admin-card" 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '15px' }}>{review.user}</h4>
                  <div style={{ display: 'flex', color: 'var(--accent)', marginTop: '2px' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={i < review.rating ? "var(--accent)" : "none"} />)}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteReview(review.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', background: 'var(--bg-sub)', padding: '16px', borderRadius: '12px' }}>
               "{review.content}"
            </p>

            {review.images && review.images[0] && (
              <img src={review.images[0]} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }} />
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', 
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' 
          }}>
            <motion.div 
              className="admin-card" 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: '500px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Smile className="text-primary" size={20} />
                  <h2 style={{ fontSize: '20px', fontWeight: '800' }}>새 소중한 후기 등록</h2>
                </div>
                <button onClick={() => setIsAdding(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>회원 이름</label>
                  <input 
                    className="form-control" 
                    value={newReview.user}
                    onChange={e => setNewReview({...newReview, user: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>만족도 평점 (1-5)</label>
                  <input 
                    type="number" className="form-control" min={1} max={5}
                    value={newReview.rating}
                    onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>후기 메시지</label>
                  <textarea 
                    className="form-control" rows={4}
                    value={newReview.content}
                    onChange={e => setNewReview({...newReview, content: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>추천 이미지 URL</label>
                  <input 
                    className="form-control" 
                    value={newReview.images[0]}
                    onChange={e => setNewReview({...newReview, images: [e.target.value]})}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button className="luxury-btn outline" style={{ flex: 1, borderRadius: '10px' }} onClick={() => setIsAdding(false)}>취소</button>
                  <button className="luxury-btn" style={{ flex: 1, borderRadius: '10px' }} onClick={handleSave}>리뷰 등록</button>
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
