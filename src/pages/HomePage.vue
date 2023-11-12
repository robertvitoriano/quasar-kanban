<template>
  <q-page class="page-wrapper">
    <div class="projects-list-container">
      <ProjectsList
        v-for="projectList in projectLists"
        :projects="projectList.projects"
        :key="projectList.id"
        :list-title="projectList.listTitle"
      ></ProjectsList>
    </div>
  </q-page>
</template>

<script setup>
import ProjectsList from "src/components/ProjectsList.vue";
import { reactive } from "vue";

const projectLists = reactive([
  {
    id: 0,
    listTitle: "To do",
    projects: [
      {
        id:1,
        title: "primeiro to do",
        tasks: [
          {
            id:1,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:2,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:3,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
      {
        id:2,
        title: "segundo to do",
        tasks: [
          {
            id:4,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:5,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:6,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
      {
        id:3,
        title: "terceiro to do",
        tasks: [
          {
            id:7,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:8,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:9,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
    ],
  },
  {
    id: 1,
    listTitle: "doing",
    projects: [
      {
        id:4,
        title: "primeiro doing",
        tasks: [
          {
            id:10,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:11,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:12,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
      {
        id:5,
        title: "segundo doing",
        tasks: [
          {
            id:13,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:14,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:15,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
      {
        id:6,
        title: "terceiro doing",
        tasks: [
          {
            id:16,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:17,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:18,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    listTitle: "done",
    projects: [
      {
        id:7,
        title: "primeiro done",
        tasks: [
          {
            id:19,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:20,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:21,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
      {
        id:8,
        title: "segundo done",
        tasks: [
          {
            id:22,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:23,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:24,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
      {
        id:9,
        title: "terceiro done",
        tasks: [
          {
            id:25,
            title: "primeira tarefa",
            isDone: false,
          },
          { id:26,
            title: "segunda tarefa",
            isDone: true,
          },
          {
            id:27,
            title: "terceira tarefa",
            isDone: false,
          },
        ],
      },
    ],
  },
]);
</script>
<style scoped>
.projects-list-container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 1rem;
}
</style>
