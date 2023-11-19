<template>
  <q-page class="page-wrapper">
    <div class="projects-list-container">
      <ProjectsList
        v-for="projectList in projectLists"
        :projects="projectList.projects"
        :key="projectList.id"
        :title="projectList.title"
      ></ProjectsList>
    </div>
  </q-page>
</template>

<script setup>
import ProjectsList from "src/components/ProjectsList.vue";
import { onMounted, ref } from "vue";
import { api } from "boot/axios";

onMounted(async()=>{
  const projectsResponse = await api.get('/boards/1')
  projectLists.value = projectsResponse.data.data.project_lists

})
const projectLists= ref([])


</script>
<style scoped>
.projects-list-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 1rem;
}
</style>
