<template>
  <div class="null-avatar-container">{{ String(props.title)[0] }}</div>
</template>

<script setup>
const props = defineProps(["title"]);

</script>

<style scoped>
.null-avatar-container {
  background-color: white;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: inherit;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
