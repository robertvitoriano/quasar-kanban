<template>
  <q-page class="wrapper">
    <div :class="{'boards-container':true, 'max-width':boardStore.getprojectLists.length < 4}">
      <q-spinner v-if="$q.loading.isActive" :size="100" color="primary" />

      <q-card class="board-card" v-else v-for="board in boards" :key="board.id">
        <q-card-section
          class="board-card-container"
          @click="navigateToBoard(board.id)"
        >
          <div class="board-card-content">
            <h2 class="board-title">{{ board.title }}</h2>
            <div class="board-cover-container">
              <img class="board-cover" :src="board.cover" />
              <p class="board-description">
                {{ board.description }}
              </p>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <AddButton class="add-button" @click="toggleBoardCreationModal" />
  </q-page>
  <q-dialog v-model="isBoardCreationModalOpen">
    <q-card class="board-creation-modal">
      <q-card-section class="board-creation-modal-container">
        <div class="board-creation-modal-content">
          <q-form @submit="createBoard" color="dark">
            <q-input
              filled
              v-model="newBoardTitle"
              label="Title of the new board"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Enter the title of the board',
              ]"
              color="dark"
            />
            <q-input
              filled
              v-model="newBoardDescription"
              label="Description of the new board"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Enter the description of the board',
              ]"
              color="dark"
            />
            <q-input
              filled
              v-model="newBoardCover"
              label="paste the image url"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Enter the board cover',
              ]"
              color="dark"
            />
            <div class="form-modal-buttons">
              <q-btn label="Create Board" type="submit" color="dark" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AddButton from "components/AddButton.vue";
import { api } from "boot/axios";
import { useBoardStore } from "./../stores/board";
import { useQuasar } from "quasar";

onMounted(async () => {
  $q.loading.show({
    delay: 400,
  });
  await loadBoards();
  $q.loading.hide();
});
const router = useRouter();
const boardStore = useBoardStore();
const $q = useQuasar();

let boards = reactive([]);
const newBoardTitle = ref("");
const newBoardCover = ref("");
const newBoardDescription = ref("");
const isBoardCreationModalOpen = ref(false);

async function loadBoards() {
  const boardsResponse = await api.get(`/boards`);
  boards = boardsResponse.data.data;
}

function navigateToBoard(selectedBoardId) {
  boardStore.setBoardId(selectedBoardId);
  router.push("/home");
}

async function createBoard() {
  await api.post("/boards", {
    title: newBoardTitle.value,
    cover: newBoardCover.value,
    description: newBoardDescription.value,
  });

  newBoardTitle.value = "";
  newBoardCover.value = "";
  newBoardDescription.value = "";

  await boardStore.loadBoard();

  toggleBoardCreationModal();
  await loadBoards();

}

async function toggleBoardCreationModal() {
  isBoardCreationModalOpen.value = !isBoardCreationModalOpen.value;
}
</script>
<style scoped>
.wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.boards-container {
  display: flex;
  justify-content: space-evenly;
  position: relative;
  width: 100%;
}

.board-card {
  background-color: rgb(49, 47, 47);
  border: solid 2px black;
  border-radius: 1rem;
  height: 500px;
  width: 500px;
}
.board-cover-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.board-card:hover {
  color: white;
  border-color: white;
  cursor: pointer;
}
.board-title {
  text-align: center;
  color: rgb(150, 150, 150);
  font-weight: bold;
}
.board-description {
  color: rgb(167, 157, 157);
}
.board-cover {
  width: 400px;
  height: 300px;
}
.board-cover-container {
  position: relative;
}
.add-button {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
}
.max-width {
  width: 96vw ;
}
@media screen and (max-width: 1330px) {
  .boards-container{
    flex-direction: column;
    align-items: center;
    justify-content: initial;
    margin-top: 1rem;

  }
  .wrapper{
    overflow-y: auto;

  }
  .board-card {
    margin-bottom: 1rem ;
  }
}
</style>
