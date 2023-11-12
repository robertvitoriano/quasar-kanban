<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated >
      <q-bar class="bar">
        <div class="bar-content">
          <span>Quasar Projects</span>
          <div class="q-pa-md q-gutter-sm">
            <q-avatar  size="32px" class="avatar">
              <img src="https://cdn.quasar.dev/img/avatar.png">
            </q-avatar>
          </div>
        </div>
      </q-bar>
    </q-header>
    <q-page-container class="page-container" >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>

</script>

<style scoped>
.page-container{
  padding-right:3rem;
  padding-left:3rem;
  background-color: rgb(64, 64, 64);
}
.bar{
  background-color: black;
  height: 3rem ;
  display:flex;
  justify-content: flex-end;
  padding: 0;

}
.bar-content{
  width: calc(50% + 4rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  height: inherit;
}
.avatar{
  border-radius: 50%;
}
.avatar :hover {
  cursor: pointer;
}
</style>
