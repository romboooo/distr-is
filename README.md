# distr-is

# Справка по api

### Шаблон: $base_url/api/

## Auth

### POST /register

#### Регистрация нового пользователя

**Правила доступа:**

-   ARTIST, LABEL: может быть создан кем угодно (даже неаутентифицированным пользователем)
-   MODERATOR: только ADMIN или MODERATOR
-   ADMIN: только ADMIN
-   PLATFORM: только ADMIN

**Request Body:**

```json
{
    "login": "string (3-50 chars)",
    "password": "string (min 6 chars)",
    "type": "ARTIST | LABEL | MODERATOR | ADMIN | PLATFORM"
}
```

**Response (201 Created):**

```json
{
    "id": 1,
    "login": "john_doe",
    "type": "ARTIST",
    "registrationDate": "2024-01-15T10:30:00"
}
```

**Response (403 Forbidden):**

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 403,
    "error": "Forbidden",
    "message": "Only ADMIN can create ADMIN users"
}
```

### POST /login

#### Аутентификация пользователя

**Request Body:**

```json
{
    "login": "string",
    "password": "string"
}
```

**Response (200 OK):**

```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "user": {
        "id": 1,
        "login": "john_doe",
        "type": "ARTIST",
        "registrationDate": "2024-01-15T10:30:00"
    }
}
```

**Response (403 Forbidden):**

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 403,
    "error": "Forbidden",
    "message": "Invalid login or password"
}
```

### GET /me

#### Получение информации о текущем аутентифицированном пользователе

#### Требуется аутентификация: Да (токен в заголовке Authorization)

**Response (200 OK):**

```json
{
    "id": 1,
    "login": "john_doe",
    "type": "ARTIST",
    "registrationDate": "2024-01-15T10:30:00"
}
```

**Response (401 Unauthorized):**

```json
{
    "error": "Unauthorized",
    "message": "User no longer exists"
}
```

## --------------------------Artists ---------------------------

### POST /artists

#### Создание артиста

#### Request Body:

```json
{
    "name": "Artist Name",
    "country": "USA",
    "realName": "John Doe",
    "userId": 1
}
```

    Response (201 Created):

```json
{
    "id": 1,
    "name": "Artist Name",
    "labelName": "Label Contact Name",
    "country": "USA",
    "realName": "John Doe",
    "userId": 1,
    "userLogin": "john_doe"
}
```

### GET /artists

#### Получение всех артистов

    Response (200 OK): Массив ArtistResponse

### GET /artists/{id}

#### Получение артиста по ID

    Path Param: id (Long)

    Response (200 OK): ArtistResponse

### GET /artists/by-user/{userId}

#### Получение артиста по ID пользователя

    Path Param: userId (Long)

    Response (200 OK): ArtistResponse

## Artists

### GET /artists/{artistId}/releases

**Path Param:** `artistId` (Long)

**Parameters:**

-   `pageNumber`: номер страницы (начинается с 0)
-   `pageSize`: размер страницы

**Response (200 OK):**

```json
{
    "content": [
        {
            "id": 1,
            "name": "Название релиза",
            "artistId": 1,
            "artistName": "Имя артиста",
            "genre": "Жанр",
            "releaseUpc": 123456789012,
            "date": "2024-01-15T10:30:00",
            "moderationState": "DRAFT",
            "releaseType": "ALBUM",
            "labelId": 1,
            "labelName": "Название лейбла",
            "coverPath": "/path/to/cover.jpg"
        }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 10
}
```

