<template>
  <div class="card-container"  @click="openProjectModal(project)">
    <span class="project-title">{{project.title}}</span>
    <q-dialog v-model="isProjectModalOpen">
      <q-card class="project-modal">
        <q-card-section class="project-modal-container">
          <div class="project-modal-content">
            <div class="col text-h6 ellipsis">{{openProject.title}}</div>
            <div class="tasks-container">
              <ul>
                <li v-for="task in project.tasks" :key="task.id" class="task-item">
                  <span>{{task.title}}</span>
                </li>
              </ul>
            </div>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';

const isProjectModalOpen = ref(false);
const openProject = reactive({
  title:''
})

defineProps({
  project:{
    title:String,
    tasks:[{
      title:String,
      isDone:Boolean,
      id:Number,
    }]
  }
})
function openProjectModal(project){
   openProject.title = project.title
   isProjectModalOpen.value = true
}
</script>
<style scoped>
.card-container {
background-color: rgb(190, 190, 190);
margin-bottom: 1rem;
width: 400px;
height: 400px;
}
.card-container:hover {
  cursor: pointer;
}
.project-title {
  display: inline-block;
  width: 100%;
  text-align: center ;
  font-weight: bold;
  text-decoration: underline;
  font-size: 2rem;
}
.project-modal-content{
  width: 400px;
}

@media (min-width: 600px) {
  .project-modal-content{
      width: 510px;
  }

.task-item {
  text-decoration: none;
}
}
</style>
