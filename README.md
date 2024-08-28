## Overview
- **Description:** This is a password vault modelled after [Bitwarden](https://bitwarden.com/). A _user_ can create an account and securely store _items_. Each _item_ is associated with a _folder_.
- **References:** I had originally made a contact management app following [this tutorial](https://www.youtube.com/watch?v=H9M02of22z4). I made this password vault afterwards to consolidate my knowledge and add more complexity.
- **Used:** Node.js, Express.js, Mongo DB, JWT authentication. 

### Structure
- **folders, items, users:** The subdirectory for each object contains a router, a functions file, tests, and MongoDB schemas.
- **app.js:** The server.
- **middleware.js:** Contains an error handler, a DB connection function, and a token validation function.

## Objects
### Users
- User documents have the structure : {_id, email, password, folders}.
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
- Folders are not documents in a database. They're abstracted. Each user document has a field called "folders" which is a string array. This represents the folders the user owns. Each item document has a field "folder" which is a string. This represents the folder the item belongs in.
- By default, an item is associated with the "default" folder.

## API Documentation
### 1. Users
`POST /api/users/register`
- **Input:** A request body of {email, password}.
- **What it does:** It registers a user with that email and password.
- **What it does under the hood:** Given that the email wasn't already registered, it makes a document in the _usesrs_ collection of the MongoDB database. The document is of the form {_id, email, hashed password, folders}.

`POST /api/users/signin`
- **Input:** A request body of {email, password}.
- **What it does:** If the user is registered, it returns an access token.
- **What it does under the hood:** It checks whether there is a _user_ document matching the credentials given.

`GET /api/users/account`
- **Input:** Access token in the authentication header. In order to use this method, the header must be correctly set.
- **What it does:** Displays the current user's information.
- **What it does under the hood:** Infers the user's ID from the access token and retrieves the associated _user_ document.

`PUT /api/users/account`
- **Input:** A request body in JSON format.
- **What it does:**  Updates the user's information. For example if the request body is {email: "hello@gmail.com", password: "12345"}, the user's email and password change accordingly.
- **What it does under the hood:** Infers the user's ID from the access token and modifies the associated _user_ document.

`DELETE /api/users/account`
- **Input:** None
- **What it does:** Deactivates the current user's account and deletes all items created by them.
- **What it does under the hood:** Infers the user's ID from the access token, deletes the associated _user_ document, and deletes all _item_ documents with the userId field set to the user's ID.

### 2. Items
*All of the following methods are private. It is assumed that a user is logged in, i.e. has an authentication header with an access token. The user's ID can be inferred from this token. <br><br>
** _\_id_  refers to the database ID of an item. The user's ID is referred to as _userId_.<br><br>
`GET /api/items`
- **Input:** None.
- **What it does:** Displays all items created by the current user, ordered alphabetically by title.
- **What it does under the hood:** Retrieves all items in the database with the _userId_ field set to the current user's ID.

`GET /api/items?type=[type]`
- **Input:** None.
- **What it does:** Displays all items of that type created by the current user, ordered alphabetically by title.
- **What it does under the hood:** Retrieves all items in the database with the _userId_ field set to the current user's ID and the type set to the given type.

`POST /api/items`
- **Input:** A request body with {title, type} and other optional fields.
- **What it does:** Creates an item.
- **What it does under the hood:** Creates an _item_ document in the database. The _userId_ field is set automatically.

`GET /api/items/[_id]`
- **Input:** None.
- **What it does:** Retrieves the item with the specified _\_id_.
- **What it does under the hood:** It retrieves the item with the specified _\_id_ and checks if its userId field matches the current user's ID.

`PUT /api/items/[_id]`
- **Input:** A request body in JSON form.
- **What it does:** Modifies the item with the specified _\_id_ according to the request body.
- **What it does under the hood:** It reads the item document with the specified _\_id_ and checks if its _userId_ field matches the current user's ID. Then the document is modified. 

`DELETE /api/items/[_id]`
- **Input:** None.
- **What it does:** Deletes the item with the given _\_id_.
- **What it does under the hood:** It reads the item document with the specified _id and checks if its userId field matches the current user's ID. Then the document is deleted.

### 3. Folders
*All of the following methods are private. It is assumed that a user is logged in, i.e. has an authentication header with an access token. The user's ID can be inferred from this token. <br><br>

`GET /api/folders`
- **Input:** None.
- **What it does:** Shows all the folders the user owns.
- **What it does under the hood:** It retrieves the _user_ document associated with the current user's ID and displays the _folders_ string array.

`POST /api/folders`
- **Input:** A request body of _{folderName}_.
- **What it does:** Creates a folder with that folder name.
- **What it does under the hood:** Retrieves the _user_ document associated with the current user's ID and appends _folderName_ to the  _folders_ string array.

`PUT /api/folders`
- **Input:** A request body of _{oldName, newName}_.
- **What it does:** Changes the name of the given folder, oldName -> newName. 
- **What it does under the hood:** 
  1) It retrieves the _user_ document associated with the current user's ID and appends _newName_ to the  _folders_ string array. 
  2) It deletes _oldName_ from the _folders_ string array.
  3) It finds all _item_ documents with the properties {userId: current user's ID, folder: _oldName_} and changes the folder to _newName_.

`GET /api/folders/[folderName]`
- **Input:** None.
- **What it does:** Displays all items in the given folder, ordered alphabetically by title.
- **What it does under the hood:** Retrieves all items with properties {userId: current user's ID, folder: _folderName_}.

`DELETE /api/folders/[folderName]`
- **Input:** Optional request body set to either { option: delete-all } or { option: keep-content }.
- **What it does:**
  - If there is no request body: Asks if the user wants to delete all contents in the folder as well.
  - If { option: delete-all }: Deletes the folder and all content in the folder.
  - If { option: keep-content }: Deletes the folder and migrates content to the "default" folder.
- **What it does under the hood:**
  - If { option: delete-all }: 
    1) It retrieves the _user_ document associated with the current user's ID and deletes _folderName_ from the  _folders_ string array. 
    2) It deletes all _item_ documents with the properties { userId: current user's ID, folder: _folderName_ }.
  - If { option: keep-content }:
    1) It retrieves the _user_ document associated with the current user's ID and deletes _folderName_ from the  _folders_ string array.
    2) It finds all _item_ documents with the properties { userId: current user's ID, folder: _folderName_ } and changes the folder to "default".