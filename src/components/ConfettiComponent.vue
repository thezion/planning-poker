<template>
  <div class="confetti-container">
    <div v-for="index in 20" :key="index" class="confetti-piece"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ConfettiComponent extends Vue {}
</script>

<style scoped lang="scss">
.confetti-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background-image: url('../../public/img/confetti-bg.png');
  background-size: 100% auto;
  background-position: center 3rem;
  background-repeat: no-repeat;
}

$c-yellow: #ffd300;
$c-blue: #17d3ff;
$c-pink: #ff4e91;

$duration: 1000;

@function randomNum($min, $max) {
  $rand: random();
  $randomNum: $min + floor($rand * (($max - $min) + 1));
  @return $randomNum;
}

.icon {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 32px;
  position: relative;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 16px;
  background: $c-yellow;
  top: 0;
  opacity: 0;

  @for $i from 1 through 19 {
    &:nth-child(#{$i}) {
      left: $i * 5%;
      transform: rotate(#{randomNum(-80, 80)}deg);
      animation: makeItRain $duration * 1ms infinite ease-out;
      animation-delay: #{randomNum(0, $duration * 0.5)}ms;
      animation-duration: #{randomNum($duration * 0.7, $duration * 1.2)}ms;
    }
  }

  &:nth-child(odd) {
    background: $c-blue;
  }

  &:nth-child(even) {
    // z-index: 1;
  }

  &:nth-child(4n) {
    width: 5px;
    height: 12px;
    animation-duration: $duration * 2ms;
  }

  &:nth-child(3n) {
    width: 3px;
    height: 10px;
    animation-duration: $duration * 2.5ms;
    animation-delay: $duration * 1ms;
  }

  &:nth-child(4n-7) {
    background: $c-pink;
  }
}

@keyframes makeItRain {
  from {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  to {
    transform: translateY(300px);
  }
}
</style>
