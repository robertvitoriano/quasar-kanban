<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-bar class="bar">
        <div class="bar-content">
          <span>Quasar Projects</span>
          <div class="q-pa-md q-gutter-sm">
            <q-btn class="avatar">
              <img
                class="avatar-navbar-image"
                v-if="authStore.getUser.avatar"
                :src="authStore.getUser.avatar"
              />
              <NullAvatar
                class="avatar-navbar-image"
                v-else
                :title="authStore.getUser.name"
              />
              <q-menu class="dropdown-menu">
                <div class="column items-center dropdown-menu-content">
                  <q-icon
                    name="edit"
                    color="dark"
                    size="1rem"
                    class="edit-profile-button"
                    @click="toggleEditUserModal"
                  />
                  <div class="text-subtitle1 q-mt-md q-mb-xs">
                    {{ authStore.getUser.name }}
                  </div>
                  <q-avatar size="50px" class="avatar-dropdown">
                    <img
                      v-if="authStore.getUser.avatar"
                      :src="authStore.getUser.avatar"
                    />
                    <NullAvatar
                      class="avatar-navbar-image avatar-dropdownmenu"
                      v-else
                      :title="authStore.getUser.name"
                    />
                  </q-avatar>
                  <q-btn
                    color="primary"
                    label="Logout"
                    push
                    size="sm"
                    v-close-popup
                    @click="handleLogout"
                  />
                </div>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-bar>
    </q-header>
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>
  <q-dialog v-model="isUserEditModalOpen">
    <q-card class="user-edit-modal">
      <q-card-section class="user-edit-modal-container">
        <div class="user-edit-modal-content">
          <q-form @submit="updateProfile" color="dark" class="edit-user-form">
            <div class="edit-avatar-wrapper">
              <label class="avatar-update-container" role="button" :for="id">
                <input
                  class="avatar-update-input"
                  :id="id"
                  :name="id"
                  type="file"
                  @change="handleAvatarChange($event)"
                  :ref="ref"
                />
                <img
                  class="avatar-navbar-image"
                  v-if="updatedAvatarUrl"
                  :src="updatedAvatarUrl"
                />
                <NullAvatar
                  class="avatar-navbar-image"
                  v-else
                  :title="authStore.getUser.name"
                />
              </label>
            </div>
            <q-input
              filled
              v-model="updatedUserName"
              label="Enter the name you want to update"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Please enter the name you want to update',
              ]"
              color="dark"
            />
            <div class="form-modal-buttons">
              <q-btn label="Update profile" type="submit" color="dark" />
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "./../stores/auth";
import NullAvatar from "components/NullAvatar.vue";
import { api } from "src/boot/axios";

const authStore = useAuthStore();
const router = useRouter();
const isUserEditModalOpen = ref();
const updatedUserName = ref(authStore.getUser.name);
const updatedAvatarUrl = ref("");
const updatedAvatar = ref(null);
function handleLogout() {
  localStorage.clear();
  authStore.setToken("");
  router.push("/");
}

function toggleEditUserModal() {
  isUserEditModalOpen.value = !isUserEditModalOpen.value;
  updatedUserName.value = authStore.getUser.name;
  updatedAvatarUrl.value = authStore.getUser.avatar;
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    const filePath = URL.createObjectURL(file);
    updatedAvatarUrl.value = filePath;
    updatedAvatar.value = file;
    return;
  }
  updatedAvatarUrl.value = null;
}

async function updateProfile(){
  if(updatedAvatar.value){

    const formData = new FormData();
    formData.append('name', updatedUserName.value);
    formData.append('avatar',updatedAvatar.value);

    await api.patch("users/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return;
    }

    await api.patch("users/update-profile", {
      name:updatedUserName.value,
    });
}
</script>

<style scoped>
.page-container {
  padding-right: 3rem;
  padding-left: 3rem;
  background-color: rgb(64, 64, 64);
  padding-top: 2rem !important;
  width: fit-content;
}
.bar {
  background-color: black;
  height: 3rem;
  display: flex;
  justify-content: flex-end;
  padding: 0;
}
.bar-content {
  width: calc(50% + 4rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  height: inherit;
}
.avatar {
  height: fit-content;
  width: fit-content;
  border-radius: 50%;
  padding: 0;
}
.avatar :hover {
  cursor: pointer;
}
.avatar-dropdown {
  margin-bottom: 1rem;
}
.dropdown-menu-content {
  width: 8rem;
  height: 10rem;
  position: relative;
}
.avatar-navbar-image {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
}

.avatar-dropdownmenu {
  background-color: black;
  color: white;
}
.edit-profile-button {
  position: absolute;
  right: 0.5rem;
  top: 0.3rem;
}
.edit-profile-button:hover {
  text-decoration: underline;
  cursor: pointer;
}
.edit-user-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.edit-avatar-wrapper {
  border: black solid 1px;
  border-radius: 50%;
  width: fit-content;
  height: fit-content;
  margin-bottom: 1rem;
}

.avatar-update-container {
  display: block;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.avatar-update-container:hover {
  cursor: pointer;
  opacity: 30%;
  filter: grayscale(0.3);
}
.avatar-update-input {
  opacity: 0;
  position: absolute;
}
.avatar-update-input:hover {
  cursor: pointer;
}
.user-edit-modal{
  overflow: hidden;
}
</style>
