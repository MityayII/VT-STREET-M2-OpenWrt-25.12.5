## 📦 Состав прошивки (VT-STREET-M2)

### 💾 Базовая система
* **OpenWrt 25.12.5** (ядро Linux 6.12.94, архитектура MIPS).
* **Менеджер пакетов:** `apk` (стандарт для 25.12).
* **Веб-интерфейс:** LuCI (с русской локализацией `luci-i18n-base-ru` и `luci-ssl`).
* **Платформа:** Профиль `vertell_vt-mt7621d` (NAND, разделы под ядро 4 МБ, образ 121 МБ).

### 🔌 Драйверы (Kernel Modules)
* `kmod-usb3`, `kmod-usb-acm`, `kmod-usb-net-cdc-ncm`, `kmod-usb-net-qmi-wwan`, `kmod-usb-serial-option` (полный набор для USB-модемов).
* `kmod-nf-tproxy`, `kmod-nft-tproxy` (для прокси/маршрутизации трафика).
* **Исключены:** `uboot-envtools`, `wpad-basic-mbedtls`, `hostapd-common` (Wi-Fi стек отсутствует).

### 📦 Предустановленный софт
* **Управление модемом:** `luci-app-5gmodem` (из фида `fildunsky`), `uqmi`.
* **Терминал и файлы:** `ttyd` (веб-терминал), `luci-app-filemanager`.
* **Сеть и диагностика:** `curl`, `jq`, `bind-dig`, `coreutils`, `picocom`.
* **Кастомный пакет:** `vtmodem` (версия 1.0-r2).

### ⚙️ Встроенные конфиги и скрипты
* **`/etc/init.d/vtmac`** — скрипт запускается при загрузке (`S99`). Читает MAC из `mtd2` (смещение `0x28`), при отсутствии генерирует из хэша и применяет к `lan1` и `br-lan`.
* **`/etc/hotplug.d/iface/99-modem-time`** — при поднятии модема (`ifup modem`) перезапускает `sysntpd` и динамически привязывает LED `green:wan` к актуальному интерфейсу модема (`$DEVICE`).
* **`/etc/uci-defaults/99-system-cleanups`** — задает часовой пояс (Europe/Moscow), NTP РФ, отключает IPv6, удаляет битые репозитории, настраивает имя хоста `VT-STREET-M2`.
* **`/etc/board.d/02_network`** — патч, который прибивает единственный порт `lan1` к LAN.

### 🧩 DTS и профиль
* Профиль `vertell_vt-mt7621d` в `mt7621.mk`.
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
