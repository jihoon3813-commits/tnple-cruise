import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

const DEFAULT_CONFIG = {
  hero: {
    title: "DAONNET CRUISE 크루즈\n멤버십",
    subtitle: "당신을 위한 완벽한 여정",
    bgType: "image",
    bgUrl: "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    textPosition: "center",
    paddingX: 80
  },
  sections: [],
  products: [],
  reviews: []
};

export const ConfigProvider = ({ children }) => {
  const heroData = useQuery(api.siteConfig.get);
  const sectionsData = useQuery(api.sections.list);
  const productsData = useQuery(api.products.list);
  const reviewsData = useQuery(api.reviews.list);
  const faqsData = useQuery(api.faqs.listFaqs);

  const updateHeroMutation = useMutation(api.siteConfig.updateHero);
  const updateThemeMutation = useMutation(api.siteConfig.updateTheme);
  const addSectionMutation = useMutation(api.sections.add);
  const updateSectionMutation = useMutation(api.sections.update);
  const deleteSectionMutation = useMutation(api.sections.remove);
  const addProductMutation = useMutation(api.products.add);
  const updateProductMutation = useMutation(api.products.update);
  const deleteProductMutation = useMutation(api.products.remove);
  const addReviewMutation = useMutation(api.reviews.add);
  const updateReviewMutation = useMutation(api.reviews.update);
  const deleteReviewMutation = useMutation(api.reviews.remove);
  const seedMutation = useMutation(api.init.seed);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateProductBrandingMutation = useMutation(api.siteConfig.updateProductBranding);
  const updateReviewBrandingMutation = useMutation(api.siteConfig.updateReviewBranding);
  const updateProductDetailBrandingMutation = useMutation(api.siteConfig.updateProductDetailBranding);
  const updatePrivacyPolicyMutation = useMutation(api.siteConfig.updatePrivacyPolicy);
  const updateGlobalSettingsMutation = useMutation(api.siteConfig.updateGlobalSettings);
  const updateAdminPasswordMutation = useMutation(api.siteConfig.updateAdminPassword);
  const updateQuickPlannerMutation = useMutation(api.siteConfig.updateQuickPlanner);
  const updateFooterMutation = useMutation(api.siteConfig.updateFooter);
  const triggerVercelDeployAction = useMutation(api.deploy.triggerVercelDeploy);
  const addReservationMutation = useMutation(api.reservations.add);
  const reservationsData = useQuery(api.reservations.list);

  useEffect(() => {
    if (heroData === null) {
      seedMutation();
    }
  }, [heroData, seedMutation]);

  const resolvedLogo = useQuery(api.files.getUrl, heroData?.logo?.startsWith('storage:') ? { storageId: heroData.logo.split('storage:')[1] } : "skip");
  const resolvedFavicon = useQuery(api.files.getUrl, heroData?.favicon?.startsWith('storage:') ? { storageId: heroData.favicon.split('storage:')[1] } : "skip");
  const resolvedOgImage = useQuery(api.files.getUrl, heroData?.ogImage?.startsWith('storage:') ? { storageId: heroData.ogImage.split('storage:')[1] } : "skip");

  const config = useMemo(() => {
    const raw = {
      theme: heroData?.theme || "white",
      hero: heroData?.hero || DEFAULT_CONFIG.hero,
      sections: [...(sectionsData || [])].sort((a,b) => (a.order || 0) - (b.order || 0)).map(s => ({ ...s, id: s._id })),
      products: productsData?.map(p => ({ ...p, id: p._id })) || [],
      reviews: reviewsData?.map(r => ({ ...r, id: r._id })) || [],
      faqs: faqsData?.map(f => ({ ...f, id: f._id })) || [],
      productListBranding: heroData?.productListBranding || { title: "추천 패키지", titleColor: "var(--text-main)", bgColor: "#ffffff" },
      reviewSectionBranding: heroData?.reviewSectionBranding || { show: true, title: "여행 후기", titleColor: "var(--text-main)", bgColor: "var(--bg-sub)", layout: "slider" },
      productDetailBranding: heroData?.productDetailBranding || { layout: "luxury", theme: "light", titleColor: "#0F172A", priceColor: "var(--primary)", accentColor: "var(--primary)", buttonColor: "var(--primary)", buttonTextColor: "#ffffff" },
      quickPlanner: {
        badge: heroData?.quickPlanner?.badge || "SMART CUSTOM PLANNER",
        title: heroData?.quickPlanner?.title || "내 여행 계획에 맞춘 빠른 맞춤 견적 신청",
        subtitle: heroData?.quickPlanner?.subtitle || "희망하시는 여행지와 일정, 결제 방식을 선택하시면 전담 크루즈 플래너가 1:1 최적 여정과 특별 우대 혜택을 빠르게 안내해 드립니다.",
        benefit1: heroData?.quickPlanner?.benefit1 || "목돈 부담 없는 스마트 후불제 지원",
        benefit2: heroData?.quickPlanner?.benefit2 || "1:1 전담 한국인 컨시어지 올케어",
        benefit3: heroData?.quickPlanner?.benefit3 || "상담 고객 전원 선상 크레딧 우대 지원",
        buttonText: heroData?.quickPlanner?.buttonText || "맞춤 견적 신청",
        destinations: (heroData?.quickPlanner?.destinations && heroData.quickPlanner.destinations.length > 0) ? heroData.quickPlanner.destinations : [
          "동남아 3개국 (싱가포르·말레이시아·태국)",
          "지중해 클래식 (이탈리아·프랑스·스페인)",
          "일본 오키나와 & 대만 에메랄드",
          "알래스카 빙하 피오르드"
        ],
        schedules: (heroData?.quickPlanner?.schedules && heroData.quickPlanner.schedules.length > 0) ? heroData.quickPlanner.schedules : [
          "2026년 상반기 (3월~6월)",
          "2026년 여름 성수기 (7월~8월)",
          "2026년 가을 시즌 (9월~11월)",
          "2026-2027 겨울 방학 시즌"
        ],
        members: (heroData?.quickPlanner?.members && heroData.quickPlanner.members.length > 0) ? heroData.quickPlanner.members : [
          "성인 2인 (부부/커플)",
          "가족 (성인2 + 아동1~2)",
          "부모님 동반 (3~4인)",
          "단체/모임 (5인 이상)"
        ],
        paymentPlans: (heroData?.quickPlanner?.paymentPlans && heroData.quickPlanner.paymentPlans.length > 0) ? heroData.quickPlanner.paymentPlans : [
          "스마트 후불 분할 납부",
          "멤버십 일시불 특별 우대",
          "맞춤 상담 후 결정"
        ]
      },
      privacyPolicy: heroData?.privacyPolicy || "개인정보 수집 및 이용에 동의합니다.",
      siteName: heroData?.siteName || "다온넷크루즈",
      siteNameEn: heroData?.siteNameEn || "DAONNET CRUISE",
      logo: heroData?.logo,
      favicon: heroData?.favicon,
      ogTitle: heroData?.ogTitle || (heroData?.siteName ? `${heroData.siteName} - 프리미엄 크루즈 여행` : "다온넷크루즈 - 프리미엄 크루즈 여행"),
      ogImage: heroData?.ogImage || "https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      metaDescription: heroData?.metaDescription || "세상의 끝까지 만끽하는 진정한 럭셔리, 다온넷크루즈 멤버십.",
      footer: heroData?.footer || {
        menus: [
          { id: '1', label: '이용약관', url: '/terms' },
          { id: '2', label: '개인정보처리방침', url: '/privacy' }
        ],
        companyInfo: "회사명: 다온넷크루즈\n대표자: 홍길동 | 주소: 서울특별시 강남구 테헤란로 123\n사업자등록번호: 123-45-67890 | TEL: 02-1234-5678",
        copyright: "© 2024 DAONNET CRUISE. All rights reserved.",
        externalLinks: [],
        logoDescription: "프리미엄 럭셔리 크루즈 멤버십 서비스. 품격 있는 해상 여행의 정수를 DAONNET CRUISE와 함께 경험해 보세요.",
        csCenter: {
          phone: "1600-0000",
          hours: "운영시간: 평일 09:00 ~ 18:00",
          lunchTime: "점심시간: 12:00 ~ 13:00 (토/일/공휴일 휴무)"
        }
      }
    };

    return {
       ...raw,
       logoUrl: raw.logo?.startsWith('storage:') ? resolvedLogo : raw.logo,
       faviconUrl: raw.favicon?.startsWith('storage:') ? resolvedFavicon : raw.favicon,
       ogImageUrl: raw.ogImage?.startsWith('storage:') ? resolvedOgImage : raw.ogImage,
    };
  }, [heroData, sectionsData, productsData, reviewsData, faqsData, resolvedLogo, resolvedFavicon, resolvedOgImage]);

  const uploadFile = async (file) => {
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) {
        throw new Error(`Upload failed with status: ${result.status}`);
      }
      
      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const triggerVercelDeploy = async () => {
    try {
      await triggerVercelDeployAction();
    } catch (e) {
      console.error("Trigger deploy failed", e);
    }
  }

  const updateHero = async (data) => {
    const { 
      style, title, subtitle, aboveTitle, belowTitle, 
      bgType, bgUrl, bgOpacity, paddingX,
      textPosition, verticalAlign, typography, buttons 
    } = data;
    await updateHeroMutation({ 
      style: style || "classic", 
      title, 
      subtitle: subtitle || "",
      aboveTitle: aboveTitle || "",
      belowTitle: belowTitle || "",
      bgType, 
      bgUrl, 
      bgOpacity: bgOpacity ?? 1,
      paddingX: paddingX ?? 80,
      textPosition, 
      verticalAlign: verticalAlign || "middle",
      typography: typography || {},
      buttons: buttons || []
    });
  };

  const updateTheme = async (theme) => {
    await updateThemeMutation({ theme });
  };

  const addSection = async (data) => {
    const { title, content, aboveTitle, image, images, layout, mobileLayout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, cardStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, menuName } = data;
    await addSectionMutation({ 
      title, content, aboveTitle, image, images, layout, mobileLayout,
      style: style || "classic", 
      items: (items || []).map(item => ({
        ...item,
        highlights: item.highlights || [],
        highlightStyle: item.highlightStyle || "dot"
      })),
      typography: typography || {},
      showButton: showButton ?? true, 
      buttonText: buttonText || "자세히 보기",
      buttonLink, 
      buttonStyles: buttonStyles || { size: "medium" },
      cardStyles: cardStyles || { shadow: 0.1, borderRadius: 24, borderWidth: 1, borderColor: "#e2e8f0", bgColor: "#ffffff" },
      bgColor, 
      bgType: bgType || "color", 
      bgUrl, 
      bgOpacity: bgOpacity ?? 1,
      paddingTop: paddingTop ?? 120,
      paddingBottom: paddingBottom ?? 120,
      order: config.sections.length,
      menuName
    });
  };

  const updateSection = async (id, data) => {
    const { title, content, image, images, layout, mobileLayout, style, items, typography, showButton, buttonText, buttonLink, buttonStyles, cardStyles, bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, order, aboveTitle, menuName } = data;
    await updateSectionMutation({ 
      id, title, content, image, images, layout, mobileLayout, style, 
      items: (items || []).map(item => ({
        ...item,
        highlights: item.highlights || [],
        highlightStyle: item.highlightStyle || "dot"
      })),
      typography,
      showButton: Boolean(showButton), 
      buttonText, buttonLink, buttonStyles, cardStyles,
      aboveTitle,
      bgColor, bgType, bgUrl, bgOpacity, paddingTop, paddingBottom, order, menuName
    });
  };

  const deleteSection = async (id) => {
    await deleteSectionMutation({ id });
  };

  const addProduct = async (data) => {
    const payload = {
      title: String(data.title || "새 크루즈 상품"),
      description: String(data.description || ""),
      price: typeof data.price === 'number' && !isNaN(data.price) ? data.price : (Number(data.price) || 0),
      ...(data.originalPrice && !isNaN(Number(data.originalPrice)) ? { originalPrice: Number(data.originalPrice) } : {}),
      thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails.filter(t => t && typeof t === 'string' && t.trim() !== '') : [],
      paymentType: String(data.paymentType || "full"),
      ...(data.downPayment && !isNaN(Number(data.downPayment)) ? { downPayment: Number(data.downPayment) } : {}),
      ...(data.installments && !isNaN(Number(data.installments)) ? { installments: Number(data.installments) } : {}),
      ...(data.scheduleImage && typeof data.scheduleImage === 'string' && data.scheduleImage.trim() !== '' ? { scheduleImage: data.scheduleImage.trim() } : {}),
      ...(Array.isArray(data.schedule) && data.schedule.length > 0 ? { 
        schedule: data.schedule.map((s, idx) => ({
          day: typeof s.day === 'number' ? s.day : (Number(s.day) || idx + 1),
          title: String(s.title || ''),
          content: String(s.content || '')
        }))
      } : {}),
      ...(Array.isArray(data.features) && data.features.length > 0 ? {
        features: data.features.filter(f => f && typeof f === 'string' && f.trim() !== '')
      } : {}),
      badge: String(data.badge || "다온넷 추천"),
      ship: String(data.ship || ""),
      bookingPeriod: String(data.bookingPeriod || ""),
      travelPeriod: String(data.travelPeriod || ""),
      typography: data.typography || {}
    };
    await addProductMutation(payload);
  };

  const updateProduct = async (id, data) => {
    const payload = {
      id,
      title: String(data.title || "크루즈 상품"),
      description: String(data.description || ""),
      price: typeof data.price === 'number' && !isNaN(data.price) ? data.price : (Number(data.price) || 0),
      ...(data.originalPrice && !isNaN(Number(data.originalPrice)) ? { originalPrice: Number(data.originalPrice) } : {}),
      thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails.filter(t => t && typeof t === 'string' && t.trim() !== '') : [],
      paymentType: String(data.paymentType || "full"),
      ...(data.downPayment && !isNaN(Number(data.downPayment)) ? { downPayment: Number(data.downPayment) } : {}),
      ...(data.installments && !isNaN(Number(data.installments)) ? { installments: Number(data.installments) } : {}),
      ...(data.scheduleImage && typeof data.scheduleImage === 'string' && data.scheduleImage.trim() !== '' ? { scheduleImage: data.scheduleImage.trim() } : {}),
      ...(Array.isArray(data.schedule) && data.schedule.length > 0 ? { 
        schedule: data.schedule.map((s, idx) => ({
          day: typeof s.day === 'number' ? s.day : (Number(s.day) || idx + 1),
          title: String(s.title || ''),
          content: String(s.content || '')
        }))
      } : {}),
      ...(Array.isArray(data.features) && data.features.length > 0 ? {
        features: data.features.filter(f => f && typeof f === 'string' && f.trim() !== '')
      } : {}),
      badge: String(data.badge || "다온넷 추천"),
      ship: String(data.ship || ""),
      bookingPeriod: String(data.bookingPeriod || ""),
      travelPeriod: String(data.travelPeriod || ""),
      typography: data.typography || {}
    };
    await updateProductMutation(payload);
  };

  const updateProductBranding = async (data) => {
    if (!data) return;
    const { title, titleColor, bgColor, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout } = data;
    await updateProductBrandingMutation({ title, titleColor, bgColor, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout });
  };

  const updateReviewBranding = async (data) => {
    if (!data) return;
    const { show, title, titleColor, bgColor, layout, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout } = data;
    await updateReviewBrandingMutation({ show, title, titleColor, bgColor, layout, subTitleTop, subTitleTopStyle, subTitleBottom, subTitleBottomStyle, mobileLayout });
  };

  const updateProductDetailBranding = async (data) => {
    if (!data) return;
    await updateProductDetailBrandingMutation(data);
  };

  const updatePrivacyPolicy = async (content) => {
    await updatePrivacyPolicyMutation({ content });
  };

  const updateGlobalSettings = async (data) => {
    await updateGlobalSettingsMutation(data);
  };
  
  const updateQuickPlanner = async (data) => {
    await updateQuickPlannerMutation(data);
  };

  const updateFooter = async (data) => {
    await updateFooterMutation(data);
  };

  const addReservation = async (data) => {
    await addReservationMutation({
      ...data,
      status: "pending"
    });
  };

  const updateAdminPassword = async (password) => {
    await updateAdminPasswordMutation({ password });
  };


  const deleteProduct = async (id) => {
    await deleteProductMutation({ id });
  };

  const addReview = async (data) => {
    const { author, title, rating, content, images, productTitle, date, showOnHome, order } = data;
    await addReviewMutation({ author, title, rating, content, images, productTitle, date, showOnHome, order });
  };

  const deleteReview = async (id) => {
    await deleteReviewMutation({ id });
  };

  const updateReview = async (id, data) => {
    await updateReviewMutation({ id, ...data });
  };

  return (
    <ConfigContext.Provider value={{
      config,
      loading: heroData === undefined,
      uploadFile,
      updateHero,
      updateTheme,
      addSection,
      updateSection,
      deleteSection,
      addProduct,
      updateProduct,
      deleteProduct,
      addReview,
      updateReview,
      deleteReview,
      updateProductBranding,
      updateReviewBranding,
      updateProductDetailBranding,
      updateQuickPlanner,
      updatePrivacyPolicy,
      updateGlobalSettings,
      updateAdminPassword,
      updateFooter,
      triggerVercelDeploy,
      addReservation,
      reservations: reservationsData || []
    }}>
      {children}
    </ConfigContext.Provider>
  );
};
