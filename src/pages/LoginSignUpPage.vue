<template>
  <div class="login-page-wrapper">
  <div class="q-pa-md login-page-content">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
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
      :rules="[ val => val && val === password.value || `passwords don't match`]"
      v-if="!isLogin"
    />
      <div class="form-buttons">
        <q-btn label="Submit" type="submit" color="primary" />
        <span @click="switchForms()" v-if="isLogin" class="sign-up-link">Not member yet ? sign up and create projects</span>
        <span @click="switchForms()" v-if="!isLogin" class="login-link">Return to login</span>
      </div>
    </q-form>
  </div>
</div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref } from "vue";

const $q = useQuasar();

const name = ref(null);
const password = ref(null);
const passwordConfirmation = ref(null);
const email = ref(null);
const isLogin = ref(true);

function onSubmit() {
    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Submitted",
    });
}

function switchForms() {
  isLogin.value = !isLogin.value

  name.value = null;
  password.value = null;
  passwordConfirmation.value = null;
  email.value = null;
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
.login-page-wrapper{
  background-color: black;
}
</style>
