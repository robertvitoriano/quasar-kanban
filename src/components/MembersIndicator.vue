<template>
  <div class="container">
    <img v-for="(member, index) in members" :style="{ right: `calc(${index * 18}px )` }"
    :key="member.id" class="membership-indicator" :src="member.avatar" />
  </div>
</template>
<script setup>

defineProps(['members'])

</script>
<style scoped>
.membership-indicator {
  width: 2vw;
  height: 2vw;
  border: 2px solid white;
  border-radius: 50%;
  background-color: green;
  position: absolute;
}

.container {
  background-color: black;
  position: absolute;
  display: flex;
  right: 0;
  bottom: 3rem;
}
@media screen and (max-width: 800px) {

  .membership-indicator {
    width: 7vw;
    height: 7vw;
  }
}
</style>
