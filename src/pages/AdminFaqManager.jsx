import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { 
  HelpCircle, Plus, Trash2, Edit3, ArrowUp, ArrowDown, 
  Check, Eye, EyeOff, Sparkles, RefreshCw, X, Save
} from 'lucide-react';

const AdminFaqManager = () => {
  const faqs = useQuery(api.faqs.listFaqs, { includeInactive: true }) || [];
  const addFaq = useMutation(api.faqs.addFaq);
  const updateFaq = useMutation(api.faqs.updateFaq);
  const deleteFaq = useMutation(api.faqs.deleteFaq);
  const reorderFaqs = useMutation(api.faqs.reorderFaqs);
  const seedInitialFaqs = useMutation(api.faqs.seedInitialFaqs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isSeeding, setIsSeeding] = useState(false);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('일반');
  const [isActive, setIsActive] = useState(true);

  const categories = ['ALL', '멤버십/혜택', '출입국/안내', '선내생활', '결제/정산', '기항지관광', '일반'];

  const filteredFaqs = selectedCategory === 'ALL' 
    ? faqs 
    : faqs.filter(f => (f.category || '일반') === selectedCategory);

  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('일반');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || '일반');
    setIsActive(faq.isActive !== false);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      alert('질문과 답변을 모두 입력해 주세요.');
      return;
    }

    try {
      if (editingFaq) {
        await updateFaq({
          id: editingFaq._id,
          question: question.trim(),
          answer: answer.trim(),
          category,
          isActive,
        });
      } else {
        await addFaq({
          question: question.trim(),
          answer: answer.trim(),
          category,
          isActive,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 이 FAQ 항목을 삭제하시겠습니까?')) return;
    try {
      await deleteFaq({ id });
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다: ' + err.message);
    }
  };

  const handleToggleActive = async (faq) => {
    try {
      await updateFaq({
        id: faq._id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        isActive: !faq.isActive,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveOrder = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;

    const orderedIds = newFaqs.map(f => f._id);
    try {
      await reorderFaqs({ orderedIds });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('기본 FAQ 6개 항목을 데이터베이스에 등록하시겠습니까?')) return;
    setIsSeeding(true);
    try {
      const res = await seedInitialFaqs();
      if (res.success) {
        alert('기본 FAQ가 성공적으로 등록되었습니다!');
      } else {
        alert(res.message || '이미 데이터가 존재합니다.');
      }
    } catch (err) {
      console.error(err);
      alert('시드 등록 오류: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={26} color="var(--accent-gold-dark)" /> 자주 묻는 질문 (FAQ) 관리
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            메인 홈 화면 및 고객 센터에 노출되는 FAQ 질문과 답변을 실시간으로 관리합니다.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {faqs.length === 0 && (
            <button 
              onClick={handleSeed} 
              disabled={isSeeding}
              className="sharp-btn-outline" 
              style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold-dark)', borderColor: 'var(--accent-gold-dark)' }}
            >
              <Sparkles size={16} /> 기본 FAQ 불러오기
            </button>
          )}
          <button 
            onClick={handleOpenAddModal} 
            className="sharp-btn-gold" 
            style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> 새 FAQ 등록
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: selectedCategory === cat ? '800' : '600',
              color: selectedCategory === cat ? '#ffffff' : '#64748B',
              background: selectedCategory === cat ? 'var(--navy-deep)' : '#FFFFFF',
              border: selectedCategory === cat ? '1px solid var(--navy-deep)' : '1px solid #E2E8F0',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'ALL' ? '전체 보기' : cat} ({cat === 'ALL' ? faqs.length : faqs.filter(f => (f.category || '일반') === cat).length})
          </button>
        ))}
      </div>

      {/* FAQ List Table / Cards */}
      {filteredFaqs.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '60px 20px', textAlign: 'center' }}>
          <HelpCircle size={44} color="#CBD5E1" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>
            등록된 FAQ 항목이 없습니다.
          </h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>
            '새 FAQ 등록' 버튼 또는 '기본 FAQ 불러오기'를 통해 질문을 추가해 보세요.
          </p>
          {faqs.length === 0 && (
            <button onClick={handleSeed} className="sharp-btn-gold" style={{ padding: '10px 22px', fontSize: '13px' }}>
              기본 FAQ 데이터 생성하기
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFaqs.map((faq, index) => {
            const actualIndex = faqs.findIndex(f => f._id === faq._id);
            return (
              <div 
                key={faq._id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '20px',
                  opacity: faq.isActive === false ? 0.6 : 1,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  {/* Order Controller */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '2px' }}>
                    <button 
                      onClick={() => handleMoveOrder(actualIndex, -1)}
                      disabled={actualIndex === 0}
                      style={{ background: 'none', border: '1px solid #E2E8F0', padding: '3px', cursor: actualIndex === 0 ? 'not-allowed' : 'pointer', color: actualIndex === 0 ? '#CBD5E1' : '#475569' }}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-gold-dark)' }}>
                      #{faq.order ?? (actualIndex + 1)}
                    </span>
                    <button 
                      onClick={() => handleMoveOrder(actualIndex, 1)}
                      disabled={actualIndex === faqs.length - 1}
                      style={{ background: 'none', border: '1px solid #E2E8F0', padding: '3px', cursor: actualIndex === faqs.length - 1 ? 'not-allowed' : 'pointer', color: actualIndex === faqs.length - 1 ? '#CBD5E1' : '#475569' }}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ background: '#F1F5F9', color: 'var(--navy-deep)', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
                        {faq.category || '일반'}
                      </span>
                      {faq.isActive === false && (
                        <span style={{ background: '#FEE2E2', color: '#EF4444', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>
                          숨김 상태
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--navy-deep)', marginBottom: '8px' }}>
                      Q. {faq.question}
                    </h4>

                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-line' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleActive(faq)}
                    title={faq.isActive === false ? "공개로 변경" : "비공개로 변경"}
                    style={{
                      background: faq.isActive === false ? '#F1F5F9' : '#ECFDF5',
                      color: faq.isActive === false ? '#64748B' : '#059669',
                      border: '1px solid #E2E8F0',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {faq.isActive === false ? <EyeOff size={14} /> : <Eye size={14} />}
                    {faq.isActive === false ? '숨김' : '노출중'}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(faq)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--navy-deep)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Edit3 size={14} /> 수정
                  </button>

                  <button
                    onClick={() => handleDelete(faq._id)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #FCA5A5',
                      padding: '8px 10px',
                      color: '#EF4444',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            border: '2px solid var(--navy-deep)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--navy-deep)', margin: 0 }}>
                {editingFaq ? 'FAQ 수정' : '새 FAQ 등록'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--navy-deep)', marginBottom: '6px' }}>
                  카테고리 분류
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                >
                  <option value="멤버십/혜택">멤버십/혜택</option>
                  <option value="출입국/안내">출입국/안내</option>
                  <option value="선내생활">선내생활</option>
                  <option value="결제/정산">결제/정산</option>
                  <option value="기항지관광">기항지관광</option>
                  <option value="일반">일반</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--navy-deep)', marginBottom: '6px' }}>
                  질문 (Question) *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="예: 다온넷크루즈 멤버십 할인은 어떻게 적용되나요?"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--navy-deep)', marginBottom: '6px' }}>
                  답변 (Answer) *
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="고객에게 안내할 상세 답변을 입력해 주세요."
                  rows={6}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid #CBD5E1', fontSize: '13px', outline: 'none', lineHeight: '1.6', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--navy-deep)' }}
                />
                <label htmlFor="isActiveCheck" style={{ fontSize: '13px', fontWeight: '700', color: '#334155', cursor: 'pointer' }}>
                  메인 화면 및 사이트에 즉시 노출
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="sharp-btn-outline"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="sharp-btn-gold"
                  style={{ padding: '10px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={16} /> 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminFaqManager;
