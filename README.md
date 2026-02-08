# OUDL

**OUDL (OpenFront Unofficial Desktop Launcher)** is an open-source Electron-based desktop launcher for [openfront.io](https://openfront.io).

---

## Features

- Launches openfront.io in a dedicated desktop window
- Fullscreen toggle (F11)
- Discord Rich Presence
- Offline fallback page
- Automatic update checks
- Minimal settings

---

## Versioning

OUDL uses a custom versioning system.

States:
- **INDEV** – Development state (source tree only, not a release)
- **P** – Public Release

Version format:

`Major.Minor`

Rules:
- First public release starts at **1.0**
- Bugfixes increment the minor version (**1.1 → 1.9**)
- After **.9**, the next release increments the major version (**2.0**)
---
- There is no `.10`

## License

This project is licensed under the **GNU AGPL-3.0**.

You are free to use, modify, and redistribute this software under the terms of the license.
If you distribute modified versions, you must also provide the source code.

See the LICENSE file for full details.

---

## Disclaimer

- This is an **unofficial** launcher.
- OpenFront and openfront.io are owned by their respective contributors.
- This project is not affiliated with or endorsed by the OpenFront team.

---

## Releases

- **Flatpak** (Linux)
- **Windows EXE** (for people who still use Windows, please just switch to [Mint](https://linuxmint.com/))

## How to install
Windows:

Download the latest Windows installer from [here](https://github.com/NotAndrej/oudl/releases/latest) and run it.

---
Linux:
1. Make sure Flatpak is installed.
2. Download the latest .flatpak file from [here](https://github.com/NotAndrej/oudl/releases/latest).
3. Go to the directory where you downloaded it and run the following command:  
   `flatpak install --user OUDL_1.0-P.flatpak`
4. Press `y` to confirm and enjoy!

## How to build

Guide WIP (sorry)

## Bugs
- Auto update checker

## Development (Linux only right now)

```bash
git clone https://github.com/NotAndrej/oudl/
cd oudl
npm install
npm start
```
This will give you the latest INDEV build.  
For average users, the [latest release](https://github.com/NotAndrej/oudl/releases/latest) is recommended.
