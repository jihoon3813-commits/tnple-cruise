import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// FAQ 목록 조회 (정렬 순서대로)
export const listFaqs = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("faqs").collect();
    let faqs = all;
    if (!args.includeInactive) {
      faqs = faqs.filter(f => f.isActive !== false);
    }
    // order 기준 정렬, 없으면 _creationTime 순
    return faqs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  },
});

// FAQ 단일 추가
export const addFaq = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let order = args.order;
    if (order === undefined) {
      const all = await ctx.db.query("faqs").collect();
      order = all.length + 1;
    }
    return await ctx.db.insert("faqs", {
      question: args.question,
      answer: args.answer,
      category: args.category || "일반",
      order,
      isActive: args.isActive ?? true,
    });
  },
});

// FAQ 수정
export const updateFaq = mutation({
  args: {
    id: v.id("faqs"),
    question: v.string(),
    answer: v.string(),
    category: v.optional(v.string()),
    order: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// FAQ 삭제
export const deleteFaq = mutation({
  args: {
    id: v.id("faqs"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// FAQ 순서 변경
export const reorderFaqs = mutation({
  args: {
    orderedIds: v.array(v.id("faqs")),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.orderedIds.length; i++) {
      await ctx.db.patch(args.orderedIds[i], { order: i + 1 });
    }
  },
});

// 기본 FAQ 시드 데이터 주입
export const seedInitialFaqs = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("faqs").take(1);
    if (existing.length > 0) {
      return { success: false, message: "이미 FAQ 데이터가 존재합니다." };
    }

    const defaultFaqs = [
      {
        order: 1,
        question: "다온넷크루즈 멤버십 특별 할인은 어떻게 적용되나요?",
        answer: "다온넷크루즈 멤버십 회원은 전 노선 기본 10~30% 시즌 특별 할인과 선상 크레딧 바우처, 직계 가족 동반 할인 등이 자동 적용됩니다. 1:1 전담 플래너 상담 시 회원 번호 또는 예약자 정보만 말씀해 주시면 최적의 혜택을 설계해 드립니다.",
        category: "멤버십/혜택",
        isActive: true,
      },
      {
        order: 2,
        question: "처음 가는 해외 크루즈인데 영어 소통이나 출입국이 어렵지 않나요?",
        answer: "다온넷크루즈는 여권 유효기간 확인, 전자입국신고서(SG Arrival Card 등) 작성부터 기항지 투어까지 1:1로 꼼꼼히 대행 및 안내해 드립니다. 전 일정 한국인 전문 인솔자가 동행하므로 언어 걱정 없이 안심하고 즐기실 수 있습니다.",
        category: "출입국/안내",
        isActive: true,
      },
      {
        order: 3,
        question: "선내 식사와 부대시설 이용료는 모두 포함인가요?",
        answer: "네, 대형 메인 정찬 레스토랑의 코스 요리와 24시간 뷔페, 수영장, 워터슬라이드, 대극장 갈라쇼, 피트니스 등 핵심 시설 이용료가 모두 상품가에 포함된 올인클루시브 방식입니다. (일부 유료 스페셜티 레스토랑 및 스파 프로그램 제외)",
        category: "선내생활",
        isActive: true,
      },
      {
        order: 4,
        question: "배멀미가 심한 편인데 크루즈 여행이 괜찮을까요?",
        answer: "10만 톤~20만 톤급 최첨단 대형 크루즈 선박은 컴퓨터 제어 선체 균형 안정기(Stabilizer)가 장착되어 있어 파도에 의한 흔들림을 거의 느끼기 어렵습니다. 특급 호텔 수준의 편안하고 고요한 휴식을 누리실 수 있습니다.",
        category: "선내생활",
        isActive: true,
      },
      {
        order: 5,
        question: "스마트 후불 결제 및 분할 납부는 어떻게 진행되나요?",
        answer: "여행 출발 전 계약금만으로 예약을 확정하고, 즐거운 여행을 모두 마치고 귀국하신 후 약정된 개월 수 동안 부담 없이 분할 정산하시는 다온넷크루즈만의 안심 금융 결제 프로그램입니다.",
        category: "결제/정산",
        isActive: true,
      },
      {
        order: 6,
        question: "기항지 관광은 개별 자유 여행도 가능한가요?",
        answer: "네, 가능합니다. 다온넷 전용 한국인 단체 기항지 투어에 참여하시거나, 고객님의 취향에 맞춘 자유 개별 관광 또는 선사 공식 익스커션 프로그램 중 자유롭게 선택하실 수 있도록 맞춤 플랜을 제안해 드립니다.",
        category: "기항지관광",
        isActive: true,
      },
    ];

    for (const faq of defaultFaqs) {
      await ctx.db.insert("faqs", faq);
    }

    return { success: true, count: defaultFaqs.length };
  },
});
