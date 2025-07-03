# 📘 API Documentation

## 📂 User Routes

## Base URL
`https://threads-backend-tp0d.onrender.com`

### 📝 Register User
**POST** `/api/users/signup`

#### Request
```json
{
  "name": "Aadil Khan",
  "email": "aadil@example.com",
  "username": "aadilkhan",
  "password": "NewPass456"
}
```

#### Response
```json
{
  "_id": "userId",
  "name": "Aadil Khan",
  "username": "aadilkhan",
  "email": "aadil@example.com",
  "bio": "",
  "profilePic": "",
  "followers": [],
  "following": []
}
```

---

### 🔐 Login User
**POST** `/api/users/login`

#### Request
```json
{
  "username": "aadilkhan",
  "password": "NewPass456"
}
```

#### Response
```json
{
  "_id": "userId",
  "name": "Aadil Khan",
  "username": "aadilkhan",
  "email": "aadil@example.com",
  "bio": "",
  "profilePic": "",
  "followers": [],
  "following": []
}
```

---

### 🚪 Logout User
**POST** `/api/users/logout`

#### Response
```json
{
  "message": "User logged out successfully!!"
}
```

---

### ➕ Follow / ➖ Unfollow User
**PUT** `/api/users/follow/:id`

#### Response (Followed)
```json
{
  "user": { "_id": "userId", "username": "aadilkhan" },
  "message": "You have followed friend123",
  "status": true
}
```

#### Response (Unfollowed)
```json
{
  "user": { "_id": "userId", "username": "aadilkhan" },
  "message": "You have unfollowed friend123",
  "status": false
}
```

---

### 🔄 Update User Profile
**PUT** `/api/users/update/:id`

#### Request
```json
{
  "name": "Aadil Updated",
  "username": "aadil_updated",
  "email": "new@example.com",
  "password": "Updated123",
  "bio": "New bio",
  "profilePic": "https://cloudinary.com/...png"
}
```

#### Response
```json
{
  "_id": "userId",
  "name": "Aadil Updated",
  "username": "aadil_updated",
  "email": "new@example.com",
  "bio": "New bio",
  "profilePic": "https://cloudinary.com/...png",
  "followers": [],
  "following": []
}
```

---

### 🔍 Get User by Username
**GET** `/api/users/profile/:username`

#### Response
```json
{
  "_id": "userId",
  "name": "Aadil Khan",
  "username": "aadilkhan",
  "posts": [ { "_id": "postId", "text": "Hello World" } ]
}
```

---

### 🔎 Search Users
**GET** `/api/users/all?filter=keyword`

#### Response
```json
[
  {
    "_id": "userId",
    "name": "Aadil Khan",
    "username": "aadilkhan"
  }
]
```

---

## 📂 Post Routes

### ✍️ Create Post
**POST** `/api/posts/create`

#### Request
```json
{
  "postedBy": "userId",
  "text": "My first post!",
  "img": "https://cloudinary.com/...png"
}
```

#### Response
```json
{
  "savedPost": { "_id": "postId", "text": "My first post!" },
  "user": { "_id": "userId", "username": "aadilkhan" }
}
```

---

### 📥 Get Post by ID
**GET** `/api/posts/:id`

#### Response
```json
{
  "_id": "postId",
  "text": "My first post!",
  "postedBy": { "_id": "userId", "username": "aadilkhan" },
  "likes": [],
  "replies": []
}
```

---

### ❌ Delete Post
**DELETE** `/api/posts/delete/:id`

#### Response
```json
{
  "message": "Post deleted successfully"
}
```

---

### ❤️ Like / 💔 Unlike Post
**PUT** `/api/posts/like/:id`

#### Response (Liked)
```json
{
  "message": "Post liked successfully",
  "user": { "_id": "userId", "username": "aadilkhan" }
}
```

#### Response (Unliked)
```json
{
  "message": "Post unliked successfully",
  "user": { "_id": "userId", "username": "aadilkhan" }
}
```

---

### 💬 Reply to Post
**PUT** `/api/posts/reply/:id`

#### Request
```json
{
  "text": "Nice post!"
}
```

#### Response
```json
{
  "message": "Reply added to the post successfully",
  "reply": {
    "userId": "userId",
    "text": "Nice post!",
    "username": "aadilkhan"
  }
}
```

---

### 📰 Feed (Following Users’ Posts)
**GET** `/api/posts/feed`

#### Response
```json
[
  {
    "_id": "postId",
    "text": "A post from someone I follow",
    "postedBy": {
      "_id": "userId",
      "username": "frienduser"
    }
  }
]
```

---

**Note:** All protected routes (except login/signup/getPost/profile) require authentication via HTTP-only JWT cookies.