<template>
  <div class="login-page-wrapper">
    <h1 class="project-title">Quasar Projects</h1>
    <div class="q-pa-md login-page-content">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md login-form">
        <q-input filled type="name" v-model="name" label="Your name *" hint="Name and surname" v-if="!isLogin" />
        <q-input filled type="email" v-model="email" label="Your email *" hint="Email" />
        <q-input filled type="password" v-model="password" label="Your password" hint="Password *" />
        <q-input filled type="password" v-model="passwordConfirmation" label="Password confirmation"
          hint="Password confirmation *" :rules="[
            (val) => (val && val === password) || `passwords don't match`,
          ]" v-if="!isLogin" />
        <q-file outlined v-model="avatar" v-if="!isLogin">
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
        <div class="form-buttons">
          <q-btn label="Submit" type="submit" color="dark" />
          <span @click="switchForms()" v-if="isLogin" class="sign-up-link">Not member yet ? sign up and create
            projects</span>
          <span @click="switchForms()" v-if="!isLogin" class="login-link">Return to login</span>
        </div>
      </q-form>
    </div>
    <div class="google-login-button" @click="loginWithGoogle">
      <img src="./../assets/Logo-google-icon.png" class="google-icon" />
      <span class="google-login-button-text">Continue with google</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useAuthStore } from "./../stores/auth";
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const name = ref(null);
const password = ref(null);
const passwordConfirmation = ref(null);
const email = ref(null);
const avatar = ref(null);
const isLogin = ref(true);
const authStore = useAuthStore();
const router = useRouter();
onMounted(() => {
  GoogleAuth.initialize({
    clientId: '68191313756-8ftmsn9icsvkm6t5vota2s30b5j7q8c0.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
})
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
    authStore.setUser(response.data.user)
    router.push("/boards-selection");
  } catch (error) {
    console.error("Login failed:", error);
  }
}

async function handleSignUp() {
  const formData = new FormData();
  formData.append("email", email.value);
  formData.append("password", password.value);
  formData.append("password_confirmation", passwordConfirmation.value);
  formData.append("name", name.value);
  formData.append("avatar", avatar.value);
  try {
    const response = await api.post("/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log({ response });
  } catch (error) {
    console.error("Signup failed:", error);
  }
}
async function loginWithGoogle() {

  const response = await GoogleAuth.signIn();
  const accessToken = response.authentication.accessToken;
  try {
    const loginResponse = await api.post('/auth/google', {
      token: accessToken
    })
    authStore.setToken("Bearer " + loginResponse.data.access_token);
    authStore.setUser(response.data.user)

    router.push("/boards-selection");
  } catch (error) {

    console.error(error);
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

.google-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.google-login-button {
  padding: 1rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: fit-content;
  height: fit-content;
  border-radius: 2rem;
  cursor: pointer;
}

.google-login-button-text {
  font-size: 1.2rem;
  color: black;
}

@media screen and (max-width: 830px) {
  .login-form {
    width: 80vw;
  }

  .project-title {
    font-size: 2rem;
  }
}
</style>
