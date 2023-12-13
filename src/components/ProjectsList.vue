<template>
  <div
    class="column-wrapper"
    @dragover.prevent="handleDragOver"
    @drop="handleDrop"
  >
    <span class="list-title">{{ title }}</span>
    <div class="column-container">
      <div class="cards-container" dropzone="true">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          :reloadBoard="reloadBoard"
        ></ProjectCard>
      </div>
    </div>
    <AddButton class="add-button" @click="toggleProjectCreationModal" />
  </div>
  <q-dialog v-model="isProjectCreationModalOpen">
    <q-card class="project-modal">
      <q-card-section class="project-modal-container">
        <div class="project-modal-content">
          <q-form @submit="createNewProject(id)" color="dark">
            <q-input
              filled
              v-model="newProjectTitle"
              label="Title of the new project"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Enter the title of the project',
              ]"
              color="dark"
            />
            <div class="form-modal-buttons">
              <q-btn label="Create Project" type="submit" color="dark" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps, ref } from "vue";
import ProjectCard from "src/components/ProjectCard.vue";
import AddButton from "src/components/AddButton.vue";
import { api } from "boot/axios";

const { reloadBoard, id } = defineProps(["projects", "title", "id", "reloadBoard"]);

const isProjectCreationModalOpen = ref(null);
const newProjectTitle = ref(null);
const oneCardIsBeingHovered = ref(false);

async function createNewProject(id) {
  await api.post("/projects", {
    title: newProjectTitle.value,
    project_list_id: id,
  });
  reloadBoard();
  toggleProjectCreationModal();
}

function toggleProjectCreationModal() {
  isProjectCreationModalOpen.value = !isProjectCreationModalOpen.value;
}
const handleDragOver = (event) => {
  event.preventDefault();
  const elementBeingHoveredIsCard =
    event.target.classList.contains("card-container");
  if (elementBeingHoveredIsCard) {
    const clonedCard = event.target.cloneNode();
    if (clonedCard && !oneCardIsBeingHovered.value) {
      clonedCard.style.backgroundColor = "black";
      clonedCard.innerHTML = "";
      clonedCard.style.border = "dotted white 3px";
      const parentElement = event.target.parentNode;
      parentElement.insertBefore(clonedCard, event.target);
      oneCardIsBeingHovered.value = true;
    }
  }
};

const handleDrop = async (event) => {
  event.preventDefault();
  const draggedCardId = event.dataTransfer.getData("text/plain");
  oneCardIsBeingHovered.value = false;
  event.target.remove();
  const projectListId = id;
  await moveCard(draggedCardId, projectListId);
  reloadBoard();
};

const moveCard = async (cardId, targetProjectListId) => {
  console.log({targetProjectListId})
  await api.patch(`/projects/${cardId}`, {
    project_list_id: targetProjectListId,
  });
};
</script>
<style scoped>
.column-container {
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding-left: 1rem;
  padding-right: 1rem;
  min-height: 30vh;
  max-height: 50vh;
  overflow-y: auto;
  position: relative;
}
.cards-container {
  height: 50vh;
}
.column-wrapper {
  background-color: black;
  margin-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.list-title {
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
.add-button {
  margin-top: 1rem;
}
.form-modal-buttons {
  display: flex;
  justify-content: center;
}
</style>
