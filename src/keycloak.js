import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://login.ponorogo.go.id",
  realm: "simashebat",
  clientId: "vue-sso-app",
});

const initKeycloak = () =>
  new Promise((resolve, reject) => {
    const storedToken = localStorage.getItem("kc_token");
    const storedRefreshToken = localStorage.getItem("kc_refresh_token");

    keycloak
      .init({
        onLoad: "check-sso", // hanya cek, tidak auto login
        pkceMethod: "S256",
        flow: "standard",
        token: storedToken,
        refreshToken: storedRefreshToken,
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html", // Wajib jika pakai check-sso
      })
      .then((authenticated) => {
        if (authenticated) {
          // Simpan token
          localStorage.setItem("kc_token", keycloak.token);
          localStorage.setItem("kc_refresh_token", keycloak.refreshToken);
          setupTokenRefresh();
        }
        resolve(keycloak);
      })
      .catch(reject);
  });

function setupTokenRefresh() {
  setInterval(() => {
    keycloak
      .updateToken(60)
      .then((refreshed) => {
        if (refreshed) {
          localStorage.setItem("kc_token", keycloak.token);
          localStorage.setItem("kc_refresh_token", keycloak.refreshToken);
        }
      })
      .catch(() => {
        keycloak.logout({ redirectUri: window.location.origin });
      });
  }, 30000);
}

const login = () => {
  keycloak.login({ redirectUri: window.location.origin });
};

const logout = () => {
  keycloak.logout({ redirectUri: window.location.origin });
};

export { keycloak, initKeycloak, login, logout };
