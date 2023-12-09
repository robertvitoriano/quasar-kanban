<template>
  <div class="card-container" @click="openProjectModal(project)">
    <span class="project-title">{{ project.title }}</span>
  </div>
  <q-dialog v-model="isProjectModalOpen">
    <q-card class="project-modal">
      <q-card-section class="project-modal-container">
        <div class="project-modal-content">
          <div class="col text-h6 ellipsis">{{ project.title }}</div>
          <div class="tasks-label">
            <strong class="no-tasks-warn" v-if="project.tasks.length == 0">
              Project without tasks, add a task bellow:</strong
            >
            <strong class="tasks" v-else> Tasks:</strong>
          </div>
          <div class="tasks-container">
            <q-item
              tag="label"
              v-for="task in project.tasks"
              :key="task.id"
              class="task-item"
              v-ripple
            >
              <q-item-section side top>
                <q-checkbox v-model="task.done" color="dark" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
                <q-item-label caption>
                  {{ task.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <AddButton @click="toggleCreateNewTaskModal" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isTaskCreationModalOpen">
    <q-card class="task-creation-modal">
      <q-card-section class="task-creation-modal-container">
        <div class="task-creation-modal-content">
          <q-form  color="dark">
            <q-input
              filled
              v-model="newTaskTitle"
              label="Title of the new task"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Enter the title of the task',
              ]"
              color="dark"
            />
            <q-input
              filled
              v-model="newTaskDescription"
              label="Description of the new task"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Enter the Description of the task',
              ]"
              color="dark"
              type=""
            />
            <div class="form-modal-buttons">
              <q-btn label="Create Task"  @click="createNewTask" color="dark" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import AddButton from "components/AddButton.vue";
import { api } from "boot/axios";

const isProjectModalOpen = ref(false);
const isTaskCreationModalOpen = ref(false);
const newTaskTitle = ref("");
const newTaskDescription = ref("");

const { project, reloadBoard } = defineProps({
  project: {
    title: String,
    tasks: [
      {
        title: String,
        description: String,
        done: Boolean,
        id: Number,
      },
    ],
  },
  reloadBoard: Function,
});
function openProjectModal() {
  isProjectModalOpen.value = true;
}
async function createNewTask() {
  await api.post("/tasks", {
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    project_id: project.id,
  });
  toggleCreateNewTaskModal();
  reloadBoard();
  newTaskTitle.value = '';
  newTaskDescription.value = '';
}

function toggleCreateNewTaskModal() {
  isTaskCreationModalOpen.value = !isTaskCreationModalOpen.value;
}
</script>
<style scoped>
.card-container {
  background-color: rgb(190, 190, 190);
  margin-bottom: 1rem;
  width: 400px;
  height: 40vh;
}
.card-container:hover {
  cursor: pointer;
}
.project-title {
  display: inline-block;
  width: 100%;
  text-align: center;
  font-weight: bold;
  text-decoration: underline;
  font-size: 2rem;
}
.project-modal-content {
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.tasks-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.no-tasks-warn {
  margin-bottom: 1rem;
}
.tasks-label {
  width: 100%;
  text-align: left;
}
@media (min-width: 600px) {
  .project-modal-content {
    width: 510px;
  }

  .task-item {
    text-decoration: none;
    background-color: rgb(224, 224, 224);
    border-radius: 3px;
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
