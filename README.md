APP PARA COMPARTIR ENLACES
Implementar una API que permita a los usuarios registrarse y compartir enlaces web que consideren interesantes.

ENTIDADES:

- Users
    - id
    - name
    - email
    - password
    - created_at
- Links
    - id
    - user_id
    - url
    - title
    - description
    - created_at

- Votes
    - id
    - user_id
    - link_id
    - create_at


ENDPOINTS:

// Usuario
- POST /users - Registro de usuario
- GET /users/info/:id - Devuelve la información de un usuario (id, name, e-mail, created_at).
- PUT /users/info/:id - Edita la información de un usuario (name, e-mail, password).
- POST /users/login - Loguearse con e-mail y contraseña. Si son correctos devuelve un token.

// Links
- POST /links - Crea un nuevo link.
- GET /links - Devuelve todos los links ordenados por created_at (descendente).
- DELETE /links/:id - Borra un link (sólo puedes borrar los links creados por ti).

// Votos
- POST /votes/:link_id - Añade un voto a un link (sólo puedes votar los links que no sean creados por ti).

