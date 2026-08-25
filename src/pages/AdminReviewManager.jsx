import React, { useState, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Star, Trash2, Edit2, Plus, X, MessageSquare, User, Smile, Upload, Loader2, PlusCircle, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeMedia from '../components/SafeMedia';

const MultiMediaInput = ({ label, values = [], onChange, uploadFile }) => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  
  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const storageId = await uploadFile(file);
      onChange([...values, `storage:${storageId}`]);
    } catch (err) {
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (idx) => {
    const newValues = values.filter((_, i) => i !== idx);
    onChange(newValues);
  };

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '8px', display: 'block' }}>
        {label} ({values.length}장)
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginTop: '8px' }}>
        {values.map((url, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', border: '1px solid #CBD5E1', overflow: 'hidden' }}>
            <SafeMedia src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              onClick={() => removeImage(i)} 
              style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', border: 'none', padding: '3px', cursor: 'pointer', display: 'flex', zIndex: 10 }}
            >
              <X size={12}/>
            </button>
          </div>
        ))}
        <div 
          onClick={() => fileRef.current.click()}
          style={{ aspectRatio: '1', border: '2px dashed #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#F8FAFC' }}
        >
          {loading ? <Loader2 className="animate-spin" size={18} color="var(--navy-deep)" /> : <PlusCircle size={18} color="var(--navy-deep)" />}
          <span style={{ fontSize: '10px', color: '#64748B', marginTop: '4px', fontWeight: '700' }}>사진 추가</span>
        </div>
        <input type="file" ref={fileRef} hidden onChange={onFileChange} />
      </div>
    </div>
  );
};

