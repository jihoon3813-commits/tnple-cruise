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
    agreed: true
  });

  const formatPhone = (val) => {
    const numbers = val.replace(/[^0-9]/g, '').slice(0, 11);
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
    if (!form.name.trim()) {
      alert('고객 성함을 입력해 주세요.');
      return;
    }
    const rawNumbers = form.phone.replace(/[^0-9]/g, '');
    if (rawNumbers.length < 10) {
      alert('정확한 휴대폰 번호(10~11자리)를 입력해 주세요.');
      return;
    }
    if (!form.agreed) {
      alert('개인정보 수집 및 상담 이용에 동의해 주세요.');
      return;
    }
    setLoading(true);
    try {
      await addReservation({
        name: form.name.trim(),
        phone: form.phone,
        notes: form.notes.trim(),
        productTitle
      });
      setSuccess(true);
    } catch (err) {
      alert('신청 중 오류가 발생했습니다.');
    }
    setLoading(false);
  };

  const inputStyle = {
    background: '#FFFFFF',
    border: '1.5px solid #CBD5E1',
    color: '#0F172A', 
    padding: '12px 14px',
    borderRadius: '4px',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    WebkitAppearance: 'none'
  };

  const labelStyle = {
    fontSize: '13px', 
    fontWeight: '800', 
    marginBottom: '6px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px',
    color: 'var(--navy-deep)',
    letterSpacing: '-0.01em' 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', boxSizing: 'border-box' }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(11, 19, 43, 0.7)', backdropFilter: 'blur(5px)' }}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'relative', width: '100%', maxWidth: '480px', maxHeight: '92vh', background: '#ffffff', borderRadius: '8px', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {success ? (
              <div style={{ padding: '50px 30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
                <div style={{ width: '64px', height: '64px', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold-dark)', borderRadius: '50%', border: '2px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={36} />
                </div>
                <div>
                   <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px', color: 'var(--navy-deep)', fontFamily: "'Pretendard', sans-serif" }}>맞춤 상담 신청이 접수되었습니다</h2>
                   <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '13.5px', margin: 0 }}>
                     {config?.siteName || '다온넷크루즈'} 럭셔리 크루즈 전담 컨시어지가<br />
                     기재해 주신 연락처로 신속히 맞춤 안내를 드리겠습니다.
                   </p>
                </div>
                <button className="sharp-btn-dark" onClick={onClose} style={{ width: '100%', padding: '14px 0', fontSize: '15px', marginTop: '10px' }}>확인</button>
              </div>
            ) : (
              <>
                <div style={{ padding: '18px 24px', background: 'var(--navy-deep)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '10.5px', color: 'var(--accent-gold)', letterSpacing: '0.12em', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      {config?.siteNameEn || 'DAONNET CRUISE'}
                    </span>
                    <h2 style={{ fontSize: '17px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: 0, fontFamily: "'Pretendard', sans-serif" }}>
                      1:1 크루즈 맞춤 상담 신청
                    </h2>
                  </div>
                  <button 
                    onClick={onClose} 
                    aria-label="닫기"
                    style={{ border: 'none', background: 'rgba(255,255,255,0.1)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ffffff', transition: 'background 0.2s' }}
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ padding: '22px 24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div>
                      <label style={labelStyle}>
                        <Package size={14} color="var(--accent-gold-dark)" /> 신청 상품 / 관심 노선
                      </label>
                      <div style={{ ...inputStyle, background: '#F8FAFC', color: 'var(--navy-deep)', fontWeight: '700', fontSize: '13.5px', lineHeight: '1.4', border: '1.5px solid #E2E8F0' }}>
                        {productTitle || "동남아 럭셔리 크루즈 (싱가포르·말레이시아·태국)"}
                      </div>
                    </div>

                    <div className="booking-modal-inputs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                      <div>
                        <label style={labelStyle}>
                          <User size={14} color="var(--accent-gold-dark)" /> 고객 성함 <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input 
                          style={inputStyle}
                          placeholder="성함을 입력해 주세요 (예: 홍길동)" 
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          required
                          autoComplete="name"
                        />
                      </div>

                      <div>
                        <label style={labelStyle}>
                          <Phone size={14} color="var(--accent-gold-dark)" /> 연락처 (휴대폰 번호) <span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input 
                          style={{ ...inputStyle, letterSpacing: '0.04em', fontWeight: '600' }}
                          type="tel"
                          inputMode="tel"
                          pattern="[0-9\-]*"
                          autoComplete="tel"
                          placeholder="010-0000-0000 (숫자만 입력)" 
                          value={form.phone}
                          onChange={handlePhoneChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={labelStyle}>
                        <FileText size={14} color="var(--accent-gold-dark)" /> 문의 사항 (희망 일정, 인원 등)
                      </label>
                      <textarea 
                        style={{ ...inputStyle, resize: 'none', lineHeight: '1.5', height: '76px' }}
                        placeholder="희망하시는 출발 시기, 인원수나 궁금하신 점을 편하게 적어주세요." 
                        value={form.notes}
                        onChange={e => setForm({ ...form, notes: e.target.value })}
                      />
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '12.5px', fontWeight: '700', color: '#334155' }}>
                           <input 
                             type="checkbox" 
                             checked={form.agreed} 
                             onChange={e => setForm({...form, agreed: e.target.checked})} 
                             style={{ width: '18px', height: '18px', accentColor: 'var(--navy-deep)', cursor: 'pointer' }} 
                           />
                           <span>개인정보 수집 및 상담 이용 동의</span>
                        </label>
                        <button 
                          type="button" 
                          onClick={() => setShowPrivacyDetail(true)} 
                          style={{ border: 'none', background: 'none', fontSize: '11.5px', color: '#64748B', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                        >
                            약관 보기 <ChevronRight size={13} />
                        </button>
                    </div>

                    <button 
                      type="submit" 
                      className="sharp-btn-gold" 
                      disabled={loading}
                      style={{ 
                        width: '100%', 
                        padding: '15px 0', 
                        fontSize: '15.5px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        borderRadius: '4px',
                        boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)'
                      }}
                    >
                      {loading ? <Loader2 className="animate-spin" size={18} /> : (
                        <><span>맞춤 상담 신청하기</span> <ArrowRight size={16} /></>
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
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#fff', zIndex: 10, padding: '24px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--navy-deep)', margin: 0 }}>개인정보 수집 및 이용 동의</h3>
                            <button onClick={() => setShowPrivacyDetail(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', fontSize: '12.5px', lineHeight: '1.7', color: '#475569', background: '#F8FAFC', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                            <div style={{ whiteSpace: 'pre-wrap' }}>{config.privacyPolicy}</div>
                        </div>
                        <button className="sharp-btn-dark" onClick={() => setShowPrivacyDetail(false)} style={{ width: '100%', marginTop: '16px', padding: '12px 0', justifyContent: 'center' }}>동의하고 닫기</button>
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
