import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://login.ponorogo.go.id",
  realm: "simashebat",
  clientId: "vue-sso-app", // ganti dengan client ID kamu
});

const initKeycloak = () =>
  new Promise((resolve, reject) => {
    keycloak
      .init({
        onLoad: "login-required", // atau 'check-sso' untuk login silent
        pkceMethod: "S256",
        flow: "standard",
      })
      .then((authenticated) => {
        if (!authenticated) {
          window.location.reload();
        } else {
          resolve(keycloak);
        }
      })
      .catch(reject);
  });

/**
 * Auto-refresh token tiap 60 detik
 */
function setupTokenRefresh() {
  setInterval(() => {
    keycloak
      .updateToken(70)
      .then((refreshed) => {
        if (refreshed) {
          console.log("Token refreshed");
        } else {
          console.log("Token still valid");
        }
      })
      .catch(() => {
        console.error("Token refresh failed — logging out");
        keycloak.logout({ redirectUri: window.location.origin });
      });
  }, 60000); // tiap 60 detik
}
export { keycloak, initKeycloak };
