# 🚀 Netquel Ship Manager

**Version 2.1 · Made by Relied**  
*Save, organize, and instantly load your custom ships on [Netquel.com](https://netquel.com)*

---

## Table of Contents

1. [Installation](#installation)
2. [First-Time Setup](#first-time-setup)
3. [The Interface](#the-interface)
4. [Saving Ships (Chat Commands)](#saving-ships-chat-commands)
5. [Loading Ships](#loading-ships)
6. [Favorites](#favorites)
7. [1–9 / F1–F9 Hotkeys](#19--f1f9-hotkeys)
8. [File Manager](#file-manager)
9. [Folders](#folders)
10. [Ship Notes & Color Tags](#ship-notes--color-tags)
11. [Ship History & Rollback](#ship-history--rollback)
12. [Quick-Copy Code](#quick-copy-code)
13. [Share Links](#share-links)
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

This extension is not on the Chrome Web Store — you load it manually as an unpacked extension.

**Step 1.** Download or clone the extension folder to your computer. It should contain these files:
```
netquel-extension/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── share.html
├── tos.html
├── privacy.html
└── icon16.png, icon48.png, icon128.png
```

> **Note:** You need to supply your own icon images (16×16, 48×48, 128×128 pixels). Name them `icon16.png`, `icon48.png`, and `icon128.png` and place them in the folder. Any images will work — just make sure the file names match exactly.

**Step 2.** Open Chrome and go to `chrome://extensions`

**Step 3.** In the top-right corner, turn on **Developer mode**

**Step 4.** Click **Load unpacked** and select the `netquel-extension` folder

**Step 5.** The 🚀 rocket icon will appear in your Chrome toolbar. Pin it for easy access by clicking the puzzle piece icon in the toolbar and pinning Netquel Ship Manager.

---

## First-Time Setup

The first time you open the extension, you'll see a welcome screen asking for your **Netquel username**.

- This is the name other players will see when you export and share your ships
- It is stored **only on your device** — it is never sent anywhere
- It does not have to match your Netquel account username exactly, but it helps others identify whose ships they're importing

Type your username and click **LET'S GO →** (or press Enter). You'll be taken to the main interface.

You can change your username later in the **Profile** pane (click the avatar icon in the sidebar).

---

## The Interface

The extension opens as a **popup** when you click the 🚀 icon in your Chrome toolbar. The popup has a narrow left sidebar with navigation buttons, and a main content area on the right.

### Sidebar Navigation Buttons

| Icon | Pane | What it does |
|------|------|--------------|
| ⭐ FAV | Favorites | Your pinned ships, quick-load access |
| 📁 FILES | File Manager | All ships, folders, full management |
| Avatar | Profile | Set username, Discord, profile photo |
| ⚙ SET | Settings | Font size, commands, data, about |

Click any button to switch panes. The active pane is highlighted in green.

### Expand Bar (bottom of popup)

At the very bottom of the popup you'll find two links:
- **⤢ Full page** — opens the extension in a dedicated browser tab with more space
- **📌 Sidebar on Netquel** — injects the extension as a sidebar panel directly on Netquel.com

---

## Saving Ships (Chat Commands)

The extension works by typing special **dot commands** directly into the Netquel chat box. Commands start with a `.` (period).

### Tip: Press `.` anywhere to focus chat
If your cursor isn't in the chat box, just press the `.` key on your keyboard anywhere on the Netquel page and the chat input will automatically focus and the dot will be typed for you. Then type the rest of your command.

---

### `.name <ShipName>` — Save a ship

**How to use:**
1. In Netquel, type `/save` in chat and press Enter. The server will reply with a long save code starting with `netquel...`
2. Once the save code appears in chat, type `.name MyShipName` in the chat box and press Enter
3. The extension reads the most recent save code from the chat and saves it under that name

**Example:**
```
/save
[Server replies with: netquel0j~AxB3...]
.name BigFighter
```
Result: A ship called "BigFighter" is saved with that code.

**Updating a ship:**  
If you type `.name BigFighter` again after saving a new version, it **updates** the existing ship. The old code is automatically saved to the ship's history (up to 3 versions).

---

### `.load <ShipName>` — Load a ship

Typing `.load BigFighter` will automatically send `/load [the saved code]` to Netquel chat, loading your ship immediately.

```
.load BigFighter
```

**Loading another user's imported ship:**  
If you've imported ships from someone else, they get placed in a folder called `[Username]'s Ships`. To load one:
```
.load PlayerName ShipName
```

---

### `.list` — List all saved ships

Displays a toast notification listing all your saved ship names.

```
.list
```

---

### `.delete <ShipName>` — Delete a ship

Permanently removes a ship from your collection.

```
.delete BigFighter
```

---

### `.help` — Show command reference

Displays a quick reminder of all available commands.

```
.help
```

---

### Custom Command Names

You can rename any command (e.g. change `.name` to `.n`) in **Settings → Edit Commands**. See the [Customizing Commands](#customizing-commands) section for details.

---

## Loading Ships

There are three ways to load a ship:

**1. Chat command** — Type `.load ShipName` in Netquel chat (described above)

**2. LOAD button in the popup** — Open the extension, find your ship in Favorites or File Manager, and click the green **LOAD** button next to it. The extension will send the load command to Netquel automatically and close the popup.

**3. 1–9 / F1–F9 hotkeys** — Press 1 through 9 (or F1–F9) on your keyboard while on Netquel.com to instantly load your 1st through 9th Favorite ship without opening the extension at all. See [1–9 / F1–F9 Hotkeys](#19--f1f9-hotkeys).

> **Important:** For the LOAD button to work, you must be on Netquel.com in the current browser tab. If you're on a different page, you'll see an alert asking you to go to Netquel first.

---

## Favorites

The **Favorites** pane (⭐) is your quick-access panel for up to **9 ships** you use most often.

### Adding to Favorites

There are two ways to add a ship to Favorites:

**Method 1 — Drag and drop:** In the File Manager, drag any ship row up to the **★ FAVORITES FOLDER** header bar at the top of the Favorites pane. When the header glows gold, release to drop.

**Method 2 — Three-dot menu:** In the File Manager, click the **⋯** button on any ship row. Select **⭐ Add to Favorites** from the dropdown menu.

### Removing from Favorites

In the Favorites pane, click the ⭐ star button to the left of any ship's name to remove it from Favorites. It stays in your File Manager — it's just unpinned.

### Favorites Cap

You can have a maximum of **9 ships** in Favorites. The counter in the top-right of the pane header shows how many slots are used (e.g. `3 / 7`). It turns **orange** at 8/9 and **red** when full. If you try to add a 10th ship, you'll get an alert.

### Searching Favorites

Use the search bar below the Favorites folder header to filter your favorited ships by name.

### Hotkey Labels

Each ship in the Favorites pane shows a small label like `1`, `2`, `F1`, `F2`, etc. (depending on your hotkey mode setting) — this tells you which key will load that ship instantly. The order is top-to-bottom: your 1st favorite is slot 1, 2nd is slot 2, and so on.

---

## 1–9 / F1–F9 Hotkeys

While you're on Netquel.com, you can press a key to instantly load any of your 9 Favorite ships — **no popup needed**. There are two modes; you choose which one you prefer in Settings.

### Number Key Mode (default)
Press **1 through 9** on your keyboard to load the ship in that Favorites slot.

- **1** loads your 1st Favorite
- **2** loads your 2nd Favorite
- ... and so on up to **9**

**Important:** Number key mode only fires when the **chat box is not focused**. If you're typing in chat, pressing 1–9 types normally as expected. Click somewhere outside the chat input first, then press the key.

### Function Key Mode
Press **F1 through F9** on your keyboard to load the ship in that slot.

- **F1** loads your 1st Favorite
- **F2** loads your 2nd Favorite
- ... and so on up to **F9**

Function keys fire **anywhere on the page** — whether the chat box is focused or not.

### Switching Modes
Go to **⚙ Settings → Hotkey Mode** and click either **🔢 Number Keys** or **⌨️ Function Keys**. The setting takes effect immediately and is remembered between sessions.

### How Both Modes Work
- A toast notification confirms which ship is being loaded
- If a Favorites slot is empty (e.g. you only have 5 favorites and press 7), nothing happens
- The Favorites pane shows the hotkey label next to each ship (e.g. `1`, `2`, `3` or `F1`, `F2`, `F3`) so you always know the mapping

> **Tip:** Arrange your Favorites carefully — put your most-used ship at slot 1, second most-used at slot 2, etc. You can have up to **9** favorites.

---

## File Manager

The **File Manager** (📁) is where all your ships live. Every saved ship appears here, whether or not it's in Favorites.

### Ship Rows

Each ship row shows:
- The ship **name**
- A shortened **save code** preview
- A 📝 badge if the ship has a note (hover the row to see the note)
- A 🕐 badge if the ship has version history saved
- A colored strip on the left edge if a color tag is set
- A **LOAD** button
- A **⋯** three-dot button for more options

### Three-Dot Menu (⋯)

Clicking ⋯ on any ship opens a dropdown with:

| Option | What it does |
|--------|-------------|
| ⭐ Add to Favorites / ☆ Remove | Toggle whether this ship is in Favorites |
| 📝 Edit Note & Tag | Add a text note and color label to the ship |
| 🕐 View History | See and restore previous saved versions of this ship |
| 🔗 Share Link | Generate a shareable URL for this ship |
| ✏️ Rename | Change the ship's name |
| 🔑 Change Code | Replace the ship's saved code with a new one |
| 📂 Move to Folder | Move the ship into a folder |
| 🗑️ Delete | Permanently remove the ship |

### Searching

The search bar at the top of the File Manager filters ships by name in real time across all folders and ungrouped ships.

### Selecting Ships (Clipboard)

Click on a ship row (not on a button) to **select** it (highlighted in blue). Then:
- Press **Ctrl+C** to "copy" it to the clipboard bar
- Press **Ctrl+V** (or click "Paste Here" in the clipboard bar) to open a Move dialog and place the ship in a folder

This is an alternative to drag-and-drop for moving ships.

### Adding Ships Manually

Click **+ Ship** in the File Manager header to manually add a ship by typing its name, paste in a save code, and optionally assign a folder. This is useful if you have a code from somewhere else (e.g. imported from a friend's chat message).

---

## Folders

Folders help you organize ships into categories (e.g. "Fighters", "Mining", "PvP Builds").

### Creating a Folder

Click the **📁** button in the File Manager header and enter a folder name.

### Folder Color Labels

Each folder can have a color assigned to it for quick visual scanning. Click the small **colored circle** on the right side of any folder row to open a color picker. Choose from 12 colors. The folder's background and left edge strip will tint to that color. Click **✕ Remove color** to clear it.

### Opening and Closing Folders

Click anywhere on a folder row (except the buttons) to **collapse** or **expand** it. A collapsed folder shows 📁 and an expanded one shows 📂. The arrow on the left rotates when open.

### Moving Ships into Folders

**Drag and drop:** Grab a ship row and drag it onto a folder header. When the folder highlights with a green outline, release to drop. The ship moves to that folder.

**Three-dot menu:** Click ⋯ on a ship → **📂 Move to Folder** → select the destination.

**Move to Ungrouped:** Drag a ship and drop it on the empty area below all folders to remove it from any folder.

### Deleting Folders

Click the **✕** button on the right side of a folder row. You'll be asked to confirm. The folder is removed, but all ships inside it become **Ungrouped** — they are not deleted.

### Ungrouped Ships

Ships that don't belong to any folder appear at the bottom of the File Manager under a gray "Ungrouped" label (only shown when you have at least one folder).

---

## Ship Notes & Color Tags

You can attach a personal note and a color tag to any ship.

### Adding a Note

1. Click ⋯ on a ship → **📝 Edit Note & Tag**
2. Type your note in the text area (e.g. "Best PvP build, upgrade shields first")
3. Pick a color swatch for the tag (or leave it with no tag)
4. Click **SAVE**

### Viewing Notes

- **Hover** over a ship row in the File Manager — the note appears as a tooltip above the row
- A 📝 badge appears on the ship row whenever a note exists
- In the **Favorites** pane, the note shows as an italic subtitle under the ship name

### Color Tags

Tags are purely visual. A colored strip appears on the left edge of the ship row. Use them however you like — for example:
- 🔴 Red = PvP / combat builds
- 🟡 Yellow = WIP / experimental
- 🟢 Green = Main / reliable

Tags are independent of folder colors.

---

## Ship History & Rollback

Every time you **overwrite** a ship (by running `.name` again on an existing ship, or using "Change Code" in the menu), the old code is automatically saved to that ship's history. Up to **3 previous versions** are kept per ship.

### Viewing History

1. Click ⋯ on any ship → **🕐 View History**
2. A modal shows up to 3 previous versions with the date and time each was saved

### Restoring a Previous Version

In the History modal, click **Restore** next to any snapshot. This will:
- Move the **current** code into history (so you don't lose it)
- Set the **snapshot** as the active code

You'll be asked to confirm before anything changes.

A 🕐 badge appears on ship rows that have history saved.

---

## Quick-Copy Code

At the top of the **Favorites** pane, there's a **"📋 Grab latest /save code"** bar.

**How to use:**
1. In Netquel, type `/save` and let the server respond with your save code
2. Open the extension (without navigating away from Netquel)
3. In the Favorites pane, click **Copy Code**
4. The most recent save code from the chat is copied to your clipboard

This is useful when you want to quickly grab a code to paste somewhere (Discord, a note, etc.) without going through the full `.name` flow.

A green "✓ Copied!" flash confirms the copy succeeded. If no save code is found in the current chat, you'll get an alert.

---

## Share Links

You can generate a shareable link for any ship that anyone can open — even without the extension installed.

### Generating a Share Link

1. Click ⋯ on any ship → **🔗 Share Link**
2. A modal shows the generated URL
3. Click **📋 Copy Link** to copy it to your clipboard
4. Paste the link in Discord, a chat, or anywhere else

### What the Recipient Sees

When someone opens the link, they see a styled page showing:
- The ship name
- The full save code
- A **📋 Copy Code to Clipboard** button
- A link to open Netquel.com

They can copy the code and use `/load [code]` in Netquel chat to load the ship. They **don't** need the extension installed to use the link.

---

## Export & Import

### Exporting Ships

Click **⬇ Export** in the File Manager toolbar (or **⬇ Export JSON** in Settings).

A selection dialog opens showing all your ships organized by folder with checkboxes:
- **Check/uncheck individual ships** to include or exclude them
- **Check/uncheck a folder header** to toggle all ships in that folder at once
- **Select All** / **Deselect All** buttons at the top
- The counter shows how many ships are selected

Once you've selected what you want, click **⬇ Export Selected**. A `.json` file will download to your computer. The file includes your username and Discord tag (if set) so recipients know who made the ships.

### Importing Ships

Click **⬆ Import** in the File Manager toolbar (or **⬆ Import JSON** in Settings). Select a `.json` file previously exported from Netquel Ship Manager.

**What happens during import:**
- Ships are added to your collection
- If an imported ship's **folder** already exists in your collection, the ship is placed into that existing folder (no duplicate folders are created)
- If a ship has the **same name** as one you already have, it's automatically renamed: `MyShip (1)`, `MyShip (2)`, etc.
- All imported ships start with Favorites turned off — you can manually star them afterward
- An alert tells you how many were added and how many were renamed due to conflicts

---

## Sidebar Mode

Sidebar mode lets you keep the extension open on the side of the Netquel game page while you play, without it covering the game.

### Opening the Sidebar

1. Navigate to [Netquel.com](https://netquel.com)
2. Open the extension popup
3. Click **📌 Sidebar on Netquel** at the bottom of the popup

The extension will appear as a **420px panel on the right side** of your screen. The Netquel page shifts left so nothing is covered.

### Closing the Sidebar

Click the **✕ Close panel** button that appears above the sidebar in the top-right area of the screen. Clicking it again will close the sidebar.

> **Note:** The sidebar opens as an iframe of the extension popup. The LOAD button in the sidebar will still send the load command to the Netquel tab correctly.

---

## Full Page Mode

Full page mode opens the extension in its own browser tab, giving you more screen space to work with — useful for organizing a large collection.

### Opening Full Page Mode

- Click the **🚀** logo at the top of the sidebar navigation (in the popup)
- Click **⤢ Full page** at the bottom of the popup
- Click **⤢ Expand** in the profile banner at the top of any pane

### Loading Ships from Full Page Mode

Because full page mode is in a separate tab, the LOAD button works differently. When you click LOAD:
- If Netquel.com is open in another tab, the ship will be loaded there
- If Netquel.com is not open, you'll get a message asking you to go there first

---

## Profile

The Profile pane lets you set personal information that appears throughout the extension.

### Opening Profile

Click the **avatar circle** at the bottom of the sidebar navigation, or click the small avatar in the profile banner at the top of any pane.

### Setting Your Username

Your username appears in the profile banner at the top of the Favorites and File Manager panes. It's also embedded in JSON exports so people who import your ships know who made them.

### Setting Your Discord Username (Optional)

Adding your Discord tag (e.g. `eliedr`) lets people who import your ships know how to reach you. It appears in the profile banner and in exported JSON files. It is completely optional.

### Setting a Profile Photo (Optional)

Click the large avatar circle in the Profile pane to upload an image from your computer. It will be cropped to a circle and appear in the sidebar nav and profile banners. The photo is stored locally on your device only — it is never uploaded anywhere.

### Saving Your Profile

After making changes, click **Save Profile**. The button briefly shows "Saved!" to confirm.

---

## Settings

Open Settings by clicking **⚙ SET** at the bottom of the sidebar.

### Text Size

Choose from four sizes:
- **S (Small)** — 11px base font, compact layout
- **M (Default)** — 12px base font, standard layout  
- **L (Large)** — 14px base font, easier to read
- **XL (X-Large)** — 16px base font, maximum readability

The entire UI scales when you change this — text, buttons, labels, everything. Your choice is saved automatically and remembered next time you open the extension.

### Data

- **⬇ Export JSON** — Opens the export selection dialog (same as in File Manager)
- **⬆ Import JSON** — Opens a file picker to import a JSON file (same as in File Manager)

### Edit Commands

See the [Customizing Commands](#customizing-commands) section below.

### 1–9 / F1–F9 Hotkeys (informational)

A brief reminder that hotkeys are active on Netquel.com. No settings to change here — hotkeys are always on.

### About

Shows the attribution, version info, and links to the Terms of Service and Privacy Policy pages.

---

## Customizing Commands

All chat commands can be renamed in **Settings → Edit Commands**. This lets you use shorter or different words if you prefer.

### How to Change a Command

1. Go to **⚙ Settings** → find the **Edit Commands** section
2. Each command has an input field showing its current name (e.g. `name`)
3. Change any field to your preferred word (e.g. change `name` to `n`)
4. Click **Save Commands**

**Rules:**
- The `.` prefix is always required and cannot be removed — you're only setting the word that comes after it
- Command names must be unique — you can't have two commands with the same word
- Names cannot be empty or contain spaces
- Maximum 20 characters per command

**Example:** If you change `name` to `n`, you would use `.n MyShip` instead of `.name MyShip`.

### Resetting to Defaults

Click **Reset Defaults** to restore all commands to their original names:

| Default Command | What it does |
|-----------------|-------------|
| `.name <ShipName>` | Save/update a ship with the latest /save code |
| `.load <ShipName>` | Load a ship into Netquel |
| `.list` | List all saved ship names |
| `.delete <ShipName>` | Delete a ship |
| `.help` | Show command reference |

---

## Legal & Privacy

### Privacy

The extension **does not collect any data**. Everything is stored locally using Chrome's built-in storage API on your device only. Nothing is ever sent to any server.

What is stored locally:
- Your ship names and save codes
- Your folder structure and colors
- Your username and Discord tag (if set)
- Your profile photo (if uploaded)
- Your command preferences and font size

When you uninstall the extension, all of this data is deleted.

For full details, click **Privacy Policy** in Settings.

### Open Source & Credit

This extension is open source. You may copy, modify, and redistribute it freely. If you do, you must:
- Give credit to **Relied** as the original author
- Include the contact info: `is.relied.on@gmail.com` or Discord: `eliedr`

For full terms, click **Terms of Service** in Settings.

---

## Troubleshooting

**"No save code found!" when using `.name`**  
Make sure you've typed `/save` in Netquel chat and the server has responded with a save code *in the current chat session*. The extension scans the visible chat for the most recent code. If the page was refreshed or the code scrolled out of view, type `/save` again.

**".name works but the ship doesn't show in the popup**  
Try closing and reopening the popup. The ship list refreshes when the popup opens. If it still doesn't appear, check the File Manager — ships saved via chat commands are placed in Ungrouped.

**LOAD button says "Open Netquel.com first!"**  
The extension sends the load command to your active browser tab. You need to be on `netquel.com` in the same tab you're using the popup from. Switch to your Netquel tab and try again, or use the sidebar mode to keep the extension open alongside the game.

**Number keys or F-keys do nothing**  
Make sure you're on `netquel.com`. Hotkeys only work on Netquel pages. If using **number key mode**, make sure the chat box is not focused — click somewhere else on the page first, then press the key. If using **function key mode**, press F1–F9 from anywhere. Also check that you have at least one ship in Favorites — if the slot is empty, the key does nothing.

**The sidebar doesn't open**  
The sidebar requires the content script to be running on the page. If you just installed the extension or navigated to Netquel.com right before trying, try refreshing the Netquel page first, then open the popup and click Sidebar.

**Export downloads an empty or broken file**  
Make sure you have at least one ship selected (checked) in the export dialog before clicking Export Selected. The "0 selected" counter in the dialog will show if nothing is checked.

**Importing a file says "Invalid JSON"**  
Only `.json` files exported from Netquel Ship Manager can be imported. Do not try to import a manually edited file unless you are sure the JSON is valid.

**Commands aren't working after customizing them**  
After saving custom commands in Settings, the new commands take effect immediately for new input. If you're on Netquel.com, the page's content script is updated automatically. If it's still not working, try refreshing the Netquel page.

---

*Netquel Ship Manager · Made by Relied · is.relied.on@gmail.com · Discord: eliedr*
