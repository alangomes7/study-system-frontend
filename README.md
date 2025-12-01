POST http://localhost:8080/authentication/login { "email":
"admin@studysystem.com", "password": "admin123" }

---

POST URL: http://localhost:8080/userApp { "name": "Regular Student", "email":
"student@test.com", "password": "password123" }

---

POST URL: http://localhost:8080/authentication/login { "email":
"student@test.com", "password": "password123" }

---

Method: DELETE URL: http://localhost:8080/students/2 Auth: Update the Bearer
Token with the User Token from Step E. Result: 403 Forbidden { "status": 403,
"error": "FORBIDDEN", "message": "Você não tem permissão para acessar este
recurso." }

---

1. Tentar remover um aluno sem estar logado. No Postman, deverá ocorrer o erro
   401 - UNAUTHORIZED e no react o usuário deverá ser redirecionado para a tela
   de login que deverá exibir a mensagem "Necessário estar autenticado para
   acessar este recurso."

#

Method: DELETE URL: http://localhost:8080/students/2 Auth: Update the Bearer
Token with the User Token from Step E. Result: 401 Forbidden { "status": 401,
"error": "UNAUTHORIZED", "message": "Necessário estar autenticado para acessar
este recurso" }

---

2. Tentar remover um aluno após se logar com um usuário que possui o perfil
   USER. No Postman, deverá ocorrer o erro 403 - FORBIDDEN e no react o usuário
   deverá ser redirecionado para a tela de login que deverá exibir a mensagem
   "Você não tem permissão para acessar este recurso."

#

Method: DELETE URL: http://localhost:8080/students/2 Auth: Update the Bearer
Token with the User Token from Step E. Result: 403 Forbidden { "status": 403,
"error": "FORBIDDEN ", "message": "Você não tem permissão para acessar este
recurso." }

---

3. Tentar remover um aluno após se logar com um usuário que possui o perfil
   ADMIN. No Postman, o código de retorno deverá ser 200 OK e no react o usuário
   deverá ser removido.

#

Method: DELETE URL: http://localhost:8080/students/2 Auth: Update the Bearer
Token with the User Token from Step E. Result: 200 OK { "status": 200, "error":
"", "message": "" }
