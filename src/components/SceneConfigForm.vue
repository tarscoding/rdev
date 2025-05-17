<script setup lang="ts">
import { ref } from 'vue';
import { useSceneStore } from '../stores/scene';
import { Icon } from '@iconify/vue';
import { storeToRefs } from 'pinia';
import FormCardContainer from './FormCardContainer.vue';
import { defineProps } from 'vue';

const sceneStore = useSceneStore();
const { sceneListRef, currentSceneId } = storeToRefs(sceneStore);
const { setCurrentScene } = sceneStore;
const sceneList = sceneListRef;
const hoveredId = ref<string | null>(null);

const props = defineProps<{
  currentStep: number;
  totalSteps: number;
}>();

function selectScene(scene: any) {
  setCurrentScene(scene.id);
  console.log('当前选中的场景id:', scene.id);
}

function resetScene() {
  sceneStore.resetCurrentScene();
}

const emit = defineEmits(['prev', 'next', 'reset', 'generate']);
const handleNext = () => {
  if (currentSceneId.value) emit('next', currentSceneId.value);
};
</script>

<template>
  <FormCardContainer
    :showPrev="props.currentStep > 1"
    :showNext="props.currentStep < props.totalSteps"
    :showReset="true"
    :showGenerate="props.currentStep === props.totalSteps"
    @prev="$emit('prev')"
    @next="handleNext"
    @reset="resetScene"
    @generate="$emit('generate')"
  >
    <template #title>选择开发场景</template>
    <div class="scene-btn-grid">
      <button
        v-for="scene in sceneList"
        :key="scene.id"
        class="scene-btn"
        :class="{
          selected: currentSceneId === scene.id,
          hovered: hoveredId === scene.id
        }"
        :style="{
          borderColor: (currentSceneId === scene.id || hoveredId === scene.id) ? scene.color : '#eee',
          borderWidth: currentSceneId === scene.id ? '2.5px' : '2px',
          background: currentSceneId === scene.id
            ? scene.color + '44'
            : hoveredId === scene.id
              ? scene.color + '11'
              : '#fff'
        }"
        @click="selectScene(scene)"
        @mouseenter="hoveredId = scene.id"
        @mouseleave="hoveredId = null"
        type="button"
      >
        <div class="scene-header">
          <span class="scene-icon" :style="{ color: scene.color }">
            <Icon :icon="scene.icon" width="22" :color="scene.color" />
          </span>
          <span class="scene-name">{{ scene.name }}</span>
        </div>
        <div class="scene-desc">{{ scene.description }}</div>
      </button>
    </div>
  </FormCardContainer>
</template>

<style scoped>
.scene-card-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}
.scene-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: left;
}
.scene-btn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
.scene-btn {
  background: #fff;
  border: 2px solid #eee;
  border-radius: 8px;
  padding: 10px 8px 8px 8px;
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s, border-width 0.2s;
  box-shadow: 0 1px 4px #0001;
  user-select: none;
  outline: none;
  min-height: 60px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.scene-btn.selected {
  box-shadow: 0 0 16px #409eff55 !important;
  border-width: 2.5px !important;
  border-color: #409eff !important;
  background: #409eff22 !important;
  z-index: 1;
}
.scene-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}
.scene-icon {
  font-size: 22px;
}
.scene-name {
  font-size: 14px;
  font-weight: bold;
}
.scene-desc {
  font-size: 11px;
  color: #888;
  margin-left: 2px;
}
</style>
