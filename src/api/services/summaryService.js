// src/api/services/summaryService.js
import { transactionService } from './transactionService';
import { CATEGORY } from '../constants/enumConstants';

// ✨ 실제 enumConstants.js 에 정의된 변수명으로 완벽 매칭!
const FEEDBACK_POOL = {
  [CATEGORY.FOOD]: [
    "엥겔 지수가 폭발하기 직전이에요. 배달 앱 VIP는 훈장이 아닙니다.",
    "식비가 식도락 여행 수준이네요. 오늘은 냉장고 파먹기를 추천합니다.",
    "카페인 중독이 의심되네요. 텀블러와 친해져 보는 건 어떨까요?",
    "식비 지출이 심상치 않아요. 오늘은 요리사가 되어보는 건 어떨까요?",
    "디저트 배는 따로 있다지만, 통장 잔고는 따로 있지 않습니다."
  ],
  [CATEGORY.TRANSPORT]: [
    "택시는 전용 기사님이 아닙니다. 조금만 일찍 일어나볼까요?",
    "교통비가 비행기 티켓값과 맞먹으려고 해요.",
    "가까운 거리는 걸어 다니며 건강과 지갑을 동시에 챙겨보세요.",
    "지각비 피하려다 택시비 폭탄 맞으셨네요.",
    "대중교통의 낭만을 즐겨보시는 건 어떨까요? 통장도 좋아할 겁니다."
  ],
  [CATEGORY.CULTURE]: [
    "결제만 해두고 안 보는 구독 서비스, 당장 해지하세요!",
    "취미 생활도 좋지만, 통장이 취미를 감당하지 못하고 있어요.",
    "이번 달은 문화시민보다 저축왕이 되어보는 게 어떨까요?",
    "영화표 값이 금값인 시대입니다. 신중한 예매가 필요해요.",
    "덕질도 통장 잔고를 봐가면서 해야 합니다."
  ],
  [CATEGORY.HOSPITAL]: [
    "건강 잃고 돈 잃고... 아프면 제일 서럽습니다. 평소에 관리하세요!",
    "영양제 쇼핑보다는 규칙적인 식사와 수면이 최고의 보약입니다.",
    "병원비가 많이 나왔네요. 다음 달엔 무조건 건강 챙기기!",
    "운동 등록해놓고 기부천사가 되신 건 아니죠?",
    "스트레스 받아서 병원 가는 것보다 스트레스를 안 받는 게 이득입니다."
  ],
  [CATEGORY.LIVING]: [
    "다이소에서 만수르 빙의하신 건 아니죠? 1000원도 모이면 큽니다.",
    "1+1 행사는 안 사면 100% 할인이라는 사실을 명심하세요.",
    "집에 있는 생필품 재고부터 먼저 파악해볼까요?",
    "쇼핑 카트에 담기 전에 '진짜 필요한가?' 세 번 질문해보세요.",
    "소비의 요정이 생활용품 코너에 강림하셨네요."
  ],
  [CATEGORY.EVENT]: [
    "프로 참석러의 길은 지갑을 얇게 만듭니다.",
    "축하하는 마음은 크지만 내 지갑은 홀쭉해졌네요.",
    "이번 달은 유독 인싸력을 과시하셨군요.",
    "경조사비는 어쩔 수 없다지만, 통장 잔고를 보니 씁쓸하네요.",
    "다음 달에는 부디 모임이 적기를 기도해봅니다."
  ],
  [CATEGORY.ETC]: [
    "어디에 썼는지 모를 돈이 가장 아까운 법입니다. 영수증 챙기세요!",
    "가랑비에 옷 젖는 줄 모른다더니, 자잘한 지출이 모여 태산이 되었네요.",
    "기타 지출이 이렇게 많다니, 내역을 꼼꼼히 리뷰해볼 필요가 있습니다.",
    "이번 달은 '숨만 쉬어도 나가는 돈'이 유독 많았네요.",
    "'기분파' 소비의 흔적이 고스란히 남아있군요."
  ]
};

export const summaryService = {
  
  async getTopExpenseCategory(userId, yearMonth) {
    try {
      const stats = await transactionService.getMonthlyStats(userId, yearMonth);
      const expenseByCategory = stats.breakdown?.expenseByCategory || {};
      const categories = Object.keys(expenseByCategory);

      if (categories.length === 0) return null; 

      let topCategory = categories[0];
      let maxExpense = expenseByCategory[topCategory];

      for (const category of categories) {
        if (expenseByCategory[category] > maxExpense) {
          topCategory = category;
          maxExpense = expenseByCategory[category];
        }
      }

      return topCategory; 
    } catch (error) {
      console.error('[summaryService.getTopExpenseCategory] failed:', error);
      return null;
    }
  },

  getRandomFeedback(category) {
    if (!category) {
      return "이번 달은 지출이 아주 깔끔하네요! 훌륭합니다. 👏";
    }

    // DB에 저장된 "경조사비" 등의 이름과 완벽하게 일치하므로 바로 찾을 수 있습니다.
    const pool = FEEDBACK_POOL[category];
    
    // 혹시라도 매칭되지 않는 카테고리가 들어오면 '기타' 풀에서 가져오도록 안전장치 마련
    const safePool = pool && pool.length > 0 ? pool : FEEDBACK_POOL[CATEGORY.ETC];

    const randomIndex = Math.floor(Math.random() * safePool.length);
    return safePool[randomIndex];
  }
};