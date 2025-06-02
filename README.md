# 💬 Groups

## Introduction

**"Groups"** is a free and open-source chat application built on the Nostr protocol, utilizing the NIP-29 to support relay-based groups with specific moderation capabilities.
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
  - ✅ Zap to messages sender (with wallet selection).
  - ✅ Reaction to messages.
  - ✅ Upload images.
  - ✅ Create and manage polls (single/multiple choice, vote tracking).
  - 🚧 Mention users in messages.
  - 🚧 Pin important messages.
  - 🚧 Receive notifications for new messages.
  - 🚧 Attach files.
  - 🚧 Create and manage threads.

- **Group Moderation**:
  - ✅ Create new groups with custom settings.
    - ✅ Create group (kind 9007).
  - ✅ Edit and customize existing groups.
    - ✅ Update group metadata (kind 9002).
    - ✅ Update group status (kind 9006).
    - ✅ Delete group (kind 9008).
  - ✅ View and manage group members and admins.
    - ✅ View members (kind 39002).
    - ✅ View admins (kind 39001).
    - ✅ Remove user (kind 9001).
    - ✅ Put user (kind 9000).
  - ✅ Moderate group content and messages.
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
  - 9000 put-user ✅
  - 9001 remove-user ✅
  - 9002 edit-metadata ✅
  - 9003 add-admin 🚧
  - 9004 remove-admin 🚧
  - 9005 delete-event ✅
  - 9006 edit-group-status ✅
- ### Chat:
  - 7 send-reaction ✅
  - 9 send-message ✅
  - 1018 create-poll ✅
  - 9735 zap (Lightning payment) ✅
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
