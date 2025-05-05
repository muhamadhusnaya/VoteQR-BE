# BackEnd Framework - VoteQR (Documentation)

#### `CTRL + SHIFT + V` to view this README.md

## Clone and Install
- open terminal and direct to your folder project
- run `git clone <thisLinkRepository>` in terminal to clone this repo
- run `cd <repoName>`
- run `npm install` to install any dependencies
- to view the development, run `npm run dev`

## Reset Database
- to reset database, run `npm run reset-db`


## API Endpoints

### 🔐 Authentication (`/auth`)

- **POST** `/auth/login`  
  Login user dan mendapatkan akses token.

- **POST** `/auth/logout`  
  Logout user dan menghapus sesi/token.

---

### 🔑 Token Management (`/api/tokens`)

- **POST** `/api/tokens/generate`  
  Generate token baru.

- **GET** `/api/tokens/list`  
  Melihat daftar semua token yang tersedia.

- **DELETE** `/api/tokens/:id`  
  Menghapus token berdasarkan ID.

---

### ⏳ Vote History (`/api/voting-history`)

- **GET** `/api/voting-history`
  Voting history dengan JOIN ke Tabel.

- **POST** `/api/voting-history`
  Voting baru dengan validasi IP.


---

### 🧑‍🤝‍🧑 Teams (`/api/teams`)

- **GET** `/api/teams`
  Get all teams

- **GET** `/api/teams/:id`
  Get a team by ID

- **POST** `/api/teams`
  Add a new team

- **PUT** `/api/teams/:id`
  Update a team

- **DELETE** `/api/teams/:delete`
  Delete a team

---

### 📊 Stats (`/api/stats`)

- **GET** `/api/stats`
  Get All Stats