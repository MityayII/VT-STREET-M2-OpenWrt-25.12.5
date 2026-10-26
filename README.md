## 📦 VT-STREET-M2

### 💾 Базовая система
* **OpenWrt 25.12.6** (ядро Linux 6.12.112, архитектура MIPS).
* **Веб-интерфейс:** LuCI (с русской локализацией `luci-i18n-base-ru` и `luci-ssl`).

### 🔌 Драйверы (Kernel Modules)
* `kmod-nf-tproxy`, `kmod-nft-tproxy` (для прокси/маршрутизации трафика).
* **Исключены:** `uboot-envtools`, `wpad-basic-mbedtls`, `hostapd-common` (Wi-Fi стек отсутствует).

### 📦 Предустановленный софт
* **Управление модемом:** `luci-app-5gmodem` (из фида `fildunsky`).
* **Терминал и файловый менеджер:** `ttyd` (веб-терминал), `luci-app-filemanager`.
* **Сеть и диагностика:** `curl`, `jq`, `bind-dig`, `coreutils`, `picocom`.

### ⚙️ Встроенные конфиги и скрипты
* **`/etc/init.d/vtmac`** — скрипт запускается при загрузке (`S99`). Читает MAC из `mtd2` (смещение `0x28`), при отсутствии генерирует из хэша и применяет к `lan1` и `br-lan`.
* **`/etc/hotplug.d/iface/99-modem-time`** — при поднятии модема (`ifup modem`) перезапускает `sysntpd` и динамически привязывает LED `green:wan` к актуальному интерфейсу модема (`$DEVICE`).
* **`/etc/uci-defaults/99-system-cleanups`** — задает часовой пояс (Europe/Moscow), NTP РФ, отключает IPv6, удаляет битые репозитории, настраивает имя хоста `VT-STREET-M2`.

---

## 🤖 Использованные ИИ-ассистенты

В процессе разработки проекта применялись следующие инструменты:

<table>
  <tr>
    <td align="center" width="200">
      <a href="https://www.deepseek.com/" target="_blank">
        <img src="https://img.shields.io/badge/DeepSeek-0052CC?style=for-the-badge&logo=deepseek&logoColor=white" alt="DeepSeek" height="40"/><br />
        <b>DeepSeek</b>
      </a>
      <br />
      <sub>Архитектура, DSA, скрипты, CI/CD</sub>
    </td>
    <td align="center" width="200">
      <a href="https://gemini.google.com/" target="_blank">
        <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" height="40"/><br />
        <b>Google Gemini</b>
      </a>
      <br />
      <sub>Анализ документации, альтернативные решения</sub>
    </td>
  </tr>
</table>
## 🙏 Благодарности

<table>
  <tr>
    <td align="center" width="120">
      <a href="https://github.com/makssbaks">
        <img src="https://github.com/makssbaks.png?size=100" width="80" height="80" alt="makssbaks" style="border-radius: 50%;" /><br />
        <sub><b>makssbaks</b></sub>
      </a>
    </td>
    <td>
      Огромная благодарность за проделанную работу по портированию и ценные наработки (DTS, патчи портов), которые легли в основу этого проекта.
    </td>
  </tr>
</table>
