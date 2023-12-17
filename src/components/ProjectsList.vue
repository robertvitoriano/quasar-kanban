<template>
  <div
    class="column-wrapper"

  >
    <q-icon
      name="delete"
      color="red"
      size="1.5rem"
      @click="toggleDeleteProjectListModal()"
      class="delete-project-list-icon"
    />
    <span class="list-title">{{ title }}</span>
    <div class="column-container">
      <div class="cards-container"
       dropzone="true"
       @dragover.prevent="handleDragOver"
       @drop="handleDrop"
       @dragleave="handleDragLeave"
       >
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :setProjectBeingDragged="setProjectBeingDragged"
                    :cardContainerIndex="index+1"
        >
          ></ProjectCard
        >
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
  <q-dialog v-model="isProjectListDeleteConfirmationModalOpen">
    <q-card class="delete-confirmation-modal">
      <q-card-section class="delete-confirmation-modal-container">
        <div class="delete-confirmation-modal-content">
          <span class="delete-warning">
            Are you sure you want to delete this list ?
          </span>
          <div class="delete-confirmation-buttons">
            <q-btn
              label="No"
              @click="toggleDeleteProjectListModal"
              color="red"
            />
            <q-btn label="Yes" @click="deleteProjectList()" color="green" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref } from "vue";
import ProjectCard from "src/components/ProjectCard.vue";
import AddButton from "src/components/AddButton.vue";
import { api } from "boot/axios";
import { useBoardStore } from "src/stores/board";
const { id: projectListId } = defineProps([
  "projects",
  "title",
  "id",
]);
const boardStore = useBoardStore();
const isProjectCreationModalOpen = ref(null);
const newProjectTitle = ref(null);
const oneCardIsBeingHovered = ref(false);
const isProjectListDeleteConfirmationModalOpen = ref(false);
let projectBeingDragged = reactive({});
const setProjectBeingDragged = ref(
  (cardBeingDragged) => projectBeingDragged = cardBeingDragged
);
let projectBeingDraggedIsFromTheSameList = false;
let isProjectBeingDraggedTheSameAsBeingHovered = false;


async function createNewProject(id) {
  await api.post("/projects", {
    title: newProjectTitle.value,
    project_list_id: id,
  });
  await boardStore.loadBoard();
  toggleProjectCreationModal();
}

function toggleProjectCreationModal() {
  isProjectCreationModalOpen.value = !isProjectCreationModalOpen.value;
}
function toggleDeleteProjectListModal() {
  isProjectListDeleteConfirmationModalOpen.value = !isProjectListDeleteConfirmationModalOpen.value;
}

async function deleteProjectList() {
  await api.delete(`/project-lists/${projectListId}`);
  await boardStore.loadBoard();
}
const handleDragOver = (event) => {
  event.preventDefault();

  const elementBeingHoveredIsCard = event.target.classList.contains("card-container");
  const elementBeingHoveredIsCardsContainer = event.target.classList.contains("cards-container");
  const hoveredProjectId = Number(event.target.id);

  projectBeingDraggedIsFromTheSameList = projectBeingDragged.project_list_id === projectListId
  isProjectBeingDraggedTheSameAsBeingHovered = projectBeingDraggedIsFromTheSameList && hoveredProjectId === projectBeingDragged.id
  const cardsContainerIsEmpty = elementBeingHoveredIsCardsContainer && !event.target.firstElementChild

  if (elementBeingHoveredIsCard && !projectBeingDraggedIsFromTheSameList) {
    const clonedCard = event.target.cloneNode();

    if (clonedCard && !oneCardIsBeingHovered.value) {
      clonedCard.style.backgroundColor = "black";
      clonedCard.innerHTML = "";
      clonedCard.style.border = "dotted white 3px";
      clonedCard.classList.add('project-slot')
      const parentElement = event.target.parentNode;
      parentElement.insertBefore(clonedCard, event.target);
      oneCardIsBeingHovered.value = true;
    }
  } else if (cardsContainerIsEmpty) {

    event.target.style.border = "dotted white 3px";


  } else if (isProjectBeingDraggedTheSameAsBeingHovered){

    event.target.remove();
  }
};

const handleDrop = async (event) => {
  event.preventDefault();

  oneCardIsBeingHovered.value = false;
  const draggedCardId = event.dataTransfer.getData("text/plain");

  if (event.target.classList.contains("card-container")) event.target.remove();

  event.target.style.border = "none";
  await moveCard(draggedCardId, projectListId);
  await boardStore.loadBoard();
};

const moveCard = async (cardId, targetProjectListId) => {
  await api.patch(`/projects/${cardId}`, {
    project_list_id: targetProjectListId,
  });
};

function handleDragLeave(event){
  event.preventDefault();
  event.target.style.border = "none";
}
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
  width: 450px;
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
  position: relative;
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
.delete-project-list-icon {
  position: absolute;
  top: 1rem;
  left: 1rem;
}
.delete-project-list-icon:hover {
  cursor: pointer;
}
.delete-confirmation-buttons {
  display: flex;
  width: 10rem;
  justify-content: space-evenly;
}
.delete-warning {
  margin-bottom: 1rem;
}
.delete-confirmation-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
