## Overview
- **Description:** This is a password vault modelled after [Bitwarden](https://bitwarden.com/). A _user_ can create an account and securely store _items_. Each _item_ is associated with a _folder_.
- **Used:** Node.js, Express.js, Mongo DB, JWT authentication. 

### Structure
- **folders, items, users:** The subdirectory for each object contains a router, a functions file, tests, and MongoDB schemas.
- **app.js:** The server.
- **middleware.js:** Contains an error handler, a DB connection function, and a token validation function.

## Objects
### Users
- User documents have the structure : {_id: MongoDB Object Id, email: String, password: hashed String, folders:[String]}.
- Users can be created, signed in, viewed, updated, and deleted.
- User documents are stored in a collection named "users".

### Items
- Items have a _type_ field which is a _login_ (login credentials), _card_, or a _note_. Each _type_ has a different schema.
- Items must be associated with a user's id.
- Items can be viewed, created, updated, and deleted.
- All items are stored in the "items" collection, regardless of their type.

### Folders
- Users can organise items into folders. If a folder is unspecified, an item is stored in the "default" folder.
- Folders can be viewed, created, updated, deleted while preserving contents, and deleted completely. 
- Folders are not documents in a database. They're abstracted. 

## Add later

