# 💬 Groups

## Introduction

**"Groups"** is a free and open-source chat application built on the Nostr protocol, utilizing the NIP-29 standard to support relay-based groups with specific moderation capabilities.
This client enables users to participate in groups managed by relays, where access and participation are governed by rules enforced by the relay.

## Features

- **User-Friendly Interface**:
  - ✅ Clean and intuitive design.
  - ✅ Easy navigation and group management.
  - ✅ Responsive layout for all devices.
  - ✅ Animated transitions and effects.
  - ✅ Real-time updates.
  - ✅ Built-in caching and data persistence.
  - ✅ Image and URL previews.
  - ✅ Video previews for direct links and YouTube.
  - ✅ Dark mode support.
  - 🚧 Customizable settings.
  - 🚧 Offline support.
  - 🚧 PWA support.
  - 🚧 Rich text formatting.
- **Messaging**:
  - ✅ View and join existing groups.
  - ✅ Send and delete messages.
  - ✅ React to messages with emojis.
  - ✅ Reply to messages.
  - ✅ Zap to messages sender.
  - ✅ Reaction to message (kind:7 in supported relay).
  - ✅ upload images.
  - 🚧 Mention users in messages.
  - 🚧 Pin important messages.
  - 🚧 Receive notifications for new messages.
  - 🚧 Attach files.
  - 🚧 Create and manage threads.
  - 🚧 Create and manage polls.
- **Group Moderation**:
  - ✅ Create new groups with custom settings.
    - ✅ Create group (kind 9007).
  - ✅ Edit and customize existing groups.
    - ✅ Update group metadata (kind 9002).
    - ✅ Update group status (kind 9006).
    - ✅ Delete group (kind 9008).
  - 🚧 View and manage group members and admins.
    - ✅ View members (kind 39002).
    - ✅ View admins (kind 39001).
    - ✅ Remove user (kind 9001).
    - 🚧 Add user (kind 9000).
  - 🚧 Moderate group content and messages.
    - ✅ Add admin permission (kind 9003).
    - ✅ Remove admin permission (kind 9004).
    - ✅ Delete message (kind 9005).
    - 🚧 Ban user.
    - 🚧 Change member to admin.
  - 🚧 Create and manage private groups.
    - ✅ Create private groups.
    - 🚧 Join private groups.

## Live Demo

You can access the live demo of **"Groups"** at the following URL:

- [groups.nip29.com](https://groups.nip29.com)

## Supported Kinds:

- ### Moderation:
  - 9000 add-user 🚧
  - 9001 remove-user 🚧
  - 9002 edit-metadata ✅
  - 9003 add-permission ✅
  - 9004 remove-permission ✅
  - 9005 delete-event ✅
  - 9006 edit-group-status ✅
- ### Chat:
  - 7 send-reaction ✅
  - 9 send-message ✅
- ### Group:
  - 9007 create-group ✅
  - 9008 delete-group ✅
  - 9021 join request ✅
  - 9022 leave request ✅
  - 39000 group metadata ✅
  - 39001 group admins ✅
  - 39002 group members ✅

## Installation

To install and run **"Groups"** locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/max21dev/groups.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd groups
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Usage

Once the development server is running, you can access the chat client through your web browser. The interface will allow you to create or join groups, participate in discussions, and manage group settings.

## Libraries and Tools Used

- **Vite:** Frontend build tool and development server. [→](https://github.com/vitejs/vite)
- **TypeScript**: Strongly typed programming language that builds on JavaScript. [→](https://github.com/microsoft/TypeScript)
- **React**: JavaScript library for building user interfaces. [→](https://github.com/facebook/react)
- **Tailwind CSS**: Utility-first CSS framework for styling. [→](https://github.com/tailwindlabs/tailwindcss)
- **Shadcn UI**: Beautiful designed components. [→](https://github.com/shadcn-ui/ui)
- **Zustand**: Bear necessities for state management in React. [→](https://github.com/pmndrs/zustand)
- **nostr-tools**: Tools for developing Nostr clients. [→](https://github.com/nbd-wtf/nostr-tools)
- **NDK (Nostr Dev Kit)**: NDK is a nostr development kit that makes the experience of building Nostr-related applications. [→](https://github.com/nostr-dev-kit/ndk)
- **Nostr-Hooks**: Nostr-Hooks is a stateful wrapper library of React hooks around NDK. [→](https://github.com/ostyjs/nostr-hooks)

  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-%23FF0080.svg?style=for-the-badge&logoColor=white)
  ![Zustand](https://img.shields.io/badge/zustand-%235A67D8.svg?style=for-the-badge&logoColor=white)
  ![Nostr Tools](https://img.shields.io/badge/nostr-tools-%23FF0080.svg?style=for-the-badge&logoColor=white)
  ![NDK](https://img.shields.io/badge/NDK-%23B266FF.svg?style=for-the-badge&logoColor=white)
  ![Nostr Hooks](https://img.shields.io/badge/Nostr%20Hooks-%2300CC66.svg?style=for-the-badge&logoColor=white)

## Contribution

We welcome contributions from the community! If you'd like to contribute, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

Special thanks to the Nostr protocol community and all contributors who helped make this project possible.
