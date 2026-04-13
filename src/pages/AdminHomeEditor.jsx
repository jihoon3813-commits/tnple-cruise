import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Plus, Trash2, Save, Monitor, Layers, Image as ImageIcon } from 'lucide-react';

const AdminHomeEditor = () => {
  const { config, updateHero, updateSection, addSection, deleteSection } = useConfig();
  const [heroForm, setHeroForm] = useState(config.hero);

  const handleHeroSave = () => {
    updateHero(heroForm);
    alert('홈페이지 대문 설정이 저장되었습니다.');
  };

  const handleSectionUpdate = (id, field, value) => {
    const section = config.sections.find(s => s.id === id);
    updateSection(id, { ...section, [field]: value });
  };

  const handleAddNewSection = () => {
    const newId = `section-${Date.now()}`;
    addSection({
      id: newId,
      title: "새로운 패키지 소개",
      content: "이 여정의 특별한 점을 설명해 주세요...",
      image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      layout: "text-left"
    });
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
              value={heroForm.title} 
              onChange={e => setHeroForm({...heroForm, title: e.target.value})}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>슬로건 (태그라인)</label>
            <input 
              className="form-control" 
              value={heroForm.subtitle} 
              onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>텍스트 정렬</label>
            <select 
              className="form-control" 
              value={heroForm.textPosition}
              onChange={e => setHeroForm({...heroForm, textPosition: e.target.value})}
            >
              <option value="left">왼쪽 정렬</option>
              <option value="center">가운데 정렬</option>
              <option value="right">오른쪽 정렬</option>
            </select>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>미디어 소스 URL</label>
            <input 
              className="form-control" 
              value={heroForm.bgUrl} 
              onChange={e => setHeroForm({...heroForm, bgUrl: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>미디어 타입</label>
            <select 
              className="form-control" 
              value={heroForm.bgType}
              onChange={e => setHeroForm({...heroForm, bgType: e.target.value})}
            >
              <option value="image">스틸 이미지</option>
              <option value="video">시네마틱 영상</option>
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
            <div key={section.id} className="admin-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '28px', height: '28px', background: 'var(--bg-sub)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800' }}>{index + 1}</div>
                   <h3 style={{ fontSize: '17px', fontWeight: '700' }}>{section.title || '제목 없음'}</h3>
                </div>
                <button onClick={() => deleteSection(section.id)} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>제목</label>
                  <input 
                    className="form-control" 
                    value={section.title} 
                    onChange={e => handleSectionUpdate(section.id, 'title', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>레이아웃</label>
                  <select 
                    className="form-control" 
                    value={section.layout}
                    onChange={e => handleSectionUpdate(section.id, 'layout', e.target.value)}
                  >
                    <option value="text-left">텍스트 왼쪽 | 이미지 오른쪽</option>
                    <option value="text-right">텍스트 오른쪽 | 이미지 왼쪽</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>본문 상세 설명</label>
                  <textarea 
                    className="form-control" 
                    value={section.content} 
                    onChange={e => handleSectionUpdate(section.id, 'content', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>이미지 URL</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      className="form-control" 
                      value={section.image} 
                      onChange={e => handleSectionUpdate(section.id, 'image', e.target.value)}
                    />
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
                      <img src={section.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomeEditor;
