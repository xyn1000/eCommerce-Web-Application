# COMP5347 WebDev 18 Backend API Documentation

## Basic structure:

- API router: for RESTful requests for data CRUD operations
    - Path: `/api/*`, exclude `/api/auth/*`
- AUTH router: for authentication related, complex operations
    - Path: `/api/auth/*`

**Notice:** All requests/responses are designed with **JSON** format in mind. 
            Preliminary tests shows that XML *may* work, but not suggested at the moment.

---

## API Router

### Users

Path: `/api/users/*`

**Create**

Not supported. Please use AUTH router's registration endpoint for user creation.

**Read**

Endpoint: `GET /api/users/<userID>`

Authentication: Not required.

Request body: 

```
None
```

Response: 

Object: Requested user object. Password will not be included.

```
{
    _id,
    email, 
    firstName, 
    lastName,
    ...
}
```

Error: 

- `HTTP 404`: Cannot find user.
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

**Update**

```
IN PROGRESS: This feature is not yet finished, and may subject to unlikely event of changes.
```

Endpoint: `PUT /api/users/<userID>`

Authentication: MUST be logged in (checked by session.user) as the same user. Editing other users' profile is not allowed.

Request body: 

Full user object. Please refer to Data Structure documentation. Be noted that password in the user object is required, and refer to the CURRENT user password. For updating user password, please refer to AUTH Router.

```
{
    _id,
    email, 
    firstName, 
    lastName,
    password,
    ...
}
```

Response: 

Object: Updated user object. Password will not be included.

```
{
    _id,
    email, 
    firstName, 
    lastName,
    ...
}
```

Error: 
- `HTTP 403`: Authentication failed, user not logged in
              as the editing one, or password incorrect.
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

**Delete**

Removing user is not allowed through API.

---

### Listing

Path: `/api/listings/*`

**Create**

Endpoint: `POST /api/listings`

Authentication: MUST be logged in (checked by session.user). Listing will be posted with seller being current user.

Request body: 

Full listing object (except seller and reviews). Please refer to Data Structure documentation.

```
{
    title: newTitle,
    brand: newBrand,
    image: newImage,
    stock: newStock,
    ...
}
```

Response: 

Object: Created listing object.

```
{
    title: newTitle,
    brand: newBrand,
    image: newImage,
    stock: newStock,
    ...
}
```

Error: 
- `HTTP 403`: Authentication failed, user not logged in.
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

**Read ALL**

Endpoint: `GET /api/listings`

Authentication: Not required.

Request body: 

```
None
```

Response: 

Array: Array of all listing objects.

```
[
    {
        title: newTitle,
        brand: newBrand,
        image: newImage,
        stock: newStock,
        ...
    },
    {
        title: newTitle,
        brand: newBrand,
        image: newImage,
        stock: newStock,
        ...
    }
]
```

Error: 
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

**Read ONE**

Endpoint: `GET /api/listings/<listingID>`

Authentication: Not required.

Request body: 

```
None
```

Response: 

Object: Requested listing object.

```
{
    title: newTitle,
    brand: newBrand,
    image: newImage,
    stock: newStock,
    ...
}
```

Error: 

- `HTTP 404`: Cannot find listing.
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

**Read QUERY(Condition)**

```
UNDER CONSTRUCTION
This endpoint is not implemented yet
```

Endpoint: `GET /api/listings<queries>`

E.g. `GET /api/listings?disabled=false`

Authentication: Not required.

Request body: 

```
None
```

Response: 

Array: Array of all listing objects that match the query.

```
[
    {
        title: newTitle,
        brand: newBrand,
        image: newImage,
        stock: newStock,
        ...
    },
    {
        title: newTitle,
        brand: newBrand,
        image: newImage,
        stock: newStock,
        ...
    }
]
```

Error: 
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

**Update**

Endpoint: `PUT /api/listings`

Authentication: MUST be logged in (checked by session.user) as the original seller.

Request body: 

Full listing object (except seller and reviews). Please refer to Data Structure documentation.

```
{
    title: newTitle,
    brand: newBrand,
    image: newImage,
    stock: newStock,
    ...
}
```

Response: 

Object: Created listing object.

```
{
    title: newTitle,
    brand: newBrand,
    image: newImage,
    stock: newStock,
    ...
}
```

Error: 
- `HTTP 403`: Authentication failed, user not logged in.
- `HTTP 404`: Cannot find matching listing. Likely listing id incorrect or user's not the original seller
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

**Delete**

Endpoint: `DELETE /api/listings/<listingID>`

Authentication: MUST be logged in (checked by session.user) as the original seller.

Request body: 

```
None
```

Response: 

None/Plaintext.

```
DELETED
```

Error: 

- `HTTP 403`: Signed in  user is not the original seller.
- `HTTP 404`: Cannot find listing with given ID.
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

--- 

### Listing Reviews

**Create**

Endpoint: `POST /api/listings/<listingID>/reviews`

Authentication: MUST be logged in (checked by session.user). Listing review will be posted with reviewer being current user.

Request body: 

Full review object. Please refer to Data Structure documentation.

```
{
    rating: rating,
    comment: comment
}
```

Response: 

Object: Created review object.

```
{
    rating: rating,
    comment: comment
}
```

Error: 
- `HTTP 403`: Authentication failed, user not logged in.
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

---

### Check out

Endpoint: `POST /api/check-out`

Authentication: MUST be logged in (checked by session.user).

Request body: 

Cart object. Please refer to Data Structure documentation.

```
{
    id1: amount1, 
    id2: amount2,
    ...
}
```

Response: 

Array: Listing objects appeared in cart with their stock updated.

```
[
    {
        title: title,
        brand: brand,
        image: image,
        stock: newStock,
        ...
    },
    {
        title: title,
        brand: brand,
        image: image,
        stock: newStock,
        ...
    }
]
```

Error: 
- `HTTP 403`: Authentication failed, user not logged in.
- `HTTP 500`: Server error: DB time-out etc. Please consult with
              backend team should it occur.

---

## AUTH Router
