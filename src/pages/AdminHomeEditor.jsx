import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection, uploadFile } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);
  const [activeSectionId, setActiveSectionId] = useState(null);

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
  }, [config.hero]);

  const handleHeroSave = async () => {
    await updateHero(heroForm);
    alert('홈페이지 대문 설정이 저장되었습니다.');
  };

  const handleSectionUpdate = async (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    if (!section) return;
    await updateSection(id, { ...section, [field]: value });
  };

  const handleMoveSection = async (id, direction) => {
    const idx = config.sections.findIndex(s => s.id === id);
    if (direction === 'up' && idx > 0) {
      const current = config.sections[idx];
      const prev = config.sections[idx - 1];
      await updateSection(current.id, { ...current, order: idx - 1 });
      await updateSection(prev.id, { ...prev, order: idx });
    } else if (direction === 'down' && idx < config.sections.length - 1) {
      const current = config.sections[idx];
      const next = config.sections[idx + 1];
      await updateSection(current.id, { ...current, order: idx + 1 });
      await updateSection(next.id, { ...next, order: idx });
    }
  };

  const handleAddNewSection = async () => {
    await addSection({
      title: "새로운 패키지 소개",
      content: "이 여정의 특별한 점을 설명해 주세요...",
      image: "",
      images: [],
      layout: "left",
      style: "classic",
      showButton: true,
      buttonLink: "",
      bgColor: "#ffffff",
      bgType: "color"
    });
  };

  const handleRemoveSection = async (id) => {
    if (window.confirm('이 섹션을 삭제하시겠습니까?')) {
      await deleteSection(id);
    }
  };

  const MediaInput = ({ label, value, onChange }) => {
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    const onFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setLoading(true);
      const storageId = await uploadFile(file);
      onChange(`storage:${storageId}`);
      setLoading(false);
    };

    return (
      <div className="form-group">
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>{label}</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input className="form-control" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="URL 입력 또는 업로드" />
          <button className="luxury-btn outline" style={{ padding: '0 12px' }} onClick={() => fileRef.current.click()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          </button>
          <input type="file" ref={fileRef} hidden onChange={onFileChange} />
        </div>
      </div>
    );
  };

  const MultiMediaInput = ({ label, values = [], onChange }) => {
    const [loading, setLoading] = useState(false);
    const fileRef = useRef();

    const onFileChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setLoading(true);
      const storageId = await uploadFile(file);
      onChange([...values, `storage:${storageId}`]);
      setLoading(false);
    };

    const removeImage = (idx) => {
      onChange(values.filter((_, i) => i !== idx));
    };

    return (
      <div className="form-group" style={{ gridColumn: 'span 2' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>{label}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
          {values.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              {src.startsWith('storage:') ? (
                <div style={{ width: '100%', height: '100%', background: 'var(--bg-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ImageIcon size={20} color="var(--primary)" /></div>
              ) : (
                <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <button onClick={() => removeImage(idx)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={12} />
              </button>
            </div>
          ))}
          <button 
            className="luxury-btn outline" 
            style={{ height: '100px', borderRadius: '12px', borderStyle: 'dashed', flexDirection: 'column', gap: '8px' }}
            onClick={() => fileRef.current.click()}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
            <span style={{ fontSize: '11px', fontWeight: '700' }}>추가하기</span>
          </button>
          <input type="file" ref={fileRef} hidden onChange={onFileChange} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Hero Editor */}
      <section className="admin-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Monitor size={24} /></div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>히어로 브랜딩 설정</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>메인 헤드라인</label>
            <textarea 
              className="form-control" 
              value={heroForm?.title || ""} 
              onChange={e => setHeroForm({...heroForm, title: e.target.value})}
              rows={3}
            />
          </div>
          <MediaInput label="배경 미디어 (이미지/영상)" value={heroForm?.bgUrl} onChange={val => setHeroForm({...heroForm, bgUrl: val})} />
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>미디어 타입</label>
            <select className="form-control" value={heroForm?.bgType || "image"} onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}>
              <option value="image">이미지</option>
              <option value="video">영상</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
           <button className="luxury-btn" onClick={handleHeroSave}>
             <Save size={18} /> 설정 저장하기
           </button>
        </div>
      </section>

      {/* Sections Config */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Layers size={21} /></div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>홍보 섹션 관리</h2>
          </div>
          <button className="luxury-btn outline" style={{ borderRadius: '12px', padding: '10px 20px', fontSize: '13px' }} onClick={handleAddNewSection}>
            <Plus size={16} /> 신규 섹션
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {config.sections.map((section, index) => (
            <div key={section.id} className="admin-card" style={{ 
              padding: '0', overflow: 'hidden', 
              border: activeSectionId === section.id ? '2px solid var(--primary)' : '1px solid var(--border-light)' 
            }}>
              <div 
                style={{ padding: '20px 32px', background: 'var(--bg-sub)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                     <button onClick={(e) => { e.stopPropagation(); handleMoveSection(section.id, 'up'); }} disabled={index === 0} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}><ChevronUp size={14} /></button>
                     <button onClick={(e) => { e.stopPropagation(); handleMoveSection(section.id, 'down'); }} disabled={index === config.sections.length - 1} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}><ChevronDown size={14} /></button>
                   </div>
                   <div style={{ width: '28px', height: '28px', background: 'var(--primary)', color: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>{index + 1}</div>
                   <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{section.title || '제목 없음'}</h3>
                   <span style={{ fontSize: '11px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{section.style}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={(e) => { e.stopPropagation(); handleRemoveSection(section.id); }} style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
                </div>
              </div>
              
              {activeSectionId === section.id && (
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {/* Style Settings */}
                  <div className="style-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {[
                      { id: 'classic', label: 'Classic Side', icon: <Layers size={20} /> },
                      { id: 'split-card', label: 'Split Card', icon: <Palette size={20} /> },
                      { id: 'minimal-centered', label: 'Minimal Center', icon: <Type size={20} /> }
                    ].map(style => (
                      <div 
                        key={style.id}
                        onClick={() => handleSectionUpdate(section.id, 'style', style.id)}
                        style={{ 
                          padding: '24px 16px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                          background: section.style === style.id ? 'var(--bg-sub)' : 'transparent',
                          border: section.style === style.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                          transition: 'var(--transition-smooth)'
                        }}
                      >
                        <div style={{ margin: '0 auto 12px', width: '40px', height: '40px', borderRadius: '10px', background: section.style === style.id ? 'var(--primary)' : 'var(--bg-sub)', color: section.style === style.id ? '#fff' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {style.icon}
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: '700' }}>{style.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Content Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>섹션 제목</label>
                      <input className="form-control" value={section.title || ""} onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>상세 설명</label>
                      <textarea className="form-control" rows={4} value={section.content || ""} onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)} />
                    </div>
                    
                    <MultiMediaInput label="홍보 이미지들 (여러 개 업로드 가능)" values={section.images || []} onChange={val => handleSectionUpdate(section.id, 'images', val)} />

                    <div className="form-group">
                       <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>레이아웃 / 텍스트 위치</label>
                       <select className="form-control" value={section.layout || "left"} onChange={e => handleSectionUpdate(section.id, 'layout', e.target.value)}>
                         <option value="left">왼쪽</option>
                         <option value="right">오른쪽</option>
                       </select>
                    </div>
                  </div>

                  {/* Background & Button Settings */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div className="form-group">
                       <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>배경 테마</label>
                       <select className="form-control" value={section.bgType || "color"} onChange={e => handleSectionUpdate(section.id, 'bgType', e.target.value)}>
                         <option value="color">단색 배경</option>
                         <option value="image">이미지 배경</option>
                         <option value="video">동영상 배경</option>
                       </select>
                    </div>
                    {section.bgType === 'color' || !section.bgType ? (
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>배경 색상</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input type="color" style={{ width: '45px', height: '45px', padding: '0', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }} value={section.bgColor || '#ffffff'} onChange={e => handleSectionUpdate(section.id, 'bgColor', e.target.value)} />
                          <input className="form-control" value={section.bgColor || "#ffffff"} onChange={e => handleSectionUpdate(section.id, 'bgColor', e.target.value)} placeholder="#ffffff" />
                        </div>
                      </div>
                    ) : (
                      <MediaInput label="배경 파일/URL" value={section.bgUrl} onChange={val => handleSectionUpdate(section.id, 'bgUrl', val)} />
                    )}

                    <div className="form-group">
                       <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>자세히보기 버튼</label>
                       <div style={{ display: 'flex', gap: '12px' }}>
                         <button 
                           className={`luxury-btn ${section.showButton ? '' : 'outline'}`} 
                           style={{ flex: 1, padding: '12px' }}
                           onClick={() => handleSectionUpdate(section.id, 'showButton', true)}
                         >
                           {section.showButton && <Check size={16} style={{ marginRight: '6px' }} />} 노출함
                         </button>
                         <button 
                           className={`luxury-btn ${section.showButton ? 'outline' : ''}`} 
                           style={{ flex: 1, padding: '12px' }}
                           onClick={() => handleSectionUpdate(section.id, 'showButton', false)}
                         >
                           {!section.showButton && <Check size={16} style={{ marginRight: '6px' }} />} 노출 안함
                         </button>
                       </div>
                    </div>
                    {section.showButton && (
                      <div className="form-group">
                        <label style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>버튼 연결 링크</label>
                        <input className="form-control" value={section.buttonLink || ""} onChange={e => handleSectionUpdate(section.id, 'buttonLink', e.target.value)} placeholder="/reviews 또는 https://..." />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomeEditor;
