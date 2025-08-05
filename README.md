# Vue 3 + Keycloak SSO Manual Login

Proyek ini adalah contoh implementasi login manual menggunakan Keycloak SSO di aplikasi Vue 3.
Tidak seperti pendekatan `login-required`, user hanya akan diarahkan ke Keycloak saat menekan tombol login.

## 🧩 Teknologi

- [Vue 3](https://vuejs.org/)
- [Keycloak.js](https://www.npmjs.com/package/keycloak-js)
- Keycloak Server (Contoh: `https://login.ponorogo.go.id`)

## ⚙️ Instalasi

1. **Clone project dan install dependensi**

```bash
npm install
```

2. **Install Keycloak JS**

```bash
npm install keycloak-js
```

3. **Tambahkan file `keycloak.js`**
   Di dalam `src/keycloak.js`, tambahkan konfigurasi berikut:

```js
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
        onLoad: "check-sso",
        pkceMethod: "S256",
        flow: "standard",
        token: storedToken,
        refreshToken: storedRefreshToken,
        checkLoginIframe: false,
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      })
      .then((authenticated) => {
        if (authenticated) {
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
```

4. **Tambahkan `silent-check-sso.html` di folder `public/`**

Buat file `public/silent-check-sso.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Silent SSO Check</title>
  </head>
  <body>
    <script>
      parent.postMessage(location.href, location.origin);
    </script>
  </body>
</html>
```

5. **Panggil `initKeycloak()` di `main.js` atau `main.ts`**

```js
import { createApp } from "vue";
import App from "./App.vue";
import { initKeycloak } from "./keycloak";

initKeycloak().then(() => {
  createApp(App).mount("#app");
});
```

6. **Contoh penggunaan tombol login/logout**

```vue
<template>
  <div>
    <button v-if="!isAuthenticated" @click="handleLogin">Login</button>
    <button v-else @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { keycloak, login, logout } from "./keycloak";

const isAuthenticated = ref(keycloak.authenticated);

const handleLogin = () => login();
const handleLogout = () => logout();
</script>
```

---

## ✅ Tips

- Gunakan route guard jika ingin membatasi akses halaman tertentu hanya jika sudah login.
- Token akan otomatis diperbarui setiap 30 detik.
- Pastikan redirect URI dan client config di Keycloak sesuai dengan domain frontend.

## 📄 Lisensi

MIT License.
