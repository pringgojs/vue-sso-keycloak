import { createApp } from "vue";
import App from "./App.vue";
import { keycloak, initKeycloak } from "./keycloak";

initKeycloak().then(() => {
  const app = createApp(App);

  app.config.globalProperties.$keycloak = keycloak;

  app.mount("#app");
});
