<template>
  <div>
    <h1>
      Halo, {{ keycloak?.tokenParsed?.preferred_username }} -
      {{ keycloak?.tokenParsed?.given_name }} -
      {{ keycloak?.tokenParsed?.email }}
    </h1>

    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { keycloak } from "./keycloak";

const logout = () => {
  keycloak.logout({
    redirectUri: window.location.origin,
  });
};
</script>
