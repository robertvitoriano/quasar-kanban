<template>
  <q-page class="page-wrapper">
    <h1 class="board-title">{{boardStore.title}}</h1>
    <div class="projects-list-container">
      <ProjectsList
        v-for="projectList in boardStore.getprojectLists"
        :projects="projectList.projects"
        :key="projectList.id"
        :title="projectList.title"
        :id="projectList.id"
      ></ProjectsList>
    </div>
    <AddButton class="add-button" @click="toggleProjectListModal" />
  </q-page>
  <q-dialog v-model="isProjectListModalOpen">
    <q-card class="board-creation-modal">
      <q-card-section class="board-creation-modal-container">
        <div class="board-creation-modal-content">
          <q-form @submit="createProjectList" color="dark">
            <q-input
              filled
              v-model="newProjectListTitle"
              label="Title of the new list"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Enter the title of the list',
              ]"
              color="dark"
            />
            <div class="form-modal-buttons">
              <q-btn label="Create List" type="submit" color="dark" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import ProjectsList from "src/components/ProjectsList.vue";
import { onMounted, ref } from "vue";
import { useBoardStore } from "./../stores/board";
import AddButton from "components/AddButton.vue";

import { api } from "boot/axios";

onMounted(async () => {
  await boardStore.loadBoard();
});

const boardStore = useBoardStore();
const isProjectListModalOpen = ref(false);
const newProjectListTitle = ref("");
const boardId = boardStore.getBoardId;

function toggleProjectListModal() {
  isProjectListModalOpen.value = !isProjectListModalOpen.value;
}
async function createProjectList() {
  await api.post("/project-lists", {
    title: newProjectListTitle.value,
    board_id: boardId,
  });
  newProjectListTitle.value = "";
  await boardStore.loadBoard();
  toggleProjectListModal();
}
</script>
<style scoped>
.projects-list-container {
  display: flex;
  flex-direction: row;
  margin-top: 7rem;
}
.add-button {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  background-color: white;
  color: black;
}
.add-button:hover{
  background-color: black;
  color: white;
  border: white solid 1px;
}
.form-modal-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
}
.board-title{
  font-size: 4rem;
  font-weight: bold;
  position: fixed;
  left: 45%;
  top: 1rem;
}


</style>
