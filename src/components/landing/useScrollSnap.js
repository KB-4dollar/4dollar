import { ref, onMounted } from 'vue';

export function useScrollSnap(sectionRefs, scrollContainer) {
  const activeIndex = ref(0);

  const scrollToSection = (index) => {
    sectionRefs.value[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  onMounted(() => {
    const container = scrollContainer.value;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const height = container.clientHeight;

      const index = Math.round(scrollTop / height);

      activeIndex.value = index;
    };

    container.addEventListener('scroll', handleScroll);

    handleScroll();
  });

  return { activeIndex, scrollToSection };
}
