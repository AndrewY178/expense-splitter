# expense-splitter

Mobile-first expense splitting app with Spring Boot (Java 17), PostgreSQL, and a React + Vite + Tailwind frontend.

### What’s implemented (MVP)
- **Auth**: register + login (JWT)
- **Groups**: create group, list groups, add/remove members (creator-only)
- **Expenses**: create expense with **custom split amounts per user**
- **Settlements**: `GET /api/groups/{groupId}/settlements` shows “who owes whom” based on unpaid splits
- **Swagger**: OpenAPI UI

---

## Local setup

### Prerequisites
- **Java**: 17+
- **Node**: 18+ (recommended)
- **Docker**: for PostgreSQL (recommended)

### Start PostgreSQL (Docker)

```bash
cd backend
docker compose up -d
```

This uses:
- DB: `expense_splitter`
- User: `exp_user`
- Pass: `exp_pass`
- Port: `5432`

### Run backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

### Run frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## API docs (Swagger)

Once the backend is running, open:
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

---

## Quick manual test flow (curl)

### 1) Register

```bash
curl -sS -X POST http://localhost:8080/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 2) Login (get token)

```bash
TOKEN=$(curl -sS -X POST http://localhost:8080/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}' | jq -r .token)
echo "$TOKEN"
```

### 3) Create a group

```bash
curl -sS -X POST http://localhost:8080/api/groups \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Trip"}'
```

### 4) List groups

```bash
curl -sS http://localhost:8080/api/groups -H "Authorization: Bearer $TOKEN"
```

### 5) Create an expense with splits

Replace `GROUP_ID` and member user IDs.

```bash
curl -sS -X POST http://localhost:8080/api/groups/GROUP_ID/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "description":"Dinner",
    "amount": 60.00,
    "groupId": GROUP_ID,
    "splits": {
      "1": 30.00,
      "2": 30.00
    }
  }'
```

### 6) View settlements

```bash
curl -sS http://localhost:8080/api/groups/GROUP_ID/settlements \
  -H "Authorization: Bearer $TOKEN"
```

---

## Running tests

### Backend

```bash
cd backend
mvn test
```

### Frontend

```bash
cd frontend
npm test -- --run
```
