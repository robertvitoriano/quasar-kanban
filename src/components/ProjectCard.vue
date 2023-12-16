<template>
  <div
    class="card-container"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    :id="project.id"
  >
    <q-icon
      name="delete"
      color="red"
      size="1.5rem"
      @click="toggleDeleteProjectModal"
      class="delete-icon delete-project-icon"
    />
    <span class="project-title" @click="openProjectModal(project)">{{
      project.title
    }}</span>
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
                <q-checkbox
                  v-model="task.done"
                  color="dark"
                  @click="updateTaskDoneState(task)"
                  class="task-item-checkbox"
                />
              </q-item-section>
              <div class="task-item-content">
                <q-item-section>
                  <q-item-label>{{ task.title }}</q-item-label>
                  <q-item-label caption>
                    {{ task.description }}
                  </q-item-label>
                </q-item-section>
              </div>
              <div class="task-item-buttons">
                <q-item-section>
                  <q-icon
                    name="delete"
                    color="red"
                    size="1.5rem"
                    @click="handleDeleteTaskButtonClick(task.id)"
                    class="delete-icon"
                  />
                </q-item-section>
                <q-item-section>
                  <q-icon
                    name="edit"
                    color="dark"
                    size="1.5rem"
                    @click="handleUpdateTaskButtonClick(task)"
                  />
                </q-item-section>
              </div>
            </q-item>
          </div>
          <AddButton @click="handleAddTaskButtonClick" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isTaskCreateUpdateModalOpen">
    <q-card class="task-create-update-modal">
      <q-card-section class="task-create-update-modal-container">
        <div class="task-create-update-modal-content">
          <q-form color="dark" v-if="isCreatingTask">
            <q-input
              filled
              v-model="taskInputTitle"
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
              v-model="taskInputDescription"
              label="Description of the task"
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
              <q-btn label="Create Task" @click="createNewTask" color="dark" />
            </div>
          </q-form>
          <q-form color="dark" v-if="isUpdatingTask">
            <q-input
              filled
              v-model="taskBeingEdited.title"
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
              v-model="taskBeingEdited.description"
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
            <div class="form-modal-buttons" v-if="isCreatingTask">
              <q-btn label="Create Task" @click="createNewTask" color="dark" />
            </div>
            <div class="form-modal-buttons" v-else-if="isUpdatingTask">
              <q-btn label="Update Task" @click="updateTask" color="dark" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isTaskDeleteConfirmationModalOpen">
    <q-card class="task-delete-confirmation-modal">
      <q-card-section class="delete-confirmation-modal-container">
        <div class="delete-confirmation-modal-content">
          <span class="delete-warning">
            Are you sure you want to delete this task ?
          </span>
          <div class="delete-confirmation-buttons">
            <q-btn label="No" @click="toggleDeleteTaskModal" color="red" />
            <q-btn label="Yes" @click="deleteTask()" color="green" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isProjectDeleteConfirmationModalOpen">
    <q-card class="project-delete-confirmation-modal">
      <q-card-section class="delete-confirmation-modal-container">
        <div class="delete-confirmation-modal-content">
          <span class="delete-warning">
            Are you sure you want to delete this project ?
          </span>
          <div class="delete-confirmation-buttons">
            <q-btn label="No" @click="toggleDeleteProjectModal" color="red" />
            <q-btn label="Yes" @click="deleteProject()" color="green" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, reactive } from "vue";
import AddButton from "components/AddButton.vue";
import { api } from "boot/axios";

const isProjectModalOpen = ref(false);
const isTaskCreateUpdateModalOpen = ref(false);
const taskInputTitle = ref("");
const taskInputDescription = ref("");
const isCreatingTask = ref(false);
const isUpdatingTask = ref(false);
const isTaskDeleteConfirmationModalOpen = ref(false);
const taskToDeleteId = ref(null);
const isProjectDeleteConfirmationModalOpen = ref(null);

let taskBeingEdited = reactive({
  id: null,
  title: "",
  description: "",
});

const { project, reloadBoard, setProjectBeingDragged } = defineProps({
  project: {
    title: String,
    id: Number,
    order: Number,
    project_list_id:Number,
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
  setProjectBeingDragged:Function,

});
function openProjectModal() {
  isProjectModalOpen.value = true;
}
async function createNewTask() {
  await api.post("/tasks", {
    title: taskInputTitle.value,
    description: taskInputDescription.value,
    project_id: project.id,
  });
  toggleCreateUpdateTaskModal();
  reloadBoard();
  taskInputTitle.value = "";
  taskInputDescription.value = "";
  isCreatingTask.value = false;
}
async function updateTask() {
  await api.patch(`/tasks/${taskBeingEdited.id}`, {
    title: taskBeingEdited.title,
    description: taskBeingEdited.description,
  });

  toggleCreateUpdateTaskModal();
  reloadBoard();
  taskBeingEdited = { title: "", description: "", id: null };
  isUpdatingTask.value = false;
}
async function updateTaskDoneState(task) {
  await api.patch(`/tasks/${task.id}`, {
    is_done: task.done,
  });
  reloadBoard();
}

async function deleteTask() {
  await api.delete(`/tasks/${taskToDeleteId.value}`);
  toggleDeleteTaskModal();
  reloadBoard();
}
async function deleteProject() {
  await api.delete(`/projects/${project.id}`);
  toggleDeleteProjectModal();
  reloadBoard();
}
const handleDragStart = (event) => {
  event.dataTransfer.setData("text/plain", project.id);
  setProjectBeingDragged(project)
};

const handleDragEnd = () => {
  // TODO: IMPLEMENT DRAG END IF NEEDED
};
function toggleCreateUpdateTaskModal() {
  isTaskCreateUpdateModalOpen.value = !isTaskCreateUpdateModalOpen.value;
}

function toggleDeleteTaskModal() {
  isTaskDeleteConfirmationModalOpen.value =
    !isTaskDeleteConfirmationModalOpen.value;
}
function toggleDeleteProjectModal() {
  isProjectDeleteConfirmationModalOpen.value =
    !isProjectDeleteConfirmationModalOpen.value;
}
function handleDeleteTaskButtonClick(taskId) {
  taskToDeleteId.value = taskId;
  toggleDeleteTaskModal();
}

function handleAddTaskButtonClick() {
  toggleCreateUpdateTaskModal();
  isCreatingTask.value = true;
}

function handleUpdateTaskButtonClick(taskToEdit) {
  console.log(taskToEdit);
  taskBeingEdited = taskToEdit;
  isUpdatingTask.value = true;
  toggleCreateUpdateTaskModal();
}
</script>
<style scoped>
.card-container {
  background-color: rgb(190, 190, 190);
  margin-bottom: 1rem;
  width: 400px;
  height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.project-title {
  display: inline-block;
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  width: fit-content;
  height: fit-content;
}
.project-title:hover {
  text-decoration: underline;
  cursor: pointer;
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
.task-item-content {
  width: 80%;
}
.no-tasks-warn {
  margin-bottom: 1rem;
}
.tasks-label {
  width: 100%;
  text-align: left;
}
.task-item-checkbox {
  width: fit-content;
}

.delete-warning {
  margin-bottom: 1rem;
}
.delete-confirmation-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.delete-confirmation-buttons {
  display: flex;
  width: 10rem;
  justify-content: space-evenly;
}
.delete-icon{
  width: fit-content;
  height: fit-content;
}
.delete-project-icon{
  position: absolute;
  top: 1rem;
  left: 1rem;
}
.delete-icon:hover{
  cursor: pointer;
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
