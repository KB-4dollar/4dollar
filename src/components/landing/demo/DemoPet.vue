<script setup>
import { ref, onMounted } from 'vue';

import n1 from '@/assets/curbe.svg';
import n2 from '@/assets/curbe2.svg';

const frames = [n1, n2];
const current = ref(0);

const bubbles = ref([]);

const messages = [
  '또 편의점 갔죠? 😏',
  '이건 충동소비인데요?',
  '지갑 울고 있어요 💸',
  '오늘도 flex🔥',
  '카드값 생각은 했나요?',
  '이거 꼭 필요했나요?',
];

const addBubble = () => {
  const id = Date.now();

  bubbles.value.unshift({
    id,
    text: messages[Math.floor(Math.random() * messages.length)],
  });

  if (bubbles.value.length > 5) {
    bubbles.value.pop();
  }

  setTimeout(() => {
    bubbles.value = bubbles.value.filter((b) => b.id !== id);
  }, 3000);
};

onMounted(() => {
  setInterval(() => {
    current.value = (current.value + 1) % frames.length;
  }, 800);
  setInterval(() => {
    addBubble();
  }, 1200);
});
</script>

<template>
  <div
    class="relative flex flex-col items-center justify-center mt-10 md:mt-16"
  >
    <div class="absolute bottom-full flex flex-col items-center gap-2 mb-3">
      <transition-group name="fade-up">
        <div
          v-for="bubble in bubbles"
          :key="bubble.id"
          class="bg-white border border-pink-200 rounded-xl px-3 py-2 shadow-md text-xs font-bold whitespace-nowrap"
        >
          {{ bubble.text }}
        </div>
      </transition-group>
    </div>

    <img
      :src="frames[current]"
      class="w-40 md:w-56 transition-transform duration-300 hover:scale-105"
      alt="demo pet"
    />
  </div>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
