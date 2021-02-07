<template>
  <div class="d-flex justify-content-center">
    <a
      v-for="(point, index) in points"
      :key="index"
      @click="select(point)"
      class="block"
      :class="{ active: currentPoint == point }"
    >
      <img class="position-relative" :src="'img/' + point + '.png'" />
    </a>
    <a @click="select(-1)" class="block ml-3" :class="{ active: currentPoint == -1 }">
      <img class="position-relative" :src="'img/question.png'" />
    </a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PokerComponent extends Vue {
  @Prop() currentPoint!: number;
  points = [0.5, 1, 2, 3, 5, 8, 13];

  select(point: number) {
    this.$emit('onPoint', point);
  }
}
</script>

<style scoped lang="scss">
a {
  height: 120px;
  margin: 0 2.5px;
  cursor: pointer !important;
  img {
    top: 30px;
    transition: top ease 0.2s;
  }
  &:hover,
  &.active {
    img {
      top: 0px;
    }
  }
  &.active {
    img {
      box-shadow: #fff 0px 0px 10px;
      border-radius: 6px;
    }
  }
}
</style>
