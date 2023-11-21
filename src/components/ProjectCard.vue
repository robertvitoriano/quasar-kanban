<template>
  <div class="card-container"  @click="openProjectModal(project)">
    <span class="project-title">{{project.title}}</span>
  </div>
  <q-dialog v-model="isProjectModalOpen">
    <q-card class="project-modal">
      <q-card-section class="project-modal-container">
        <div class="project-modal-content">
          <div class="col text-h6 ellipsis">{{project.title}}</div>
          <div class="tasks-container">
            <q-item tag="label" v-for="task in project.tasks" :key="task.id" class="task-item" v-ripple>
              <q-item-section side top>
                <q-checkbox v-model="task.done" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{task.title}}</q-item-label>
                <q-item-label caption>
                  Minha descrição que ainda não existe
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue';

const isProjectModalOpen = ref(false);


defineProps({
  project:{
    title:String,
    tasks:[{
      title:String,
      done:Boolean,
      id:Number,
    }]
  }
})
function openProjectModal() {
  isProjectModalOpen.value = true;
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
