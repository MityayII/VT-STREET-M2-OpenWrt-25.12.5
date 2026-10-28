## 📦 VT-STREET-M2 | OpenWrt 25.12.x

### 💾 Базовая система
* **OpenWrt 25.12.6** (ядро Linux 6.12.x, архитектура MIPS).
* **Веб-интерфейс:** LuCI с русской локализацией.
### 🔌 Драйверы (Kernel Modules)
* `kmod-nf-tproxy`, `kmod-nft-tproxy` (для прокси/маршрутизации трафика).
* **Исключены:** `uboot-envtools`, `wpad-basic-mbedtls`, `hostapd-common` (Wi-Fi стек отсутствует).

### 📦 Предустановленный софт
* **Управление модемом:** `luci-app-5gmodem` (из фида `fildunsky`).
* **Терминал и файловый менеджер:** `ttyd`, `luci-app-filemanager`.

### 📡 Тестирование
Проект собран и протестирован на реальном железе:
* **Модем:** Fibocom FM350-GL.
* **Плата:** Vertell VT-STREET-M2 с **затёртым разделом `Factory`** (отсутствует заводской MAC-адрес).

Для восстановления уникального MAC-адреса используется кастомный пакет `vtmodem`, который генерирует его на основе хэша `mtd2` и применяет к сетевым интерфейсам.

### ⚙️ Встроенные конфиги и скрипты
* **Пакет `vtmodem`** — устанавливает `/etc/init.d/vtmac` (`S99`). Скрипт читает MAC из `mtd2` (смещение `0x28`), при отсутствии генерирует из хэша и применяет к `lan1` и `br-lan`.
* **`/etc/hotplug.d/iface/99-modem-time`** — при поднятии модема (`ifup modem`) перезапускает `sysntpd` и динамически привязывает LED `green:wan` к актуальному интерфейсу модема (`$DEVICE`).
* **`/etc/uci-defaults/99-system-cleanups`** — настраивает часовой пояс (Europe/Moscow), NTP РФ, отключает IPv6, удаляет битые репозитории, задает имя хоста `VT-STREET-M2` и регистрирует GPIO-переключатель для управления питанием USB.

### 🎛️ Дополнительные меню LuCI
* **Сеть → IPv6** — управление включением/выключением IPv6 на уровне ядра и DHCP (через `ipv6-toggle.sh`). При первой загрузке и сбросе IPv6 выключен.
* **Система → Питание USB** — управление питанием USB-порта модема (GPIO `power_usb`) с возможностью перезагрузки модема по питанию.

---

## ⚠️ Важно: Инструкция по прошивке

Производитель платы (Vertell) настоятельно рекомендует прошивать устройство **строго через встроенный режим восстановления (FACTORY UPDATE / U-Boot Recovery)**. 

**Как это сделать:**
1. Зажмите кнопку **Reset**.
2. Не отпуская кнопку, подайте питание.
3. Через 3–5 секунд индикатор SYS начнет мигать — отпустите кнопку.
4. Подключитесь к `192.168.1.1` с компьютера (IP `192.168.1.2`).
5. Загрузите файл прошивки через веб-интерфейс **FACTORY UPDATE**.
6. Нажмите **Proceed** и дождитесь завершения.

**❌ Не рекомендуется:** прошивать образ через `sysupgrade` в LuCI, если вы не уверены, что образ собран с поддержкой `nand_do_upgrade` (в некоторых случаях это может повредить разделы NAND).

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
    <td align="center" width="200">
      <a href="https://github.com/makssbaks">
        <img src="https://github.com/makssbaks.png?size=100" width="80" height="80" alt="makssbaks" style="border-radius: 50%;" /><br />
        <sub><b>makssbaks</b></sub>
      </a>
      <br />
      <sub>Портирование, DTS, патчи портов</sub>
    </td>
    <td align="center" width="200">
      <a href="https://github.com/fildunsky">
        <img src="https://github.com/fildunsky.png?size=100" width="80" height="80" alt="fildunsky" style="border-radius: 50%;" /><br />
        <sub><b>fildunsky</b></sub>
      </a>
      <br />
      <sub>Пакет luci-app-5gmodem и драйверы модемов</sub>
    </td>
  </tr>
</table>
