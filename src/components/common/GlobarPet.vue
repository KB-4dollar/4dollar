<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transaction';
import { storeToRefs } from 'pinia';

// --- [1. 이미지 임포트] ---
import n1 from '@/assets/curbe.svg';
import n2 from '@/assets/curbe2.svg';
import n3 from '@/assets/curbe3.svg';
import n4 from '@/assets/curbe4.svg';
import w1 from '@/assets/curbe40_1.svg';
import w2 from '@/assets/curbe40_2.svg';
import c1 from '@/assets/curbe80_1.svg';
import c2 from '@/assets/curbe80_2.svg';

// --- [2. 데이터 및 상태 관리] ---
const authStore = useAuthStore();
const transactionStore = useTransactionStore();
const { user } = storeToRefs(authStore);
const { totalExpense } = storeToRefs(transactionStore);

const spendingPercent = computed(() => {
  const goal = user.value?.goalAmount || 0;
  if (goal <= 0) return 0;
  const expense = totalExpense?.value || 0;
  return Math.round((expense / goal) * 100);
});

const currentTier = computed(() => {
  const p = spendingPercent.value;
  if (p >= 80) return 'critical';
  if (p >= 40) return 'warning';
  return 'normal';
});

const petImageSets = {
  normal: [n1, n2, n3, n4],
  warning: [w1, w2],
  critical: [c1, c2]
};

// --- [✨ 추가 로직: 드래그 이동 제어] ---
const position = ref({ x: 40, y: 0 }); // 초기 위치 (left-10 = 40px)
const isDragging = ref(false);
const hasMoved = ref(false); // 드래그인지 클릭인지 판별
let offset = { x: 0, y: 0 };

const startDrag = (e) => {
  isDragging.value = true;
  hasMoved.value = false;

  // 마우스/터치 좌표 가져오기
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

  // 클릭한 지점과 캐릭터 좌표 사이의 간격 저장
  offset.x = clientX - position.value.x;
  offset.y = clientY - position.value.y;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDrag);
  window.addEventListener('touchend', stopDrag);
};

const onDrag = (e) => {
  if (!isDragging.value) return;
  hasMoved.value = true; // 이동이 발생함

  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

  position.value = {
    x: clientX - offset.x,
    y: clientY - offset.y
  };
};

const stopDrag = () => {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', stopDrag);
};

// --- [3. 애니메이션 로직 (프레임 교체)] ---
const currentFrameIndex = ref(0);
let frameInterval = null;

const nextFrame = () => {
  const set = petImageSets[currentTier.value];
  if (!set) return;
  currentFrameIndex.value = (currentFrameIndex.value + 1) % set.length;
};

const startAnimation = () => {
  if (frameInterval) clearInterval(frameInterval);
  const speed = currentTier.value === 'normal' ? 800 : 500;
  frameInterval = setInterval(nextFrame, speed);
};

watch(currentTier, () => {
  currentFrameIndex.value = 0;
  startAnimation();
});

onMounted(() => {
  // 초기 Y축 위치 설정 (화면 하단에서 10정도 띄움)
  position.value.y = window.innerHeight - (window.innerWidth < 768 ? 200 : 300);
  startAnimation();
});

onUnmounted(() => {
  if (frameInterval) clearInterval(frameInterval);
});

const currentPetImage = computed(() => {
  const set = petImageSets[currentTier.value];
  return set ? set[currentFrameIndex.value] : n1;
});

// --- [4. 멘트 로직] ---
const isBubbleVisible = ref(false);
const currentMessage = ref("");
let bubbleTimer = null;

const messageTiers = {
  normal: ["부자 되는 중! 🌸", "지출 관리 최고예요!", "이대로만 갑시다!", "기분 좋은 소비네요 💰"],
  warning: ["조금 위험해요! 😡", "돈이 날아가요! 💸", "벌써 40% 넘었어요!", "장바구니 금지!"],
  critical: ["망했어요!! 🔥", "영혼 가출 중.. 👻", "당장 멈춰요!! ✋", "지갑 비상 상태!"]
};

const talk = () => {
  // 🌟 [추가] 드래그 중이었다면 대화를 띄우지 않음
  if (hasMoved.value) return;

  if (bubbleTimer) clearTimeout(bubbleTimer);
  const messages = messageTiers[currentTier.value] || messageTiers.normal;
  currentMessage.value = messages[Math.floor(Math.random() * messages.length)];
  isBubbleVisible.value = true;
  bubbleTimer = setTimeout(() => isBubbleVisible.value = false, 3500);
};
</script>

<template>
  <div 
    class="fixed z-[999] flex flex-col items-center select-none"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
  >
    
    <transition name="fade-up">
      <div 
        v-if="isBubbleVisible" 
        class="pointer-events-auto absolute bottom-[100%] left-0 w-[180px] bg-white border-2 rounded-2xl p-4 shadow-2xl transition-all duration-300"
        :class="[
          currentTier === 'critical' ? 'border-gray-900 bg-gray-50' : '',
          currentTier === 'warning' ? 'border-red-500' : '',
          currentTier === 'normal' ? 'border-pink-200' : ''
        ]"
      >
        <div 
          class="absolute -bottom-[7px] left-10 w-3 h-3 bg-white border-r-2 border-b-2 rotate-45 transition-all duration-300"
          :class="[
            currentTier === 'critical' ? 'border-gray-900' : '',
            currentTier === 'warning' ? 'border-red-500' : '',
            currentTier === 'normal' ? 'border-pink-200' : ''
          ]"
        ></div>
        
        <p class="text-xs font-extrabold text-center break-keep leading-snug"
          :class="currentTier === 'warning' ? 'text-red-600' : 'text-text-primary'"
        >
          {{ currentMessage }}
        </p>
      </div>
    </transition>

    <div 
      @mousedown="startDrag"
      @touchstart="startDrag"
      @mouseup="talk"
      class="pointer-events-auto cursor-grab active:cursor-grabbing transition-transform duration-300 active:scale-95 flex justify-center items-center"
    >
      <div 
        class="md:w-64 md:h-64 w-48 h-48 drop-shadow-2xl flex justify-center items-center transition-all duration-300"
        :class="currentTier === 'warning' ? 'scale-[0.85]' : 'scale-100'"
      >
        <img 
          :src="currentPetImage" 
          alt="curbe pet" 
          class="w-full h-full object-contain pointer-events-none" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 드래그 시 텍스트 선택 방지 */
.select-none {
  user-select: none;
}

/* 말풍선 등장 애니메이션 */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.fade-up-enter-from { opacity: 0; transform: translateY(20px) scale(0.8); }
.fade-up-leave-to { opacity: 0; transform: translateY(10px) scale(0.8); }
</style>