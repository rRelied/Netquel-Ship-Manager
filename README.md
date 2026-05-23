# 🚀 Netquel Ship Manager

**Version 2.1 · Made by Relied**  
Save, organize, and instantly load your custom ships on [Netquel.com](https://netquel.com).

---

## Table of Contents

1. [Installation](#installation)
2. [First-Time Setup](#first-time-setup)
3. [The Interface](#the-interface)
4. [Saving Ships — Chat Commands](#saving-ships--chat-commands)
5. [Loading Ships](#loading-ships)
6. [Favorites](#favorites)
7. [Hotkeys — 1–9 or F1–F9](#hotkeys--19-or-f1f9)
8. [File Manager](#file-manager)
9. [Folders](#folders)
10. [Ship Notes & Color Tags](#ship-notes--color-tags)
11. [Ship History & Rollback](#ship-history--rollback)
12. [Quick-Copy Code](#quick-copy-code)
13. [Chat Binds](#chat-binds)
14. [Export & Import](#export--import)
15. [Sidebar Mode](#sidebar-mode)
16. [Full Page Mode](#full-page-mode)
17. [Profile](#profile)
18. [Settings](#settings)
19. [Customizing Commands](#customizing-commands)
20. [Legal & Privacy](#legal--privacy)
21. [Troubleshooting](#troubleshooting)

---

## Installation

This extension is loaded manually as an unpacked extension — it is not on the Chrome Web Store.

**Step 1.** Download the extension folder. It should contain:

```
netquel-extension/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── share.html
├── tos.html
├── privacy.html
├── icon16.png
├── icon48.png
└── icon128.png
```

> You need to supply your own icon images (16×16, 48×48, and 128×128 pixels). Name them exactly `icon16.png`, `icon48.png`, and `icon128.png`. Any image works — just match the names.

**Step 2.** Open Chrome and go to `chrome://extensions`

**Step 3.** Toggle on **Developer mode** in the top-right corner

**Step 4.** Click **Load unpacked** and select the `netquel-extension` folder

**Step 5.** The 🚀 icon will appear in your Chrome toolbar. Click the puzzle piece icon and pin it for easy access.

---

## First-Time Setup

The first time you open the extension, you'll be asked to enter your **Netquel username**. This is the name that gets attached to your exported ship files so friends know whose ships they're importing. It is stored only on your device and never sent anywhere.

Type your name and press **LET'S GO →** (or Enter). You're in.

You can change your username anytime in the **Profile** pane.

---

## The Interface

The extension opens as a popup. A narrow sidebar on the left has navigation buttons; the main content area is on the right.

### Sidebar Nav Buttons

| Icon | Pane | Purpose |
|------|------|---------|
| ⭐ FAV | Favorites | Your pinned ships + quick load |
| 📁 FILES | File Manager | All ships, full organization |
| 💬 CHAT | Chat Binds | Key-to-message shortcuts |
| Avatar | Profile | Username, Discord, photo |
| ⚙ SET | Settings | Font size, commands, data, about |

### Bottom Bar

At the bottom of the popup:
- **⤢ Full page** — opens the extension in its own browser tab
- **📌 Sidebar on Netquel** — injects the extension as a side panel on Netquel.com

---

## Saving Ships — Chat Commands

Commands are typed directly into the Netquel chat box and start with a `.` (period).

### Tip — Press `.` to instantly focus chat

If your cursor isn't in the chat box, press `.` anywhere on the page. The chat input will focus automatically and the dot will already be typed.

---

### `.name <ShipName>` — Save a ship

1. In Netquel chat, type `/save` and press Enter
2. Wait for the server to reply with a save code (starts with `netquel...`)
3. Type `.name MyShip` and press Enter

The extension reads the most recent save code from chat and stores it under that name.

**Example:**
```
/save
[Server: netquel0j~AxB3zQ...]
.name BigFighter
→ Saved "BigFighter"
```

If a ship with that name already exists, it gets **updated** and the old code is pushed to its version history automatically.

---

### `.load <ShipName>` — Load a ship

```
.load BigFighter
```

Automatically sends `/load [code]` to chat. Your ship loads immediately.

**Loading an imported ship from another player:**
```
.load PlayerName ShipName
```
This looks up the ship inside the `[PlayerName]'s Ships` folder.

---

### `.list` — List all ships

Shows a toast with all your saved ship names.

---

### `.delete <ShipName>` — Delete a ship

```
.delete BigFighter
```

Permanently removes the ship.

---

### `.help` — Quick command reference

Shows a reminder of all commands in a toast.

---

### Custom command names

You can rename any command in **Settings → Edit Commands**. See [Customizing Commands](#customizing-commands).

---

## Loading Ships

Three ways to load any ship:

**1. Chat command** — `.load ShipName` in Netquel chat

**2. LOAD button** — Open the extension, find the ship in Favorites or File Manager, click **LOAD**. The popup closes automatically and the ship loads.

**3. Hotkeys** — Press a number key or function key while on Netquel.com to load a Favorited ship instantly. See [Hotkeys](#hotkeys--19-or-f1f9).

> The LOAD button requires you to be on Netquel.com in the active tab.

---

## Favorites

The **Favorites** pane (⭐) holds up to **9** of your most-used ships for instant access.

### Adding a ship to Favorites

- **Drag and drop** — In File Manager, drag a ship row up to the **★ FAVORITES** header and drop it when it glows gold
- **Three-dot menu** — Click ⋯ on any ship → **⭐ Add to Favorites**

### Removing from Favorites

Click the ⭐ star button to the left of any ship in the Favorites pane. The ship stays in your File Manager — it's just unpinned.

### The cap

Maximum 9 ships. The counter top-right shows usage (e.g. `4 / 9`). It turns orange at 8/9 and red when full.

### Hotkey labels

Each ship in Favorites shows a small badge (`1`, `2`, `3` etc. or `F1`, `F2`, `F3` depending on your hotkey mode). This tells you which key will load it instantly.

### Searching

The search bar below the Favorites header filters your starred ships by name.

### Quick-copy current save code

A bar at the top of the Favorites pane lets you grab the most recent `/save` code from Netquel chat and copy it straight to your clipboard — no naming required. Click **Copy Code** and it's done.

---

## Hotkeys — 1–9 or F1–F9

Press a single key to instantly load a Favorited ship while on Netquel.com — no popup needed.

### Number Key Mode (default)

Press **1 through 9** to load the ship in that Favorites slot.

- Only fires when the **chat box is not focused**
- If you're typing in chat, number keys type normally — no interference
- Click anywhere outside the chat box first, then press your key

### Function Key Mode

Press **F1 through F9** to load the corresponding Favorites slot.

- Fires **anywhere** on the page, whether chat is focused or not

### Switching modes

**Settings → Hotkey Mode** — click **🔢 Number Keys** or **⌨️ Function Keys**.

### Notes

- If a slot is empty, pressing that key does nothing
- A toast confirms which ship is loading
- Slot order matches top-to-bottom in the Favorites list

> **Tip:** Put your most-loaded ship at slot 1, second most-used at slot 2, and so on.

---

## File Manager

The **File Manager** (📁) shows every saved ship.

### Ship rows

Each row shows:
- The ship **name**
- A shortened **code preview**
- A 📝 badge if a note exists (hover the row to read the full note)
- A 🕐 badge if version history is saved
- A colored left-edge strip if a color tag is set
- A **LOAD** button
- A **⋯** three-dot menu button

### Three-dot menu (⋯)

| Option | What it does |
|--------|-------------|
| ⭐ Add to Favorites / ☆ Remove | Toggle Favorites |
| 📝 Edit Note & Tag | Write a note and pick a color label |
| 🕐 View History | See and restore previous code versions |
| 📋 Copy Code | Copies the ship's full save code to clipboard |
| ✏️ Rename | Change the ship's name |
| 🔑 Change Code | Replace the ship's saved code |
| 📂 Move to Folder | Move the ship to a different folder |
| 🗑️ Delete | Permanently remove the ship |

### Searching

The search bar filters by ship name across all folders in real time.

### Selecting ships (clipboard move)

Click a ship row (not on a button) to select it (highlighted blue). Then:
- **Ctrl+C** — "copies" it to the clipboard bar at the top
- **Ctrl+V** or **"Paste Here"** — opens a Move dialog to place it in a folder

### Adding ships manually

Click **+ Ship** in the header. Enter a name, paste a code, optionally pick a folder.

---

## Folders

Organize ships into named categories.

### Creating a folder

Click **📁** in the File Manager header and enter a name.

### Folder colors

Click the small **colored circle** on the right side of any folder row to pick a color from 12 options. The folder background and left strip tint to that color. Click **✕ Remove color** to clear it.

### Collapsing / expanding

Click anywhere on the folder row (not on a button) to toggle open/closed. The arrow rotates and the icon switches between 📁 and 📂.

### Moving ships into folders

- **Drag and drop** — grab a ship row and drop it onto a folder header
- **Three-dot menu** → **📂 Move to Folder**
- **Drop on empty space** below all folders to move a ship to Ungrouped

### Deleting folders

Click **✕** on the folder row and confirm. Ships inside become Ungrouped — none are deleted.

---

## Ship Notes & Color Tags

Attach personal notes and a color label to any ship.

### Adding a note or tag

Click ⋯ → **📝 Edit Note & Tag**

- Type a note in the text area (e.g. "PvP build, upgrade shields first")
- Click a color swatch to set a tag, or click **✕ No tag** to clear it
- Click **SAVE**

### Where notes appear

- **Hover** over a ship row in File Manager — a tooltip shows the full note
- A 📝 badge on the row indicates a note exists
- In Favorites, the note shows as an italic subtitle under the ship name

### Color tags

A 3px colored strip on the left edge of the row. Purely visual — use however you like. Tags are independent of folder colors.

---

## Ship History & Rollback

Every time you overwrite a ship (via `.name` in chat or **Change Code** in the menu), the old code is saved automatically. Up to **3 previous versions** are kept per ship.

### Viewing history

Click ⋯ → **🕐 View History** — shows each snapshot with its timestamp.

### Restoring a version

Click **Restore** next to any snapshot. You'll be asked to confirm. The current code moves into history and the snapshot becomes active.

A 🕐 badge on the ship row means history exists.

---

## Quick-Copy Code

In the **Favorites pane**, there's a **"📋 Grab latest /save code"** bar.

1. Type `/save` in Netquel and wait for the server reply
2. Open the extension (stay on Netquel.com)
3. Click **Copy Code**

The most recent save code from chat is copied to your clipboard instantly. A "✓ Copied!" flash confirms it. Useful for sharing codes without going through the full `.name` flow.

---

## Chat Binds

The **Chat Binds** pane (💬) lets you assign any key to a chat message. Press that key while on Netquel.com and the message is instantly typed and sent — no typing required.

### Example uses

| Key | Message |
|-----|---------|
| `q` | "Guys I'm getting chased, help!" |
| `e` | "GG everyone, good game!" |
| `r` | "Meet at the asteroid field!" |
| `F4` | "Dropping loot at spawn now" |

### Creating a bind

1. Go to the **💬 CHAT** pane
2. Click **+ Add Bind**
3. Enter a **key** — any single character (`a`, `b`, `1`) or a special key name (`F2`, `Space`, `Enter`)
4. Enter the **message text** to send
5. Click **ADD BIND**

### Rules

- Keys are case-insensitive (`A` and `a` are the same key)
- Each key can only be used once — duplicate keys are rejected
- You can use special key names like `Space`, `Enter`, `F1` through `F9`

### Editing or deleting a bind

- Click ✏️ on any bind row to edit the key or text
- Click 🗑️ to delete the bind

### How firing works

While on Netquel.com, press a bound key **when the chat box is not focused**. The extension types the message into chat and presses Enter automatically. If you're already typing in chat, bound keys are ignored so normal typing is never interrupted.

> **Note:** Chat binds and Favorite hotkeys (1–9 or F1–F9) are completely separate systems. A key used as a chat bind and the same key used as a hotkey will both fire — so avoid assigning the same key to both.

---

## Export & Import

### Exporting

Click **⬇ Export** in the File Manager toolbar (or **⬇ Export JSON** in Settings).

A selection dialog opens with your ships organized by folder:
- Check/uncheck individual ships
- Check/uncheck a folder header to toggle all ships inside it
- **Select All** / **Deselect All** buttons at the top

Click **⬇ Export Selected** to download a `.json` file. Your username and Discord tag (if set) are included so importers know who made the ships.

### Importing

Click **⬆ Import** and select a `.json` file from Netquel Ship Manager.

What happens:
- Ships are added to your collection
- If an imported ship's folder **already exists** in your collection, the ship goes into that existing folder (no duplicate folders)
- **Duplicate names** get auto-renamed: `MyShip (1)`, `MyShip (2)`, etc.
- All imported ships start unstarred — add them to Favorites manually if needed
- An alert confirms how many were added and how many were renamed

---

## Sidebar Mode

Keep the extension open alongside the game while you play.

### Opening the sidebar

1. Go to Netquel.com
2. Open the extension popup
3. Click **📌 Sidebar on Netquel** at the bottom

The extension appears as a 420px panel on the right side. The Netquel page shifts left so nothing is hidden.

### Closing the sidebar

Click **✕ Close panel** above the sidebar.

> The LOAD button still works from the sidebar — it sends the load command to the Netquel page.

---

## Full Page Mode

Opens the extension in a full browser tab for more space.

### Opening

- Click the **🚀** logo at the top of the sidebar nav
- Click **⤢ Full page** at the bottom of the popup
- Click **⤢ Expand** in any profile banner

### Loading ships from full page mode

The LOAD button will send the load command to your Netquel.com tab if one is open. If Netquel isn't open, you'll be prompted to go there first.

---

## Profile

### Opening

Click the **avatar circle** at the bottom of the sidebar nav, or click the avatar in any profile banner at the top of the Favorites or File Manager panes.

### Username

Shown in the profile banner and included in JSON exports. Required — cannot be empty.

### Discord username (optional)

Your Discord tag (e.g. `eliedr`) is included in exports so people importing your ships can reach you. Completely optional.

### Profile photo (optional)

Click the large avatar circle to upload an image. It's cropped to a circle and shown throughout the UI. Stored locally only — never uploaded anywhere.

### Saving

Click **Save Profile**. The button briefly says "Saved!" to confirm.

---

## Settings

Open Settings via **⚙ SET** in the sidebar.

### Default Page

Pick which pane opens when you click the extension icon:
- ⭐ **Favorites** (default)
- 📁 **Files**
- 💬 **Chat**

### Text Size

| Size | Base font |
|------|-----------|
| S — Small | 11px |
| M — Default | 12px |
| L — Large | 14px |
| XL — X-Large | 16px |

The entire UI scales — every label, button, and header. Saved automatically.

### Data

- **⬇ Export JSON** — Opens the export selection dialog
- **⬆ Import JSON** — Opens a file picker to import

### Hotkey Mode

- **🔢 Number Keys (1–9)** — Fires when chat is not focused
- **⌨️ Function Keys (F1–F9)** — Fires anywhere on the page

### Edit Commands

Rename any chat command. See [Customizing Commands](#customizing-commands).

### About

Attribution, version, and links to Terms of Service and Privacy Policy.

---

## Customizing Commands

**Settings → Edit Commands** — change any command to a word you prefer.

### How

1. In the **Edit Commands** section, change any field
2. Click **Save Commands**

**Rules:**
- The `.` prefix is always required — you're only setting the word after it
- All command names must be unique
- No spaces or empty values
- Max 20 characters

**Defaults:**

| Command | Action |
|---------|--------|
| `.name <ShipName>` | Save or update a ship |
| `.load <ShipName>` | Load a ship |
| `.list` | List all saved ships |
| `.delete <ShipName>` | Delete a ship |
| `.help` | Show command reference |

Click **Reset Defaults** to restore all of the above.

---

## Legal & Privacy

**This extension collects no data.** Everything is stored locally on your device using Chrome's built-in storage API. Nothing is ever sent to any server.

What is stored locally:
- Ship names, codes, notes, tags, and version history
- Folder structure and colors
- Chat binds
- Your username, Discord tag, and profile photo
- Your command customizations, font size, and hotkey preference

Uninstalling the extension deletes all of it.

**Open source.** You may copy, modify, and redistribute freely. If you distribute it, you must credit **Relied** as the original author and include the contact info: `is.relied.on@gmail.com` / Discord: `eliedr`.

Full details: **Settings → Terms of Service** and **Settings → Privacy Policy**.

---

## Troubleshooting

**"No save code found!" when using `.name`**  
Type `/save` in Netquel chat and wait for the server to respond. The extension looks for the most recent code in the visible chat. If none is found, type `/save` again.

**LOAD button says "Open Netquel.com first!"**  
You need to be on Netquel.com in the active tab. Switch to that tab and try again, or use Sidebar Mode to keep the extension open alongside the game.

**Number keys or F-keys do nothing**  
Make sure you're on Netquel.com. If using number key mode, click somewhere outside the chat box first — number keys won't fire while chat is focused. If using function key mode, press F1–F9 from anywhere. Also check that the target Favorites slot actually has a ship.

**Chat bind key does nothing**  
Make sure you're on Netquel.com and the chat input is **not** focused. Chat binds fire only when no text input is active. Also verify the bind is saved by checking the 💬 Chat Binds pane.

**The sidebar doesn't open**  
Refresh the Netquel.com page and try again. The content script needs to be running on the page before the sidebar can be injected.

**Importing says "Invalid JSON"**  
Only `.json` files exported from Netquel Ship Manager can be imported. Do not import manually edited files unless you're sure the JSON is valid.

**Commands aren't working after customizing them**  
After saving in Settings, the new commands apply immediately. If on Netquel.com, the page's content script is updated automatically. If it still doesn't work, refresh the Netquel page.

---

*Netquel Ship Manager · Made by Relied · is.relied.on@gmail.com · Discord: eliedr*
