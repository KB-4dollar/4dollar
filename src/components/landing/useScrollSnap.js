import { ref, onMounted } from 'vue';

export function useScrollSnap(sectionRefs, scrollContainer) {
  const activeIndex = ref(0);

  const scrollToSection = (index) => {
    sectionRefs.value[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  onMounted(() => {
    const container = scrollContainer.value;

    const handleScroll = () => {
      const container = scrollContainer.value;

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const scrollLeft = container.scrollLeft;
        const width = container.clientWidth;
        activeIndex.value = Math.round(scrollLeft / width);
      } else {
        const scrollTop = container.scrollTop;
        const height = container.clientHeight;
        activeIndex.value = Math.round(scrollTop / height);
      }
    };

    container.addEventListener('scroll', handleScroll);

    handleScroll();
  });

  return { activeIndex, scrollToSection };
}
