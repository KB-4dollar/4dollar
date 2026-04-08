<script setup>
import { ref } from 'vue';
import DotNav from '@/components/common/DotNav.vue';
import HeroSection from '@/components/landing/HeroSection.vue';
import FeatureSection from '@/components/landing/FeatureSection.vue';
import EventSection from '@/components/landing/EventSection.vue';
import StatsSection from '@/components/landing/StatsSection.vue';
import CTASection from '@/components/landing/CTASection.vue';
import '@/style/landing.css';

import { useScrollSnap } from '@/components/landing/useScrollSnap';

const sectionRefs = ref([]);
const scrollContainer = ref(null);

const sections = ['Hero', 'Feature', 'Event', 'Stats', 'CTA'];

const setSectionRef = (el, index) => {
  if (el?.el) {
    el.el.dataset.index = index;
    sectionRefs.value[index] = el.el;
  }
};

const { activeIndex, scrollToSection } = useScrollSnap(
  sectionRefs,
  scrollContainer
);
</script>

<template>
  <div
    ref="scrollContainer"
    class="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
  >
    <DotNav
      :sections="sections"
      :activeIndex="activeIndex"
      @move="scrollToSection"
    />

    <HeroSection :ref="(el) => setSectionRef(el, 0)" />
    <FeatureSection :ref="(el) => setSectionRef(el, 1)" />
    <EventSection :ref="(el) => setSectionRef(el, 2)" />
    <StatsSection :ref="(el) => setSectionRef(el, 3)" />
    <CTASection :ref="(el) => setSectionRef(el, 4)" />
  </div>
</template>
