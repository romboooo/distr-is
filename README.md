# distr-is

# Справка по api

### Шаблон: $base_url/api/

## --------------------------Users ---------------------------

### POST /users

    Request Body:

```json
{
    "login": "string (3-50 chars)",
    "password": "string (min 6 chars)",
    "type": "ARTIST | LABEL | MODERATOR | ADMIN | PLATFORM"
}
```

    Response (201 Created):

```json
{
    "id": 1,
    "login": "john_doe",
    "type": "ARTIST",
    "registrationDate": "2024-01-15T10:30:00"
}
```

### GET /users

#### Получение всех пользователей

    Response (200 OK): Массив UserResponse

### GET /users/{id}

#### Получение пользователя по ID

    Path Param: id (Long)

    Response (200 OK): UserResponse

### GET /users/login/{login}

#### Поиск по логину

    Path Param: login (String)

    Response (200 OK): UserResponse

### GET /users/type/{type}

#### Фильтрация по типу пользователя

    Path Param: type (ARTIST/LABEL/MODERATOR/ADMIN/PLATFORM)

    Response (200 OK): Массив UserResponse

### DELETE /users/{id}

#### Удаление пользователя

    Path Param: id (Long)

    Response (204 No Content)

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

## --------------------------Labels ---------------------------

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

    Response (201 Created):

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

#### Получение списка всех лейблов

    Response (200 OK): Массив объектов LabelResponse

### GET /labels/{id}

#### #### Получение лейбла по ID

#### Параметры:

    id (Long) - идентификатор лейбла

    Response (200 OK): Объект LabelResponse

### GET /labels/by-user/{userId}

#### Получение лейбла по ID пользователя

    Path Param: userId (Long)

    Response (200 OK): LabelResponse

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

## --------------------------Releases ------------------------

### POST /releases

#### Создание нового релиза (альбом/сингл)

    Request Body:

```json
{
    "name": "Название релиза",
    "artistId": 1,
    "genre": "Жанр",
    "releaseType": "ALBUM | SINGLE | MAXI_SINGLE | EP | MIXTAPE",
    "labelId": 1
}
```

    Response (201 Created):

```json
{
    "id": 1,
    "name": "Название релиза",
    "artistId": 1,
    "artistName": "Имя артиста",
    "genre": "Жанр",
    "releaseUpc": 123456789012,
    "date": "2024-01-15T10:30:00",
    "moderationState": "ON_REVIEW | APPROVED | REJECTED | WAITING_FOR_CHANGES | DRAFT",
    "releaseType": "ALBUM",
    "labelId": 1,
    "labelName": "Название лейбла"
}
```

### GET /releases

#### Получение списка всех релизов

    Response (200 OK): Массив объектов ReleaseResponse

### GET /releases/{id}

#### Получение релиза по ID

#### Параметры:

    id (Long) - идентификатор релиза

    Response (200 OK): Объект ReleaseResponse

## --------------------------Songs ---------------------------

### POST /songs

#### Добавление новой песни в релиз

    Request Body:

```json
{
    "releaseId": 1,
    "artistIds": [1, 2],
    "musicAuthor": "Автор музыки",
    "parentalAdvisory": false,
    "songUpc": 987654321098,
    "metadata": "{\"key\": \"value\"}",
    "pathToFile": "/path/to/file.mp3",
    "songLengthSeconds": 240
}
```

    Response (201 Created):

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
    "pathToFile": "/path/to/file.mp3",
    "songLengthSeconds": 240
}
```

### GET /songs

#### Получение списка всех песен

    Response (200 OK): Массив объектов SongResponse

### GET /songs/{id}

#### Получение песни по ID

#### Параметры:

    id (Long) - идентификатор песни

    Response (200 OK): Объект SongResponse

#### Типы данных и перечисления

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

REJECTED           - Отклонено
APPROVED           - Одобрено
WAITING_FOR_CHANGES - Ожидает изменений
ON_REVIEW          - На рассмотрении
DRAFT              - Черновик
```

### ReleaseType

```text

SINGLE       - Сингл
MAXI_SINGLE  - Макси-сингл
EP           - EP (Extended Play)
ALBUM        - Альбом
MIXTAPE      - Микстейп
```

## --------------------------Auth-----------------------

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

## Pagination:

```shell
url + "?pageNumber=[integerStartedWithZero]&pageSize=[integer]"
```

**Response (200):**

```json
{
    "content": [],
    "currentPage": "x",
    "totalPages": "x",
    "totalElements": "x",
    "pageSize": "x"
}
```

### HTTP Коды

    200 OK: Успешный запрос

    201 Created: Ресурс успешно создан

    204 No Content: Успешный запрос без возвращаемых данных

    400 Bad Request: Ошибка валидации или неправильный запрос

    401 Unauthorized: Требуется аутентификация или токен недействителен

    404 Not Found: Ресурс не найден

    409 Conflict: Конфликт (например, дублирование уникальных данных)

    500 Internal Server Error: Внутренняя ошибка сервера
