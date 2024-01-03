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
              <NullAvatar class="avatar-navbar-image" v-else :title="authStore.getUser.name" />
              <q-menu class="dropdown-menu">
                <div class="column items-center dropdown-menu-content">
                  <div class="text-subtitle1 q-mt-md q-mb-xs">
                    {{ authStore.getUser.name }}
                  </div>
                  <q-avatar size="50px" class="avatar-dropdown">
                    <img
                      v-if="authStore.getUser.avatar"
                      :src="authStore.getUser.avatar"
                    />
                    <NullAvatar class="avatar-navbar-image avatar-dropdownmenu" v-else :title="authStore.getUser.name" />
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
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "./../stores/auth";
import NullAvatar from "components/NullAvatar.vue";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  localStorage.clear();
  authStore.setToken("");
  router.push("/");
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
}
.avatar-navbar-image {
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  font-size:1.5rem;
}

.avatar-dropdownmenu{
  background-color: black;
  color: white;
}
</style>
