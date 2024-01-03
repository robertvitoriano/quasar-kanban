<template>
  <div class="login-page-wrapper">
    <h1 class="project-title">Quasar Projects</h1>
    <div class="q-pa-md login-page-content">
      <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md login-form"
      >
        <q-input
          filled
          type="name"
          v-model="name"
          label="Your name *"
          hint="Name and surname"
          v-if="!isLogin"
        />
        <q-input
          filled
          type="email"
          v-model="email"
          label="Your email *"
          hint="Email"
        />
        <q-input
          filled
          type="password"
          v-model="password"
          label="Your password"
          hint="Password *"
        />
        <q-input
          filled
          type="password"
          v-model="passwordConfirmation"
          label="Password confirmation"
          hint="Password confirmation *"
          :rules="[
            (val) => (val && val === password) || `passwords don't match`,
          ]"
          v-if="!isLogin"
        />
        <div class="form-buttons">
          <q-btn label="Submit" type="submit" color="dark" />
          <span @click="switchForms()" v-if="isLogin" class="sign-up-link"
            >Not member yet ? sign up and create projects</span
          >
          <span @click="switchForms()" v-if="!isLogin" class="login-link"
            >Return to login</span
          >
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useAuthStore } from "./../stores/auth";

const name = ref(null);
const password = ref(null);
const passwordConfirmation = ref(null);
const email = ref(null);
const isLogin = ref(true);
const authStore = useAuthStore();
const router = useRouter();

async function onSubmit() {
  if (isLogin.value) {
    await handleLogin();
  } else {
    await handleSignUp();
  }
}

function switchForms() {
  isLogin.value = !isLogin.value;
  name.value = null;
  password.value = null;
  passwordConfirmation.value = null;
  email.value = null;
}

async function handleLogin() {
  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });
    authStore.setToken("Bearer " + response.data.access_token);
    authStore.setUser(response.data.level)
    router.push("/boards-selection");
  } catch (error) {
    console.error("Login failed:", error);
  }
}

async function handleSignUp() {
  try {
    const response = await api.post("/register", {
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
      name: name.value
    });
    console.log({ response });
  } catch (error) {
    console.error("Signup failed:", error);
  }
}
</script>
<style scoped>
.form-buttons {
  display: flex;
  flex-direction: column;
  width: fit-content;
}
.form-buttons:hover {
  cursor: pointer;
  text-decoration: underline;
}
.login-page-wrapper {
  height: 100vh;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login-form {
  background-color: white;
  width: 40vw;
  height: fit-content;
  padding: 2rem;
}
.project-title {
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 4rem;
}
</style>
