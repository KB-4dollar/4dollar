<script setup>
import { ref } from 'vue';
import DotNav from '@/components/common/DotNav.vue';
import HeroSection from '@/components/landing/HeroSection.vue';
import CTASection from '@/components/landing/FinalSection.vue';
import FeatureSection from '@/components/landing/SecondSection.vue';
import StatsSection from '@/components/landing/ThirdSection.vue';
import EventSection from '@/components/landing/FirstSection.vue';

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
    class="h-screen flex flex-row overflow-x-scroll overflow-y-hidden snap-x snap-mandatory scroll-smooth md:flex-col md:overflow-y-scroll md:overflow-x-hidden md:snap-y"
  >
    <DotNav
      :sections="sections"
      :activeIndex="activeIndex"
      @move="scrollToSection"
    />

    <HeroSection :ref="(el) => setSectionRef(el, 0)" />
    <EventSection :ref="(el) => setSectionRef(el, 1)" />
    <FeatureSection :ref="(el) => setSectionRef(el, 2)" />
    <StatsSection :ref="(el) => setSectionRef(el, 3)" />
    <CTASection :ref="(el) => setSectionRef(el, 4)" />
  </div>
</template>
