import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, MoveUp, MoveDown, Save, Monitor, Layers } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);

  const handleHeroSave = () => {
    updateHero(heroForm);
    alert('디자인 변경사항이 성공적으로 적용되었습니다.');
  };

  const handleSectionUpdate = (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    updateSection(id, { ...section, [field]: value });
  };

  const handleAddNewSection = () => {
    const newId = `section-${Date.now()}`;
    addSection({
      id: newId,
      title: "새로운 여행 패키지",
      content: "여기에 여정의 디테일한 내용을 매력적으로 입력하세요...",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-left"
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Hero Editor */}
      <section className="admin-card-glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div className="text-gradient"><Monitor size={24} /></div>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Hero Section 비주얼 에디터</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>메인 타이틀 (\n으로 줄바꿈 가능)</label>
            <textarea 
              className="glass-light" 
              style={{ width: '100%', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '15px' }}
              value={heroForm.title} 
              onChange={e => setHeroForm({...heroForm, title: e.target.value})}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>서브 타이틀 (태그라인)</label>
            <input 
              className="glass-light" 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              value={heroForm.subtitle} 
              onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>배경 텍스트 위치</label>
            <select 
              className="glass-light" 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              value={heroForm.textPosition}
              onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}
            >
              <option value="left" style={{ background: '#0F172A' }}>왼쪽 정렬</option>
              <option value="center" style={{ background: '#0F172A' }}>중앙 정렬</option>
              <option value="right" style={{ background: '#0F172A' }}>오른쪽 정렬</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>배경 미디어 타입</label>
            <select 
              className="glass-light" 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              value={heroForm.bgType}
              onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}
            >
              <option value="image" style={{ background: '#0F172A' }}>이미지 이미지</option>
              <option value="video" style={{ background: '#0F172A' }}>시네마틱 동영상 (Direct URL)</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>미디어 리소스 URL</label>
            <input 
              className="glass-light" 
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              value={heroForm.bgUrl} 
              onChange={e => setHeroForm({...heroForm, bgUrl: e.target.value})}
            />
          </div>
        </div>
        <button className="luxury-btn" style={{ marginTop: '32px' }} onClick={handleHeroSave}>
          <Save size={16} /> 변경사항 저장
        </button>
      </section>

      {/* Sections Config */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="text-gradient"><Layers size={24} /></div>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>콘텐츠 섹션 타임라인</h2>
        </div>
        <button className="luxury-btn outline" style={{ padding: '10px 24px', fontSize: '13px' }} onClick={handleAddNewSection}>
          <Plus size={16} /> 신규 섹션 추가
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {config.sections.map((section, index) => (
          <div key={section.id} className="admin-card-glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <span style={{ fontSize: '12px', color: 'var(--gold-primary)', fontWeight: '800' }}>#{index + 1}</span>
                 <h3 style={{ fontSize: '16px', fontWeight: '600' }}>섹션 블록</h3>
              </div>
              <button onClick={() => deleteSection(section.id)} style={{ color: '#ef4444', opacity: 0.6 }} className="hover-1">
                <Trash2 size={18} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div className="form-group">
                <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>섹션 제목</label>
                <input 
                  className="glass-light" 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  value={section.title} 
                  onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>레이아웃 프리셋</label>
                <select 
                  className="glass-light" 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  value={section.layout}
                  onChange={e => handleSectionUpdate(section.id, 'layout', e.target.value)}
                >
                  <option value="text-left" style={{ background: '#0F172A' }}>텍스트 좌측 | 이미지 우측</option>
                  <option value="text-right" style={{ background: '#0F172A' }}>텍스트 우측 | 이미지 좌측</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>본문 내러티브</label>
                <textarea 
                  className="glass-light" 
                  style={{ width: '100%', padding: '16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  value={section.content} 
                  onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '8px', display: 'block' }}>비주얼 리소스 URL</label>
                <input 
                  className="glass-light" 
                  style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  value={section.image} 
                  onChange={e => handleSectionUpdate(section.id, 'image', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomeEditor;
