<template>
  <div class="column-wrapper">
    <span class="list-title">{{title}}</span>
  <div class="column-container">
    <div class="cards-container">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project"></ProjectCard>
    </div>
  </div>
</div>
</template>

<script setup >
import ProjectCard from 'src/components/ProjectCard.vue';

defineProps({
  projects:[],
  listTitle:String
})
</script>
<style scoped>
 .column-container{
  height: fit-content ;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 1rem;
  padding-right: 1rem;
  min-height: 400px;
  max-height: 800px;
  overflow-y:auto ;
 }
 .column-wrapper {
  background-color: black;

 }
 .list-title{
  text-align: center;
  width: 100%;
  color: white;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
 }
 .cards-container {
  margin-top: calc(400px + 4rem);
  }
 .column-container::-webkit-scrollbar {
  width: 10px;
}

.column-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.column-container::-webkit-scrollbar-thumb {
  background: gray;
  border-radius: 10px;
}

.column-container::-webkit-scrollbar-thumb:hover {
  opacity: 30%;
}
</style>
