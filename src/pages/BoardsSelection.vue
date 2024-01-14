<template>
  <q-page class="wrapper">
      <q-spinner v-if="$q.loading.isActive" :size="100" color="primary" />
      <div   :class="{
        'boards-container': true,
        'max-width': boardStore.getprojectLists.length < 4,
      }" v-if="boards.length >= 1">
        <q-card class="board-card" v-for="board in boards" :key="board.id">
          <q-card-section
            class="board-card-container"
          >
           <div class="board-card-header">
              <p @click="navigateToBoard(board.id)" class="enter-board-button">Enter Board</p>
              <div class="more-options-button" v-if="authStore.getUser.level === 'admin'" >
                <span class="more-options-icon">...</span>
                <q-menu fit class="dropdown-menu" dark>
                  <q-list style="min-width: 100px">
                    <q-item clickable>
                      <q-item-section @click="openMembersAditionModal(board.id)">Add new users</q-item-section>
                    </q-item>
                    <q-item clickable class="delete-board-button" @click="openBoardToBeDeletedConfirmationModal(board.id)">
                      <q-item-section >Delete board</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
            </div>
           </div>
            <div class="board-card-content">
              <h2 class="board-title">{{ displaySmallerWord(board.title) }}</h2>
              <div class="board-cover-container">
                <img class="board-cover" :src="board.cover" />
              <p class="board-description">
                {{ displaySmallerWord(board.description) }}
              </p>
            </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="not-member-of-board-container" v-else-if="boards.length === 0 && authStore.getUser.level === 'user' " >
        <span class="not-member-of-board-warning">You are not a Member of any board, ask access to an administrator</span>
      </div>
    <AddButton
      class="add-button"
      @click="toggleBoardCreationModal"
      v-if="authStore.getUser.level === 'admin'"
    />
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
  <q-dialog v-model="isBoardDeleteConfirmationModalOpen">
    <q-card class="user-adition-confirmation-modal">
      <q-card-section class="user-adition-confirmation-modal-container">
        <div class="user-adition-confirmation-modal-content">
          <span class="confirmation-warning">
            Are you sure you want to delete this board ?
          </span>
          <div class="delete-confirmation-buttons">
            <q-btn label="No" @click="toggleBoardDeletionConfirmationModal" color="red" />
            <q-btn label="Yes" @click="deleteBoard()" color="green" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isMembersAditionModalOpen">
    <q-card class="members-adition-modal">
      <q-card-section class="delete-modal-container">
        <div class="members-adition-modal-content">
          <q-list style="min-width: 200px">
            <q-item class="user-list-item-container" clickable v-for="user in nonMembers" :key="user.id" @click="selectNewMembersToBeAdded(user.id)">
              {{displaySmallerWord(user.name)}}
                <img
                class="avatar"
                v-if="user.avatar"
                :src="user.avatar"/>
              <NullAvatar
                :color="'black'"
                class="avatar"
                v-else
                :title="user.name"
              />
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="isUserAditionConfirmationModalOpen">
    <q-card class="user-adition-confirmation-modal">
      <q-card-section class="delete-confirmation-modal-container">
        <div class="delete-confirmation-modal-content">
          <span class="confirmation-warning">
            Are you sure you want to add those users to the board ?
          </span>
          <div class="delete-confirmation-buttons">
            <q-btn label="No" @click="toggleBoardDeletionConfirmationModal" color="red" />
            <q-btn label="Yes" @click="addNewMembersToBoard" color="green" />
          </div>
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
import { useAuthStore } from "src/stores/auth";
import NullAvatar from "src/components/NullAvatar.vue";

onMounted(async () => {
  $q.loading.show({
    delay: 400,
  });
  await loadBoards();
  $q.loading.hide();
});
const router = useRouter();
const boardStore = useBoardStore();
const authStore = useAuthStore();
const $q = useQuasar();

let boards = ref([]);
const newBoardTitle = ref("");
const newBoardCover = ref("");
const newBoardDescription = ref("");
const isBoardCreationModalOpen = ref(false);
const isBoardDeleteConfirmationModalOpen = ref(false);
const nonMembers = ref([])
const isMembersAditionModalOpen = ref(false)
const boardIdToAddNewUsers = ref()
const newUserIdsToBeAdded = ref([])
const isUserAditionConfirmationModalOpen = ref(false);
const boardToBeDeletedId = ref('');

