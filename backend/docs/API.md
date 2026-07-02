# ECOSTAY API Documentation

Base URL: `http://127.0.0.1:5000/api`

## Endpoints

| Method | Endpoint | Description | Status codes |
| --- | --- | --- | --- |
| GET | `/health` | API health check | `200` |
| GET | `/stays` | List stays. Supports `minScore`, `maxPrice`, `location`, `sortBy`. | `200`, `400`, `500` |
| GET | `/stays/search?q=tirthan` | Search stays by name, location, tag, or description. | `200`, `400`, `500` |
| GET | `/stays/:id` | Get one stay by id. | `200`, `404`, `500` |
| GET | `/reviews/:id` | Get one review by id. | `200`, `404`, `500` |
| POST | `/stays` | Create a stay listing. | `201`, `400`, `500` |
| PATCH | `/stays/:id` | Update a stay listing. | `200`, `400`, `404`, `500` |
| DELETE | `/stays/:id` | Delete a stay listing. | `204`, `404`, `500` |
| GET | `/destinations` | List destination cards. | `200`, `500` |
| GET | `/experiences` | List experiences. Supports `type`. | `200`, `500` |
| GET | `/bookings` | List in-memory bookings. | `200`, `500` |
| POST | `/bookings` | Create a booking reservation. | `201`, `400`, `404`, `500` |

## Example POST `/stays`

```json
{
  "id": "bamboo-haven",
  "name": "Bamboo Haven",
  "location": "Wayanad, Kerala",
  "price": 3900,
  "rating": 4.8,
  "reviews": 42,
  "score": 93,
  "tag": "Forest stay",
  "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
  "description": "A quiet bamboo cottage run by a local family near forest trails."
}
```

## Error Format

```json
{
  "success": false,
  "message": "Invalid stay payload",
  "errors": ["price must be a number"]
}
```