const AdminReviewManager = () => {
  const { config, addReview, updateReview, deleteReview, uploadFile, triggerVercelDeploy } = useConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'featured'
  const [form, setForm] = useState({
    title: "",
    author: "",
    rating: 5,
    content: "",
    date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    images: [],
    productTitle: "",
    showOnHome: true
  });

  const reviewsList = config.reviews || [];
  const featuredCount = reviewsList.filter(r => r.showOnHome).length;

  const displayReviews = filterMode === 'featured' 
    ? reviewsList.filter(r => r.showOnHome)
    : reviewsList;

  const handleEdit = (review) => {
    setEditingId(review.id);
    setForm({
      title: review.title || "",
      author: review.author || review.user || "",
      rating: review.rating || 5,
      content: review.content || "",
      date: review.date || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      images: review.images || [],
      productTitle: review.productTitle || "",
      showOnHome: review.showOnHome ?? true
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setForm({ 
      title: "",
      author: "", 
      rating: 5, 
      content: "", 
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      images: [], 
      productTitle: "",
      showOnHome: true
    });
    setIsModalOpen(true);
  };

  const handleToggleHome = async (review) => {
    try {
      const nextVal = !(review.showOnHome ?? false);
      await updateReview(review.id, { showOnHome: nextVal });
      await triggerVercelDeploy();
    } catch (e) {
      alert("노출 상태 변경 실패: " + e.message);
    }
  };

  const handleSave = async () => {
    if (!form.author || !form.content) {
      alert("회원 성함과 후기 내용을 입력해주세요.");
      return;
    }
    try {
      if (editingId) {
        await updateReview(editingId, form);
      } else {
        await addReview(form);
      }
      await triggerVercelDeploy();
      setIsModalOpen(false);
    } catch (e) {
      alert("저장 실패: " + e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: "'Pretendard', sans-serif" }}>
      
      {/* Top Header & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--navy-deep)', margin: 0 }}>고객 여행 후기 관리</h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', margin: 0 }}>
            후기 등록 및 <strong>메인 화면 3대 추천 후기 노출 여부</strong>를 지정할 수 있습니다. (현재 메인 노출: {featuredCount}개)
          </p>
        </div>
        <button 
          className="sharp-btn-dark" 
          onClick={handleAddNew}
          style={{ padding: '12px 24px', fontSize: '13px' }}
        >
          <Plus size={16} /> 신규 후기 등록
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
        <button
          onClick={() => setFilterMode('all')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            background: filterMode === 'all' ? 'var(--navy-deep)' : '#F1F5F9',
            color: filterMode === 'all' ? '#FFFFFF' : '#475569',
            cursor: 'pointer'
          }}
        >
          전체 후기 ({reviewsList.length})
        </button>
        <button
          onClick={() => setFilterMode('featured')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            background: filterMode === 'featured' ? 'var(--accent-gold-dark)' : '#F1F5F9',
            color: filterMode === 'featured' ? '#FFFFFF' : '#475569',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Star size={14} fill="currentColor" /> 메인 노출 중 ({featuredCount})
        </button>
      </div>

      {/* Reviews Grid List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
        {displayReviews.map(review => {
          const isFeatured = review.showOnHome ?? true;
          return (
            <motion.div 
              key={review.id} 
              style={{
                background: '#FFFFFF',
                border: isFeatured ? '2px solid var(--accent-gold)' : '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                {/* Header Badge & Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleHome(review)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        background: isFeatured ? 'var(--accent-gold)' : '#F1F5F9',
                        color: isFeatured ? '#0B132B' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="클릭하여 메인 노출 여부 변경"
                    >
                      <Star size={12} fill={isFeatured ? '#0B132B' : 'none'} />
                      {isFeatured ? '메인 노출 ON' : '메인 노출 OFF'}
                    </button>
                    {review.date && (
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>{review.date}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleEdit(review)} 
                      style={{ color: 'var(--navy-deep)', border: '1px solid #CBD5E1', padding: '4px 8px', background: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                    >
                      수정
                    </button>
                    <button 
                      onClick={async () => { 
                        if (window.confirm("이 후기를 삭제하시겠습니까?")) {
                          await deleteReview(review.id); 
                          await triggerVercelDeploy(); 
                        }
                      }} 
                      style={{ color: '#ef4444', border: '1px solid #FECDD3', padding: '4px 8px', background: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}
                    >
                      삭제
                    </button>
                  </div>
                </div>

                {/* Rating & Title */}
                <div style={{ display: 'flex', gap: '3px', color: '#EAB308', marginBottom: '8px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < (review.rating || 5) ? "#EAB308" : "none"} color="#EAB308" />
                  ))}
                </div>

                {review.title && (
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '8px', lineHeight: '1.4' }}>
                    "{review.title}"
                  </h4>
                )}

                {/* Content */}
                <p style={{ color: '#475569', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px', background: '#F8FAFC', padding: '12px 14px', border: '1px solid #F1F5F9' }}>
                  {review.content}
                </p>

                {/* Images Preview */}
                {review.images && review.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '6px', marginBottom: '16px' }}>
                    {review.images.map((img, idx) => (
                      <div key={idx} style={{ height: '60px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                        <SafeMedia src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Author & Route Bottom Info */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '28px', height: '28px', background: 'var(--navy-deep)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '11px' }}>
                    {(review.author || review.user || "회")[0]}
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)' }}>{review.author || review.user}</span>
                  </div>
                </div>
                {review.productTitle && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-gold-dark)', fontWeight: '700' }}>
                    {review.productTitle}
                  </span>
                )}
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', 
            zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' 
          }}>
            <motion.div 
              style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', background: '#FFFFFF', padding: '36px', border: '2px solid var(--navy-deep)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--navy-deep)', margin: 0 }}>
                  {editingId ? "여행 후기 수정" : "새 여행 후기 등록"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Checkbox: Main Page Featured */}
                <div style={{ background: '#F8FAFC', border: '1px solid var(--accent-gold)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onClick={() => setForm({...form, showOnHome: !form.showOnHome})}
                >
                  <input 
                    type="checkbox"
                    checked={form.showOnHome}
                    onChange={e => setForm({...form, showOnHome: e.target.checked})}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--navy-deep)' }}
                  />
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--navy-deep)' }}>⭐ 메인 화면 3대 추천 후기로 노출</strong>
                    <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>체크 시 메인 페이지 하단 고객후기 섹션에 우선 표시됩니다.</p>
                  </div>
                </div>

                {/* Review Title */}
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '6px', display: 'block' }}>
                    후기 한 줄 제목 (예: "부모님 칠순 기념 크루즈 여행, 최고의 선택이었습니다")
                  </label>
                  <input 
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="감동적인 후기 제목을 입력하세요"
                  />
                </div>

                {/* Author & Product Route */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '6px', display: 'block' }}>
                      회원 성함 (예: 김*숙 회원님)
                    </label>
                    <input 
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                      value={form.author}
                      onChange={e => setForm({...form, author: e.target.value})}
                      placeholder="성함을 입력하세요"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '6px', display: 'block' }}>
                      다녀온 코스/상품명 (예: 동남아 3개국 5박 6일)
                    </label>
                    <input 
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                      value={form.productTitle}
                      onChange={e => setForm({...form, productTitle: e.target.value})}
                      placeholder="예: 싱가포르·말레이시아 5박 6일"
                    />
                  </div>
                </div>

                {/* Rating & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '6px', display: 'block' }}>
                      만족도 평점 (1~5점)
                    </label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '38px' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star 
                          key={s} 
                          size={24} 
                          onClick={() => setForm({...form, rating: s})} 
                          fill={s <= form.rating ? "#EAB308" : "none"} 
                          color="#EAB308" 
                          style={{ cursor: 'pointer' }} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '6px', display: 'block' }}>
                      작성/여행 일자 (예: 2026.02.18)
                    </label>
                    <input 
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                      value={form.date}
                      onChange={e => setForm({...form, date: e.target.value})}
                      placeholder="2026.02.18"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '6px', display: 'block' }}>
                    후기 본문 내용
                  </label>
                  <textarea 
                    rows={5}
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', lineHeight: '1.6' }}
                    value={form.content}
                    onChange={e => setForm({...form, content: e.target.value})}
                    placeholder="소중한 여행 경험을 상세하게 적어주세요."
                  />
                </div>

                {/* Multi Media Images */}
                <MultiMediaInput 
                  label="여행 현장 사진 업로드" 
                  values={form.images} 
                  onChange={v => setForm({...form, images: v})} 
                  uploadFile={uploadFile} 
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <button 
                    className="sharp-btn-outline" 
                    style={{ padding: '14px 0', fontSize: '13px' }} 
                    onClick={() => setIsModalOpen(false)}
                  >
                    취소
                  </button>
                  <button 
                    className="sharp-btn-dark" 
                    style={{ padding: '14px 0', fontSize: '13px' }} 
                    onClick={handleSave}
                  >
                    후기 저장하기
                  </button>
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
