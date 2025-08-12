<template>
  <Scichart2d msg="2D Charts" />
  <Scichart3d msg="3D Charts" />
  <ScichartPolar2d msg="Polar Charts" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Scichart2d from './components/Scichart2d.vue'
import Scichart3d from './components/Scichart3d.vue'
import ScichartPolar2d from './components/ScichartPolar2d.vue'

export default defineComponent({
  name: 'App',
  components: {
    Scichart2d,
    Scichart3d,
    ScichartPolar2d
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
