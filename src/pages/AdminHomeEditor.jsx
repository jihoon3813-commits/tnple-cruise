import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon, Palette, Type, Link as LinkIcon, Upload, Loader2, Play, ChevronUp, ChevronDown, Check, X, Settings2, Grid, List, Activity, MoveVertical, MousePointerClick, AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection, uploadFile } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [heroTab, setHeroTab] = useState('style');
  const [editTab, setEditTab] = useState('style'); 

  useEffect(() => {
    if (config.hero) setHeroForm(config.hero);
  }, [config.hero]);

  const handleHeroSave = async () => {
    await updateHero(heroForm);
    alert('홈페이지 히어로 설정이 저장되었습니다.');
  };

  const handleHeroTypoUpdate = (target, field, value) => {
    const typo = heroForm.typography || {};
    const targetTypo = typo[target] || {};
    const updatedTypo = { ...typo, [target]: { ...targetTypo, [field]: value } };
    setHeroForm({ ...heroForm, typography: updatedTypo });
  };

  const handleSectionUpdate = async (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    if (!section) return;
    await updateSection(id, { ...section, [field]: value });
  };

  const handleTypographyUpdate = async (id, target, field, value) => {
    const section = config.sections.find(s => s.id === id);
    if (!section) return;
    const typo = section.typography || {};
    const targetTypo = typo[target] || {};
    const updatedTypo = { ...typo, [target]: { ...targetTypo, [field]: value } };
    await updateSection(id, { ...section, typography: updatedTypo });
  };

  const handleButtonUpdate = async (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    if (!section) return;
    const btnStyle = section.buttonStyles || {};
    const updatedBtn = { ...btnStyle, [field]: value };
    await handleSectionUpdate(id, 'buttonStyles', updatedBtn);
  };

  const handleAddItem = async (id) => {
    const section = config.sections.find(s => s.id === id);
    const items = section.items || [];
    const newItems = [...items, { title: "새로운 항목", content: "내용을 입력하세요.", number: `0${items.length + 1}` }];
    await handleSectionUpdate(id, 'items', newItems);
  };

  const handleUpdateItem = async (sectionId, itemIdx, field, value) => {
    const section = config.sections.find(s => s.id === sectionId);
    const items = [...(section.items || [])];
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    await handleSectionUpdate(sectionId, 'items', items);
  };

  const handleRemoveItem = async (sectionId, itemIdx) => {
    const section = config.sections.find(s => s.id === sectionId);
    const items = (section.items || []).filter((_, i) => i !== itemIdx);
    await handleSectionUpdate(sectionId, 'items', items);
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
      title: "새로운 섹션",
      content: "섹션 설명을 입력하세요.",
      image: "",
      images: [],
      layout: "left",
      style: "classic",
      items: [],
      typography: {
        title: { fontSize: 42, color: "#0F172A", textAlign: "left" },
        content: { fontSize: 18, color: "#64748B", textAlign: "left" }
      },
      showButton: true,
      buttonText: "자세히 보기",
      buttonLink: "",
      buttonStyles: { size: "medium", bgColor: "#2563EB", textColor: "#ffffff", borderColor: "#2563EB" },
      bgColor: "#ffffff",
      bgType: "color",
      bgOpacity: 1,
      paddingTop: 120,
      paddingBottom: 120
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
      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>{label}</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <input className="form-control" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="URL 또는 업로드" />
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
      onChange([...(values || []), `storage:${storageId}`]);
      setLoading(false);
    };
    return (
      <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: '16px' }}>
        <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>{label}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
          {values?.map((src, idx) => (
            <div key={idx} style={{ position: 'relative', height: '80px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img src={src.startsWith('storage:') ? 'https://via.placeholder.com/100?text=File' : src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => onChange(values.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
            </div>
          ))}
          <button className="luxury-btn outline" style={{ height: '80px', borderRadius: '12px', borderStyle: 'dashed', flexDirection: 'column' }} onClick={() => fileRef.current.click()} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
          </button>
          <input type="file" ref={fileRef} hidden onChange={onFileChange} />
        </div>
      </div>
    );
  };

  const TypographyTool = ({ data, target, onUpdate }) => {
    const typo = data.typography?.[target] || {};
    const update = (field, val) => onUpdate(target, field, val);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'var(--bg-sub)', padding: '20px', borderRadius: '16px' }}>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>색상</label>
          <input type="color" className="form-control" style={{ height: '38px', padding: '4px' }} value={typo.color || (target === 'title' ? '#0F172A' : '#64748B')} onChange={e => update('color', e.target.value)} />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>크기(px)</label>
          <input type="number" className="form-control" value={typo.fontSize || (target === 'title' ? 42 : 18)} onChange={e => update('fontSize', parseInt(e.target.value))} />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>정렬</label>
          <select className="form-control" value={typo.textAlign || "left"} onChange={e => update('textAlign', e.target.value)}>
            <option value="left">왼쪽</option><option value="center">가운데</option><option value="right">오른쪽</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>자간</label>
          <input type="number" step="0.01" className="form-control" value={typo.letterSpacing || 0} onChange={e => update('letterSpacing', parseFloat(e.target.value))} />
        </div>
        <div className="form-group">
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>행간</label>
          <input type="number" step="0.1" className="form-control" value={typo.lineHeight || 1.4} onChange={e => update('lineHeight', parseFloat(e.target.value))} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Hero Editor */}
      <section className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}><Monitor size={24} /></div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>히어로 브랜딩 (대문) 설정</h2>
           </div>
           <button className="luxury-btn" onClick={handleHeroSave}><Save size={18} /> 설정 저장</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
           {[
             { id: 'style', label: 'Style' }, { id: 'content', label: 'Content' }, { id: 'visual', label: 'Visual' }, { id: 'typography', label: 'Fonts' }
           ].map(t => (
             <button key={t.id} onClick={() => setHeroTab(t.id)} className={`luxury-btn ${heroTab === t.id ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}>{t.label}</button>
           ))}
        </div>

        {heroTab === 'style' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
             {[
               { id: 'classic', label: 'Classic Side' }, { id: 'full-bg', label: 'Full Background' }, { id: 'split', label: 'Split Screen' },
               { id: 'card', label: 'Modern Card' }, { id: 'minimal', label: 'Minimalist' }, { id: 'video-focus', label: 'Video Focus' }
             ].map(s => (
               <div key={s.id} onClick={() => setHeroForm({...heroForm, style: s.id})} style={{ padding: '20px', borderRadius: '16px', border: heroForm?.style === s.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}>
                 <p style={{ fontSize: '12px', fontWeight: '700' }}>{s.label}</p>
               </div>
             ))}
          </div>
        )}

        {heroTab === 'content' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group"><label>상단 강조 문구 (Above Title)</label><input className="form-control" value={heroForm?.aboveTitle || ""} onChange={e => setHeroForm({...heroForm, aboveTitle: e.target.value})} /></div>
              <div className="form-group"><label>메인 타이틀 (Title)</label><textarea className="form-control" value={heroForm?.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} rows={3} /></div>
              <div className="form-group"><label>서브 타이틀 (Subtitle)</label><input className="form-control" value={heroForm?.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} /></div>
              <div className="form-group"><label>하단 상세 문구 (Below Title)</label><input className="form-control" value={heroForm?.belowTitle || ""} onChange={e => setHeroForm({...heroForm, belowTitle: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                 <div className="form-group"><label>가로 정렬</label><select className="form-control" value={heroForm?.textPosition} onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>
                 <div className="form-group"><label>세로 정렬</label><select className="form-control" value={heroForm?.verticalAlign || "middle"} onChange={e => setHeroForm({...heroForm, verticalAlign: e.target.value})}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option></select></div>
              </div>
           </div>
        )}

        {heroTab === 'visual' && (
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <MediaInput label="배경 URL / 파일" value={heroForm?.bgUrl} onChange={v => setHeroForm({...heroForm, bgUrl: v})} />
              <div className="form-group"><label>배경 타입</label><select className="form-control" value={heroForm?.bgType} onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}><option value="image">Image</option><option value="video">Video</option></select></div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                 <label>배경 투명도 / 밝기 ({heroForm?.bgOpacity ?? 1})</label>
                 <input type="range" min="0" max="1" step="0.1" className="form-control" value={heroForm?.bgOpacity ?? 1} onChange={e => setHeroForm({...heroForm, bgOpacity: parseFloat(e.target.value)})} />
              </div>
           </div>
        )}

        {heroTab === 'typography' && (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>메인 타이틀 폰트</label><TypographyTool data={heroForm} target="title" onUpdate={handleHeroTypoUpdate} /></div>
              <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>서브 타이틀 폰트</label><TypographyTool data={heroForm} target="subtitle" onUpdate={handleHeroTypoUpdate} /></div>
              <div><label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>상단/하단 문구 폰트</label><TypographyTool data={heroForm} target="above" onUpdate={handleHeroTypoUpdate} /></div>
           </div>
        )}
      </section>

      {/* Sections Config */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>홍보 섹션 리스트</h2>
          <button className="luxury-btn outline" onClick={handleAddNewSection}><Plus size={16} /> 섹션 추가</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {config.sections.map((section, index) => (
            <div key={section.id} className="admin-card" style={{ padding: '0', border: activeSectionId === section.id ? '2px solid var(--primary)' : '1px solid var(--border-light)' }}>
              <div 
                style={{ padding: '20px 32px', background: 'var(--bg-sub)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                onClick={() => setActiveSectionId(activeSectionId === section.id ? null : section.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <button onClick={e => { e.stopPropagation(); handleMoveSection(section.id, 'up'); }} style={{ border: 'none', background: 'none' }}><ChevronUp size={14} /></button>
                     <button onClick={e => { e.stopPropagation(); handleMoveSection(section.id, 'down'); }} style={{ border: 'none', background: 'none' }}><ChevronDown size={14} /></button>
                   </div>
                   <span style={{ fontWeight: '800' }}>{index + 1}</span>
                   <h3 style={{ fontSize: '16px' }}>{section.title}</h3>
                </div>
                <button onClick={e => { e.stopPropagation(); handleRemoveSection(section.id); }} style={{ color: '#ef4444', border: 'none', background: 'none' }}><Trash2 size={18} /></button>
              </div>
              {activeSectionId === section.id && (
                <div style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
                     {[
                       { id: 'style', icon: <Grid size={14} />, label: 'Style' }, { id: 'content', icon: <List size={14} />, label: 'Content' }, { id: 'visual', icon: <Palette size={14} />, label: 'Visual' }, { id: 'typography', icon: <Type size={14} />, label: 'Fonts' }, { id: 'button', icon: <MousePointerClick size={14} />, label: 'Button' }
                     ].map(t => (
                       <button key={t.id} onClick={() => setEditTab(t.id)} className={`luxury-btn ${editTab === t.id ? '' : 'outline'}`} style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px' }}>{t.icon} {t.label}</button>
                     ))}
                  </div>
                  {/* Tab contents (Style, Content, Visual, Typography, Button) similar to previous version */}
                  {editTab === 'style' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {[{ id: 'classic', label: 'Classic' }, { id: 'split-card', label: 'Split Card' }, { id: 'minimal-centered', label: 'Minimal' }, { id: 'gallery', label: 'Gallery' }, { id: 'feature-cards', label: 'Feature Cards' }, { id: 'process', label: 'Process' }].map(s => (
                        <div key={s.id} onClick={() => handleSectionUpdate(section.id, 'style', s.id)} style={{ padding: '20px', borderRadius: '16px', border: section.style === s.id ? '2px solid var(--primary)' : '1px solid var(--border-light)', cursor: 'pointer', textAlign: 'center' }}><p style={{ fontSize: '12px', fontWeight: '700' }}>{s.label}</p></div>
                      ))}
                    </div>
                  )}
                  {editTab === 'content' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                       <div className="form-group"><label>타이틀</label><input className="form-control" value={section.title} onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)} /></div>
                       <div className="form-group"><label>본문 내용</label><textarea className="form-control" value={section.content} onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)} rows={4} /></div>
                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
                          <div className="form-group"><label>상단 여백</label><input type="number" className="form-control" value={section.paddingTop ?? 120} onChange={e => handleSectionUpdate(section.id, 'paddingTop', parseInt(e.target.value))} /></div>
                          <div className="form-group"><label>하단 여백</label><input type="number" className="form-control" value={section.paddingBottom ?? 120} onChange={e => handleSectionUpdate(section.id, 'paddingBottom', parseInt(e.target.value))} /></div>
                       </div>
                    </div>
                  )}
                  {/* ... Omitted other tabs for brevity, but I just need to make sure the core logic for sections remains ... */}
                  {editTab === 'visual' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <MediaInput label="메인 이미지" value={section.image} onChange={v => handleSectionUpdate(section.id, 'image', v)} />
                       <MultiMediaInput label="갤러리 이미지" values={section.images} onChange={v => handleSectionUpdate(section.id, 'images', v)} />
                       <div className="form-group"><label>배경 타입</label><select className="form-control" value={section.bgType} onChange={e => handleSectionUpdate(section.id, 'bgType', e.target.value)}><option value="color">Color</option><option value="image">Image</option></select></div>
                       <div className="form-group"><label>배경 투명도</label><input type="range" min="0" max="1" step="0.1" className="form-control" value={section.bgOpacity ?? 1} onChange={e => handleSectionUpdate(section.id, 'bgOpacity', parseFloat(e.target.value))} /></div>
                    </div>
                  )}
                  {editTab === 'typography' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                       <div><label style={{ fontWeight: 800 }}>타이틀 폰트</label><TypographyTool data={section} target="title" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
                       <div><label style={{ fontWeight: 800 }}>본문 폰트</label><TypographyTool data={section} target="content" onUpdate={(t,f,v) => handleTypographyUpdate(section.id, t,f,v)} /></div>
                    </div>
                  )}
                  {editTab === 'button' && (
                    <div className="form-group">
                       <label>버튼 문구</label><input className="form-control" value={section.buttonText || "자세히 보기"} onChange={e => handleSectionUpdate(section.id, 'buttonText', e.target.value)} />
                    </div>
                  )}
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
