<template>
  <q-page class="page-wrapper">
    <div class="projects-list-container">
      <ProjectsList
        v-for="projectList in projectLists"
        :projects="projectList.projects"
        :key="projectList.id"
        :title="projectList.title"
        :id="projectList.id"
        :reloadBoard="reloadBoard"
      ></ProjectsList>
    </div>
  </q-page>
</template>

<script setup>
import ProjectsList from "src/components/ProjectsList.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useBoardStore } from "./../stores/board";

import { api } from "boot/axios";

onMounted(async () => {
  await loadBoard();
});
const route = useRoute();
const boardStore = useBoardStore();
const reloadBoard = ref(async () => await loadBoard());
const projectLists = ref([]);

async function loadBoard() {
  const boardId = boardStore.getBoardId;
  const projectsResponse = await api.get(`/boards/${boardId}`);
  projectLists.value = projectsResponse.data.data.project_lists;
}
</script>
<style scoped>
.projects-list-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 1rem;
}
</style>