async function loadBoards() {
  const boardsResponse = await api.get(`/boards`);
  boards.value = boardsResponse.data.data;
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

  toggleBoardCreationModal();
  await loadBoards();
}

async function toggleBoardCreationModal() {
  isBoardCreationModalOpen.value = !isBoardCreationModalOpen.value;
}
function toggleBoardDeletionConfirmationModal(){
  isBoardDeleteConfirmationModalOpen.value =  !isBoardDeleteConfirmationModalOpen.value;
}
function openBoardToBeDeletedConfirmationModal(boardId){
  boardToBeDeletedId.value = boardId
  toggleBoardDeletionConfirmationModal();
}
async function deleteBoard(){
  await api.delete(`/boards/${boardToBeDeletedId.value}`);
  await loadBoards();
  toggleBoardDeletionConfirmationModal();
}
function toggleMembersAditionModalOpen(){
  isMembersAditionModalOpen.value =  !isMembersAditionModalOpen.value;
}
async function openMembersAditionModal(boardId){
 const response = await api.get(`/boards/non-members/${boardId}`)
 nonMembers.value = response.data.users
 boardIdToAddNewUsers.value = boardId;
 toggleMembersAditionModalOpen();
}

async function selectNewMembersToBeAdded(userId){
  newUserIdsToBeAdded.value = [userId];
  toggleMembersAditionModalOpen();
  toggleAditionConfirmationModal()
}
async function addNewMembersToBoard(){
  await api.post(`/boards/add-users-to-board`,{user_ids: newUserIdsToBeAdded.value, board_id: boardIdToAddNewUsers.value});
  toggleAditionConfirmationModal();
}

function toggleAditionConfirmationModal(){
  isUserAditionConfirmationModalOpen.value = !isUserAditionConfirmationModalOpen.value;
}
function displaySmallerWord(word){

  if(word.length > 19){
    return word.slice(0,16) +'...'
  }
  return word;

}

</script>
<style scoped>
.wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100vw;
}

.boards-container {
  display: flex;
  justify-content: space-evenly;
  position: relative;
  width: 100%;
  flex-direction: row;
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

.board-title {
  text-align: center;
  color: rgb(150, 150, 150);
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.board-description {
  color: rgb(167, 157, 157);
}
.board-cover {
  width: 400px;
  height: 300px;
  margin-bottom: 1rem;

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
  width: 96vw;
}
.more-options-button{
  border: none;
  height:fit-content;
  width: fit-content;
  position: absolute;
  right: 0.5rem;
  top: -.5rem;
}
.more-options-button .q-focus-helper {
  display: none;
}
.more-options-icon{
  font-weight: bold;
  color: black;
  font-size: 2rem;
}

.more-options-icon:hover{
  color: white;
  cursor: pointer;

}
.board-card-container{
  position: relative;
}

.not-member-of-board-warning{
  color: white;
  font-size: 1rem;
}
.not-member-of-board-container{
  background-color: black;
  border: solid 2px white;
  padding: 2rem;
  border-radius: 1rem;
}
.enter-board-button{
  margin-bottom: 1rem;
  font-size: 2.5rem;
  text-decoration: underline;
}
.enter-board-button:hover{
  cursor: pointer;
  color: white;
}
.board-card-header{
  width: 100%;
  display: flex;
  justify-content: center;
}

.delete-board-button:hover {
  background-color: red;
  color: white;
  font-weight: bold;
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
.avatar {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  background-color: black;
  color: white;
}
.user-list-item{
  width: fit-content;
  height: fit-content;
}
.user-list-item-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media screen and (max-width: 830px) {
  .boards-container {
    flex-direction: column;
    align-items: center;
    justify-content: initial;
    margin-top: 1rem;
  }
  .wrapper {
    overflow-y: auto;
  }
  .board-card {
    margin-bottom: 1rem;
    height: 360px;
    width: 360px;
  }
  .board-cover {
    width: 250px;
    height: 180px;
  }
  .board-title {
    font-size: medium;
  }
}
</style>
