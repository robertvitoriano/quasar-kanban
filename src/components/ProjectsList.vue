<template>
  <div class="column-wrapper">
    <q-icon
      name="delete"
      color="red"
      size="1.5rem"
      @click="toggleDeleteProjectListModal()"
      class="delete-project-list-icon"
    />
    <span class="list-title">{{ props.title }}</span>
    <div class="column-container">
      <Draggable
        v-model="draggableProjects"
        group="projects"
        class="cards-container"
        @start="handleProjectDragStart"
        @end="handleProjectDragEnd"
        :itemKey="(project) => project.id"
      >
        <template #item="{ element }">
          <ProjectCard :project="element" :key="element.id" :reloadList="reloadListRef"></ProjectCard>
        </template>
      </Draggable>
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
import { ref  } from "vue";
import ProjectCard from "src/components/ProjectCard.vue";
import AddButton from "src/components/AddButton.vue";
import { api } from "boot/axios";
import { useBoardStore } from "src/stores/board";
import Draggable from "vuedraggable";
const props = defineProps(["projects", "title", "id"]);

const boardStore = useBoardStore();
const isProjectCreationModalOpen = ref(null);
const newProjectTitle = ref(null);
const isProjectListDeleteConfirmationModalOpen = ref(false);
let draggableProjects = ref(props.projects);
const reloadListRef = ref(async () => await reloadList())

async function reloadList() {
  draggableProjects = ref(props.projects)
}

async function createNewProject(id) {
  await api.post("/projects", {
    title: newProjectTitle.value,
    project_list_id: id,
  });
  await boardStore.loadBoard();
  await reloadList();
  toggleProjectCreationModal();
}

function toggleProjectCreationModal() {
  isProjectCreationModalOpen.value = !isProjectCreationModalOpen.value;
}
function toggleDeleteProjectListModal() {
  isProjectListDeleteConfirmationModalOpen.value =
    !isProjectListDeleteConfirmationModalOpen.value;
}

async function deleteProjectList() {
  await api.delete(`/project-lists/${props.id}`);
  await boardStore.loadBoard();
  await reloadList();
}

const moveCard = async (cardId, targetProjectListId, order) => {
  await api.patch(`/projects/${cardId}`, {
    project_list_id: targetProjectListId,
    order: order,
  });
  await reloadList();
};

const handleProjectDragStart = async (event) => {};
const handleProjectDragEnd = async (event) => {
  console.log({ event });
  await moveCard(
    event.item.__draggable_context.element.id,
    props.id,
    event.item.newIndex
  );
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
[data-draggable="true"] {
  /* Styles for draggable elements */
  width: fit-content;
  cursor: grab;
}
</style>
