<template>
  <q-page class="wrapper">
    <div class="boards-container">
      <q-card class="board-card" v-for="board in boards" :key="board.id">
        <q-card-section class="board-card-container" @click="navigateToBoard">
          <div class="board-card-content">
            <h2 class="board-title">{{ board.title }}</h2>
            <p class="board-description">some crasd aspdasm pmapedfm eféimirf asdpls,a pld asld,sa</p>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

import { api } from "boot/axios";

onMounted(async () => {
  await loadBoards();
});
const router = useRouter();

let boards = reactive([]);

async function loadBoards() {
  const boardsResponse = await api.get(`/boards`);
  boards = boardsResponse.data.data;
}
function navigateToBoard() {
  router.push("/home");
}
</script>
<style scoped>
.wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.boards-container {
  display: flex;
  justify-content: center;
}

.board-card {
  background-color: rgb(49, 47, 47);
  border: solid 2px black;
  border-radius: 1rem;
  height: 500px;
  width: 500px;
}

.board-card:hover {
  color: white;
  border-color: white;
  cursor: pointer;
}
.board-title{
  text-align: center;
  color: rgb(150, 150, 150);
  font-weight: bold;
}
.board-description {
  color: rgb(167, 157, 157);
}
</style>
