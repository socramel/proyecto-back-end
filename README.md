APP PARA COMPARTIR ENLACES (AGREGADOR DE NOTICIAS)

Implementación de una API que permita a los usuarios registrados (users) compartir y votar enlaces web (links) que consideren interesantes.

Para registrarse tendrán que indicar un nombre, un correo electrónico y una contraseña.

Tras registrar un usuario podrán iniciar la sesión (indicando el e-mail y la contraseña) y una vez logueados podrán ver los enlaces de otros usuarios, publicar los suyos propios (URL, título y descripción) y votar los enlaces de los demás usuarios (votes).

Además el usuario tendrá la opción de editar sus datos de perfil (nombre, e-mail y password) y la opción de borrar sus propios enlaces.

A continuación se muestran las entidades y las rutas que definirán nuestra API:

ENTIDADES

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


ENDPOINTS

// Usuario
- POST /users - Registro de usuario.
- GET /users/info/:id - Devuelve la información de un usuario (id, name, e-mail, created_at).
- PUT /users/info - Edita la información de un usuario (name, e-mail, password).
- POST /users/login - Loguearse con e-mail y contraseña. Si son correctos devuelve un token.

// Links
- POST /links - Crea un nuevo link.
- GET /links - Devuelve todos los links ordenados por created_at (descendente).
- DELETE /links/:id - Borra un link (sólo puedes borrar los links creados por ti).

// Votos
- POST /votes/:link_id - Añade un voto a un link (sólo puedes votar los links que no sean creados por ti).