**Response (404 Not Found):**

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 404,
    "error": "Not Found",
    "message": "Artist not found with id: 123"
}
```

## Labels

### POST /labels

#### Создание нового лейбла

#### Request Body:

```json
{
    "country": "Страна",
    "contactName": "Имя контактного лица",
    "phone": "Номер телефона",
    "userId": 1
}
```

**Response (201 Created):**

```json
{
    "id": 1,
    "country": "Страна",
    "contactName": "Имя контактного лица",
    "phone": "Номер телефона",
    "userId": 1,
    "userLogin": "логин пользователя"
}
```

### GET /labels

#### Получение списка всех лейблов (с пагинацией)

**Parameters:**

-   `pageNumber`: номер страницы (начинается с 0)
-   `pageSize`: размер страницы

**Response (200 OK):**

```json
{
    "content": [
        {
            "id": 1,
            "country": "Страна",
            "contactName": "Имя контактного лица",
            "phone": "Номер телефона",
            "userId": 1,
            "userLogin": "логин пользователя"
        }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 10
}
```

### GET /labels/{id}

#### Получение лейбла по ID

**Path Param:** `id` (Long)

**Response (200 OK):**

```json
{
    "id": 1,
    "country": "Страна",
    "contactName": "Имя контактного лица",
    "phone": "Номер телефона",
    "userId": 1,
    "userLogin": "логин пользователя"
}
```

### GET /labels/by-user/{userId}

#### Получение лейбла по ID пользователя

**Path Param:** `userId` (Long)

**Response (200 OK):**

```json
{
    "id": 1,
    "country": "Страна",
    "contactName": "Имя контактного лица",
    "phone": "Номер телефона",
    "userId": 1,
    "userLogin": "логин пользователя"
}
```

## Releases -

### POST /releases/draft

#### Создание черновика релиза

**Request Body:**

```json
{
    "name": "Название релиза",
    "artistId": 1,
    "genre": "Жанр",
    "releaseType": "ALBUM | SINGLE | MAXI_SINGLE | EP | MIXTAPE",
    "labelId": 1
}
```

**Response (201 Created):**

```json
{
    "id": 1,
    "name": "Название релиза",
    "artistId": 1,
    "artistName": "Имя артиста",
    "genre": "Жанр",
    "releaseUpc": 123456789012,
    "date": "2024-01-15T10:30:00",
    "moderationState": "DRAFT",
    "releaseType": "ALBUM",
    "labelId": 1,
    "labelName": "Название лейбла",
    "coverPath": null
}
```

### GET /releases

#### Получение списка всех релизов (с пагинацией)

**Parameters:**

-   `pageNumber`: номер страницы (начинается с 0)
-   `pageSize`: размер страницы

**Response (200 OK):**

```json
{
    "content": [
        {
            "id": 1,
            "name": "Название релиза",
            "artistId": 1,
            "artistName": "Имя артиста",
            "genre": "Жанр",
            "releaseUpc": 123456789012,
            "date": "2024-01-15T10:30:00",
            "moderationState": "DRAFT",
            "releaseType": "ALBUM",
            "labelId": 1,
            "labelName": "Название лейбла",
            "coverPath": "/path/to/cover.jpg"
        }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 10
}
```

### GET /releases/{id}

#### Получение релиза по ID

**Path Param:** `id` (Long)

**Response (200 OK):**

```json
{
    "id": 1,
    "name": "Название релиза",
    "artistId": 1,
    "artistName": "Имя артиста",
    "genre": "Жанр",
    "releaseUpc": 123456789012,
    "date": "2024-01-15T10:30:00",
    "moderationState": "DRAFT",
    "releaseType": "ALBUM",
    "labelId": 1,
    "labelName": "Название лейбла",
    "coverPath": "/path/to/cover.jpg"
}
```

### GET /releases/{releaseId}/songs

#### Получение всех песен релиза

**Path Param:** `releaseId` (Long)

**Response (200 OK):**

```json
[
    {
        "id": 1,
        "releaseId": 1,
        "releaseName": "Название релиза",
        "artistIds": [1, 2],
        "artistNames": ["Имя артиста 1", "Имя артиста 2"],
        "musicAuthor": "Автор музыки",
        "parentalAdvisory": false,
        "streams": 0,
        "songUpc": 987654321098,
        "metadata": "{\"key\": \"value\"}",
        "pathToFile": "/tmp-songs/song_1_1642345678.mp3",
        "songLengthSeconds": 240
    },
    {
        "id": 2,
        "releaseId": 1,
        "releaseName": "Название релиза",
        "artistIds": [1],
        "artistNames": ["Имя артиста 1"],
        "musicAuthor": "Другой автор",
        "parentalAdvisory": true,
        "streams": 15,
        "songUpc": 876543210987,
        "metadata": "{}",
        "pathToFile": "/tmp-songs/song_2_1642345680.mp3",
        "songLengthSeconds": 198
    }
]
```

**Response (404 Not Found):**

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 404,
    "error": "Not Found",
    "message": "Release not found"
}
```

### POST /releases/{releaseId}/songs

#### Добавление песни в релиз

**Path Param:** `releaseId` (Long)

**Request Body:**

```json
{
    "artistIds": [1, 2],
    "musicAuthor": "Автор музыки",
    "parentalAdvisory": false,
    "metadata": "{\"key\": \"value\"}"
}
```

**Response (201 Created):**

```json
{
    "id": 1,
    "releaseId": 1,
    "releaseName": "Название релиза",
    "artistIds": [1, 2],
    "artistNames": ["Имя артиста 1", "Имя артиста 2"],
    "musicAuthor": "Автор музыки",
    "parentalAdvisory": false,
    "streams": 0,
    "songUpc": 987654321098,
    "metadata": "{\"key\": \"value\"}",
    "pathToFile": null,
    "songLengthSeconds": null
}
```

### POST /releases/songs/{songId}/file

#### Загрузка аудиофайла для песни

**Path Param:** `songId` (Long)
**Form Data:** `file` (MP3 file)

**Response (200 OK):**

```json
"/tmp-songs/song_1_1642345678.mp3"
```

### POST /releases/{releaseId}/cover

#### Загрузка обложки для релиза

**Path Param:** `releaseId` (Long)
**Form Data:** `file` (image file)

**Response (200 OK):**

```json
"/tmp-covers/cover_release_1_1642345678.jpg"
```

### GET /releases/{releaseId}/cover

#### Получение обложки релиза

**Path Param:** `releaseId` (Long)

**Response (200 OK):**
Binary image data. The `Content-Type` header is set to the MIME type of the image (e.g., `image/jpeg`, `image/png`).

**Response (404 Not Found):**
If release not found or cover image not set:

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 404,
    "error": "Not Found",
    "message": "Cover image not found for release with id: 123"
}
```

**Response (400 Bad Request):**
If cover path has invalid format:

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Invalid cover path format: invalid_path"
}
```

**Response (500 Internal Server Error):**
If file retrieval fails:

```json
{
    "timestamp": "2024-01-15T10:30:00",
    "status": 500,
    "error": "Internal Server Error",
    "message": "Failed to retrieve cover image from storage"
}
```

### POST /releases/{releaseId}/request-moderation

#### Отправка релиза на модерацию

**Path Param:** `releaseId` (Long)

**Response (200 OK):**

```json
{
    "id": 1,
    "name": "Название релиза",
    "artistId": 1,
    "artistName": "Имя артиста",
    "genre": "Жанр",
    "releaseUpc": 123456789012,
    "date": "2024-01-15T10:30:00",
    "moderationState": "ON_REVIEW",
    "releaseType": "ALBUM",
    "labelId": 1,
    "labelName": "Название лейбла",
    "coverPath": "/path/to/cover.jpg"
}
```

## Songs -

### GET /songs

#### Получение списка всех песен (с пагинацией)

**Parameters:**

-   `pageNumber`: номер страницы (начинается с 0)
-   `pageSize`: размер страницы

**Response (200 OK):**

```json
{
    "content": [
        {
            "id": 1,
            "releaseId": 1,
            "releaseName": "Название релиза",
            "artistIds": [1, 2],
            "artistNames": ["Имя артиста 1", "Имя артиста 2"],
            "musicAuthor": "Автор музыки",
            "parentalAdvisory": false,
            "streams": 0,
            "songUpc": 987654321098,
            "metadata": "{\"key\": \"value\"}",
            "pathToFile": "/tmp-songs/song_1_1642345678.mp3",
            "songLengthSeconds": 240
        }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 10
}
```

### GET /songs/{id}

#### Получение песни по ID

**Path Param:** `id` (Long)

**Response (200 OK):**

```json
{
    "id": 1,
    "releaseId": 1,
    "releaseName": "Название релиза",
    "artistIds": [1, 2],
    "artistNames": ["Имя артиста 1", "Имя артиста 2"],
    "musicAuthor": "Автор музыки",
    "parentalAdvisory": false,
    "streams": 0,
    "songUpc": 987654321098,
    "metadata": "{\"key\": \"value\"}",
    "pathToFile": "/tmp-songs/song_1_1642345678.mp3",
    "songLengthSeconds": 240
}
```


### GET /moderation/pending

#### Получение списка релизов, ожидающих модерацию (статус ON_MODERATION)

**Response (200 OK):**

```json
{
  "content": [
    {
      "id": 6,
      "name": "New Album 1",
      "artistId": 1,
      "genre": "Pop",
      "releaseUpc": 123456789025,
      "date": "2023-11-15T00:00:00",
      "moderationState": "ON_MODERATION",
      "releaseType": "ALBUM",
      "labelId": 1,
      "coverPath": null
    }
  ],
  "currentPage": 0,
  "totalPages": 1,
  "totalElements": 1,
  "pageSize": 10
}

```
**401 Unauthorized** - если токен не передан или невалиден

**403 Forbidden** - если у пользователя нет роли MODERATOR или ADMIN


### POST /api/moderation
#### роведение модерации релиза. Создает запись в таблице on_moderation и обновляет moderation_state релиза.
**request body(example):**

```json
{
  "releaseId": 6,
  "moderatorId": 1,
  "comment": "Отличный релиз, всё соответствует требованиям",
  "moderationState": "APPROVED"
}
```

**201 Created:**
```json
{
  "id": 5,
  "comment": "Отличный релиз, всё соответствует требованиям",
  "moderatorId": 1,
  "moderatorName": "Alex Johnson",
  "releaseId": 6,
  "releaseName": "New Album 1",
  "date": "2026-01-12T20:02:01.247099"
}
```
***400 Bad Request*** - если:

    релиз уже промодерирован (статус не ON_MODERATION или ON_REVIEW)

    пытаются установить некорректный статус (ON_MODERATION, ON_REVIEW, DRAFT)

    не пройдена валидация полей

***401 Unauthorized*** - если токен не передан или невалиден

***403 Forbidden*** - если у пользователя нет роли MODERATOR или ADMIN

***404 Not Found*** - если релиз или модератор не найдены


### GET /api/moderation/history/{releaseId}

#### Получение истории модерации для конкретного релиза

releaseId (required) - ID релиза

***200:***
```json
[
  {
    "id": 5,
    "comment": "Отличный релиз, всё соответствует требованиям",
    "moderatorId": 1,
    "moderatorName": "Alex Johnson",
    "releaseId": 6,
    "releaseName": "New Album 1",
    "date": "2026-01-12T20:02:01.247099"
  }
]
```

***401 Unauthorized*** - если токен не передан или невалиден

***403 Forbidden*** - если у пользователя нет прав на просмотр (MODERATOR/ADMIN/LABEL/ARTIST)

***404 Not Found*** - если релиз не найден (возвращает пустой массив, если нет записей модерации)


## Статусы релиза и их переходы

```text
DRAFT → ON_MODERATION → [APPROVED | REJECTED | WAITING_FOR_CHANGES]
```
## Pagination

```shell
url + "?pageNumber=[integerStartedWithZero]&pageSize=[integer]"
```

**Response Structure (200 OK):**

```json
{
    "content": [],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 1,
    "pageSize": 10
}
```

## Типы данных и перечисления

### UserType

```text
ARTIST    - Артист
LABEL     - Лейбл
MODERATOR - Модератор
ADMIN     - Администратор
PLATFORM  - Платформа
```

### ModerationState

```text
DRAFT              - Черновик
ON_REVIEW          - На рассмотрении
APPROVED           - Одобрено
REJECTED           - Отклонено
WAITING_FOR_CHANGES - Ожидает изменений
```

### ReleaseType

```text
SINGLE      - Сингл
MAXI_SINGLE - Макси-сингл
EP          - EP (Extended Play)
ALBUM       - Альбом
MIXTAPE     - Микстейп
```

## HTTP Коды

-   **200 OK**: Успешный запрос
-   **201 Created**: Ресурс успешно создан
-   **204 No Content**: Успешный запрос без возвращаемых данных
-   **400 Bad Request**: Ошибка валидации или неправильный запрос
-   **401 Unauthorized**: Требуется аутентификация или токен недействителен
-   **403 Forbidden**: Доступ запрещен
-   **404 Not Found**: Ресурс не найден
-   **409 Conflict**: Конфликт (например, дублирование уникальных данных)
-   **500 Internal Server Error**: Внутренняя ошибка сервера
