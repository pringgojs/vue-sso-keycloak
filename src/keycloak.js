import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://login.ponorogo.go.id",
  realm: "simashebat",
  clientId: "vue-sso-app",
});

/**
 * Inisialisasi Keycloak
 * - Menyimpan token & refreshToken di localStorage
 * - Mengambil token dari localStorage saat reload
 */
const initKeycloak = () =>
  new Promise((resolve, reject) => {
    const storedToken = localStorage.getItem("kc_token");
    const storedRefreshToken = localStorage.getItem("kc_refresh_token");

    keycloak
      .init({
        onLoad: "login-required", // Bisa diganti 'check-sso' jika ingin silent login
        pkceMethod: "S256",
        flow: "standard",
        token: storedToken,
        refreshToken: storedRefreshToken,
        checkLoginIframe: false, // hindari iframe issue
      })
      .then((authenticated) => {
        if (!authenticated) {
          window.location.reload();
        } else {
          // Simpan token
          localStorage.setItem("kc_token", keycloak.token);
          localStorage.setItem("kc_refresh_token", keycloak.refreshToken);

          // Setup auto refresh
          setupTokenRefresh();
          resolve(keycloak);
        }
      })
      .catch((err) => {
        console.error("Keycloak init failed", err);
        reject(err);
      });
  });

/**
 * Auto-refresh token secara periodik
 */
function setupTokenRefresh() {
  setInterval(() => {
    keycloak
      .updateToken(60) // refresh jika < 60 detik expired
      .then((refreshed) => {
        if (refreshed) {
          console.log("Token refreshed");
          localStorage.setItem("kc_token", keycloak.token);
          localStorage.setItem("kc_refresh_token", keycloak.refreshToken);
        } else {
          console.log("Token masih valid");
        }
      })
      .catch(() => {
        console.error("Token refresh gagal, logout...");
        keycloak.logout({ redirectUri: window.location.origin });
      });
  }, 30000); // check tiap 30 detik
}

export { keycloak, initKeycloak };
