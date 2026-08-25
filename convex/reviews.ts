import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});

export const add = mutation({
  args: {
    author: v.optional(v.string()),
    user: v.optional(v.string()), // Fallback
    title: v.optional(v.string()),
    productTitle: v.optional(v.string()),
    rating: v.optional(v.number()),
    content: v.string(),
    date: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    showOnHome: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("reviews"),
    author: v.optional(v.string()),
    user: v.optional(v.string()),
    title: v.optional(v.string()),
    productTitle: v.optional(v.string()),
    rating: v.optional(v.number()),
    content: v.optional(v.string()),
    date: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    showOnHome: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const seed10Reviews = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete existing reviews to cleanly populate the 10 high-quality sincere reviews
    const existing = await ctx.db.query("reviews").collect();
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }

    const reviewsData = [
      {
        order: 1,
        showOnHome: true,
        author: "김*훈 (서울 송파구)",
        title: "칠순 맞이 부모님 모시고 다녀온 싱가포르-말레이시아, 평생 잊지 못할 감동이었습니다.",
        productTitle: "[로얄캐리비안] 싱가포르·말레이시아·태국 6일",
        rating: 5,
        date: "2026.08.18",
        images: [],
        content: "부모님 칠순 기념으로 가족 6명이 함께 다녀왔습니다. 어르신들 모시고 가는 해외여행이라 이동이 가장 걱정이었는데, 짐을 한 번만 풀고 매일 아침 새로운 기항지에 도착하는 크루즈 여행이 정답이었습니다. 전담 한국인 인솔자분께서 선상 신문 번역부터 기항지 투어까지 세심하게 챙겨주셔서 부모님께서 '살면서 가장 대접받은 여행'이라며 너무 행복해하셨습니다."
      },
      {
        order: 2,
        showOnHome: true,
        author: "이*영 & 박*진 부부",
        title: "결혼 10주년 리마인드 여행, 발코니 오션뷰에서 본 지중해의 일출은 예술이었습니다.",
        productTitle: "[MSC 그란디오사] 서지중해 4개국 10일",
        rating: 5,
        date: "2026.08.12",
        images: [],
        content: "결혼 10주년을 맞아 특별한 여행을 찾다가 다온넷크루즈를 통해 지중해 크루즈를 예약했습니다. 발코니 객실에서 끝없이 펼쳐진 에메랄드빛 바다를 바라보며 마시던 아침 커피와 매일 저녁 정찬 레스토랑의 코스 요리는 잊을 수 없습니다. 특히 복잡한 이동 없이 로마, 바르셀로나, 마르세유를 한 번에 여행할 수 있어 완벽한 휴식이 되었습니다."
      },
      {
        order: 3,
        showOnHome: true,
        author: "정*호 (경기 성남시)",
        title: "스마트 후불제 덕분에 목돈 부담 없이 은퇴 기념 버킷리스트를 실현했습니다.",
        productTitle: "[셀러브리티] 알래스카 빙하 피오르드 9일",
        rating: 5,
        date: "2026.08.05",
        images: [],
        content: "오랜 직장 생활을 마치고 아내와의 버킷리스트였던 알래스카 크루즈를 다녀왔습니다. 목돈 지출이 망설여졌는데 다온넷크루즈의 스마트 후불 분할 납부 시스템 덕분에 부담 없이 바로 결정할 수 있었습니다. 거대한 빙하가 눈앞에서 무너져 내리는 웅장한 광경과 선상에서 즐긴 온수 스파는 평생 기억에 남을 최고의 선물이었습니다."
      },
      {
        order: 4,
        showOnHome: false,
        author: "최*은 (인천 연수구)",
        title: "환갑 기념 3대 가족여행, 아이부터 할머니까지 모두가 만족한 여행!",
        productTitle: "[로얄캐리비안] 스펙트럼 오브 더 시즈 동남아 6일",
        rating: 5,
        date: "2026.07.28",
        images: [],
        content: "70대 어머니와 초등학생 아이 2명까지 3대가 함께하는 여행이라 걱정이 많았는데, 선박 안에 워터파크, 범퍼카, 키즈클럽, 오락시설과 매일 밤 브로드웨이급 공연까지 준비되어 있어 온 가족이 쉴 틈 없이 즐거웠습니다. 매일 아침 풍성한 뷔페와 룸서비스도 매우 훌륭했습니다. 다음 환갑 때도 무조건 크루즈로 가기로 약속했습니다."
      },
      {
        order: 5,
        showOnHome: false,
        author: "강*우 (부산 해운대구)",
        title: "한국인 가이드와 전담 컨시어지가 처음부터 끝까지 케어해주어 안심했습니다.",
        productTitle: "[프린세스 크루즈] 일본 오키나와 & 대만 에메랄드 8일",
        rating: 5,
        date: "2026.07.19",
        images: [],
        content: "영어와 일본어 소통이 서툴러 해외여행을 주저했는데, 다온넷 전담 컨시어지 서비스 덕분에 기항지 수속부터 선상 프로그램 예약, 식당 주문까지 아무런 어려움 없이 편안하게 누렸습니다. 기항지마다 한국어 전용 차량과 가이드가 배차되어 이동도 쾌적했습니다. 부모님 효도 여행으로 강력 추천합니다."
      },
      {
        order: 6,
        showOnHome: false,
        author: "윤*희 (대전 유성구)",
        title: "엄마와 단둘이 떠난 첫 모녀 크루즈, 매 순간이 인생 사진이었습니다.",
        productTitle: "[코스타 크루즈] 동부 지중해 그리스 산토리니 9일",
        rating: 5,
        date: "2026.07.10",
        images: [],
        content: "엄마 환갑 선물로 단둘이 떠난 그리스 산토리니 크루즈였습니다. 선박 갑판에서 바라보는 에게해의 석양과 하얀 마을 산토리니의 전경은 숨이 멎을 만큼 아름다웠습니다. 선내 정찬 파티 때 엄마가 예쁜 드레스를 입고 소녀처럼 기뻐하시던 모습이 아직도 눈에 선합니다. 소중한 추억을 선물해주신 플래너님께 감사드립니다."
      },
      {
        order: 7,
        showOnHome: false,
        author: "한*수 (대구 수성구)",
        title: "호텔 뷔페 이상의 고품격 미식과 매일 밤 열리는 갈라쇼가 압권이었습니다.",
        productTitle: "[MSC 그란디오사] 서지중해 4개국 10일",
        rating: 5,
        date: "2026.06.29",
        images: [],
        content: "음식에 까다로운 편인데, 선내 메인 다이닝의 스테이크와 랍스터, 매일 다르게 제공되는 지중해식 정찬 퀄리티에 감탄했습니다. 선상 바에서 칵테일을 마시며 즐긴 라이브 재즈 공연과 태양의 서커스 수준의 아크로바틱 쇼는 매일 밤이 축제 같았습니다. 지인들에게도 적극 추천하고 있습니다."
      },
      {
        order: 8,
        showOnHome: false,
        author: "오*석 (광주 서구)",
        title: "대학 동기 모임 6명과 함께 떠난 여행, 모두가 극찬했습니다.",
        productTitle: "[다이아몬드 프린세스] 일본 규슈 & 오키나와 7일",
        rating: 5,
        date: "2026.06.18",
        images: [],
        content: "친구들과 1년 동안 계모임을 모아 떠난 크루즈 여행이었습니다. 개별 자유 시간도 충분하고 저녁에는 다 같이 모여 정찬과 펍을 즐길 수 있어 단체 여행으로 이보다 더 좋을 수 없었습니다. 단체 맞춤 상담으로 객실 배정부터 기항지 투어까지 원스톱으로 처리해주셔서 모임 총무로서 정말 편했습니다."
      },
      {
        order: 9,
        showOnHome: false,
        author: "배*진 (서울 강남구)",
        title: "바다 위 특급 호텔이라는 말이 실감 났습니다. 룸컨디션과 청결도 100점!",
        productTitle: "[셀러브리티] 알래스카 빙하 피오르드 9일",
        rating: 5,
        date: "2026.06.05",
        images: [],
        content: "하루 두 번씩 룸 메이크업을 해주고 침구류 상태도 5성급 특급 호텔 이상이었습니다. 배가 워낙 크고 안정적이어서 흔들림이나 멀미는 전혀 느끼지 못했고, 조용한 오션뷰 발코니에서 책을 읽으며 온전한 쉼을 얻을 수 있었습니다. 복잡한 일상을 벗어나 힐링이 필요한 분들께 강력히 추천합니다."
      },
      {
        order: 10,
        showOnHome: false,
        author: "송*미 (울산 남구)",
        title: "상담부터 예약, 여행 종료까지 1:1로 꼼꼼하게 챙겨주신 플래너님 최고입니다.",
        productTitle: "[로얄캐리비안] 싱가포르·말레이시아·태국 6일",
        rating: 5,
        date: "2026.05.22",
        images: [],
        content: "첫 크루즈라 여권 준비, 탑승 수속, 선내 결제 등 모르는 게 많았는데 담당 플래너님께서 출국 전 오리엔테이션 자료부터 탑승 직전 모바일 체크인까지 꼼꼼하게 가이드해주셔서 불안감 없이 다녀올 수 있었습니다. 다녀온 후 안부 연락까지 챙겨주시는 모습에 진정한 프리미엄 서비스를 느꼈습니다."
      }
    ];

    for (const rev of reviewsData) {
      await ctx.db.insert("reviews", rev);
    }

    return { success: true, count: reviewsData.length };
  },
});
