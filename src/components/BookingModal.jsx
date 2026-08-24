import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Package, FileText, CheckCircle2, Loader2, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const BookingModal = ({ isOpen, onClose, productTitle, accentColor }) => {
  const { addReservation, config } = useConfig();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPrivacyDetail, setShowPrivacyDetail] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    notes: '',
    agreed: false
  });

  const formatPhone = (val) => {
    const numbers = val.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setForm({ ...form, phone: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || form.phone.length < 10) {
      alert('이름과 정확한 연락처를 입력해 주세요.');
      return;
    }
    if (!form.agreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }
    setLoading(true);
    try {
      await addReservation({
        name: form.name,
        phone: form.phone,
        notes: form.notes,
        productTitle
      });
      setSuccess(true);
    } catch (err) {
      alert('신청 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  const inputStyle = {
    background: '#ffffff',
    border: '1px solid #d1d5db',
    color: '#0F172A', 
    padding: '14px 16px',
    borderRadius: '0px',
    fontSize: '14px',
    width: '100%',
    transition: '0.2s',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '12px', 
    fontWeight: '800', 
    marginBottom: '6px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px',
    color: '#1e293b',
    letterSpacing: '0.02em' 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(11, 19, 43, 0.6)', backdropFilter: 'blur(4px)' }}
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{ position: 'relative', width: '100%', maxWidth: '520px', background: '#fff', borderRadius: '0px', overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0' }}
          >
            {success ? (
              <div style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ padding: '16px', background: 'rgba(197, 168, 128, 0.15)', color: 'var(--accent-gold-dark)', borderRadius: '0px', border: '1px solid var(--accent-gold)' }}>
                  <CheckCircle2 size={40} />
                </div>
                <div>
                   <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '10px', color: '#0F172A', fontFamily: "'Pretendard', sans-serif" }}>상담 신청이 접수되었습니다</h2>
                   <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '14px' }}>
                     티앤플 코리아 럭셔리 크루즈 전담 컨시어지가<br />신속하게 맞춤 상담을 안내해 드리겠습니다.
                   </p>
                </div>
                <button className="sharp-btn-dark" onClick={onClose} style={{ width: '100%', marginTop: '12px' }}>확인</button>
              </div>
            ) : (
              <>
                <div style={{ padding: '20px 32px', background: 'var(--navy-deep)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--accent-gold)', letterSpacing: '0.1em', fontWeight: '700', textTransform: 'uppercase' }}>T&PLE KOREA CRUISE</span>
                    <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.01em' }}>1:1 크루즈 맞춤 상담 신청</h2>
                  </div>
                  <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}><X size={22} /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ padding: '28px 32px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div>
                      <label style={labelStyle}><Package size={14} color="var(--accent-gold-dark)" /> 신청 상품 / 관심 노선</label>
                      <input style={{ ...inputStyle, background: '#f8fafc', color: '#334155', fontWeight: '700' }} value={productTitle || "동남아 럭셔리 크루즈 (싱가포르·말레이시아·태국)"} readOnly />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={labelStyle}><User size={14} color="var(--accent-gold-dark)" /> 고객 성함</label>
                        <input 
                          style={inputStyle}
                          placeholder="홍길동" 
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label style={labelStyle}><Phone size={14} color="var(--accent-gold-dark)" /> 연락처</label>
                        <input 
                          style={inputStyle}
                          type="tel"
                          inputMode="numeric"
                          placeholder="010-0000-0000" 
                          value={form.phone}
                          onChange={handlePhoneChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}><FileText size={14} color="var(--accent-gold-dark)" /> 문의 사항 (희망 일정, 인원 등)</label>
                      <textarea 
                        style={{ ...inputStyle, resize: 'none' }}
                        placeholder="희망하시는 출발 시기나 궁금하신 점을 편하게 적어주세요." 
                        rows={2} 
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>

                    <div style={{ background: '#f8fafc', padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: '0px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#334155' }}>
                           <input type="checkbox" checked={form.agreed} onChange={e => setForm({...form, agreed: e.target.checked})} style={{ width: '16px', height: '16px', borderRadius: '0px', accentColor: 'var(--navy-deep)' }} />
                           개인정보 수집 및 상담 이용 동의
                        </label>
                        <button type="button" onClick={() => setShowPrivacyDetail(true)} style={{ border: 'none', background: 'none', fontSize: '11px', color: '#64748b', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            약관 보기 <ChevronRight size={12} />
                        </button>
                    </div>

                    <button 
                      type="submit" 
                      className="sharp-btn-gold" 
                      disabled={loading}
                      style={{ 
                        width: '100%', 
                        padding: '16px', 
                        fontSize: '15px',
                        cursor: 'pointer'
                      }}
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>상담 신청하기 <ArrowRight size={16} style={{ marginLeft: '4px' }} /></>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            <AnimatePresence>
                {showPrivacyDetail && (
                    <motion.div 
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', zIndex: 10, padding: '32px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>개인정보 수집 및 이용</h3>
                            <button onClick={() => setShowPrivacyDetail(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={22} /></button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', fontSize: '12px', lineHeight: '1.7', color: '#475569', background: '#f8fafc', padding: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{config.privacyPolicy}</div>
                        </div>
                        <button className="sharp-btn-outline" onClick={() => setShowPrivacyDetail(false)} style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>확인</button>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
