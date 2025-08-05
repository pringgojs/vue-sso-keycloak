<template>
  <div>
    <h1>
      Halo, {{ keycloak?.tokenParsed?.preferred_username }} -
      {{ keycloak?.tokenParsed?.given_name }} -
      {{ keycloak?.tokenParsed?.email }}
    </h1>

    <button v-if="!isAuthenticated" @click="handleLogin">Login</button>
    <button v-else @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { keycloak, login, logout } from "./keycloak";

const isAuthenticated = ref(keycloak.authenticated);

const handleLogin = () => {
  login();
};

const handleLogout = () => {
  logout();
};
</script>
