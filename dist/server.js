import express from "express";
const app = express();
const PORT = 3000;
app.use(express.json());
let users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", isActive: true },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", isActive: false },
];
function isValidUser(body) {
    if (typeof body !== "object" || body === null) {
        return false;
    }
    const data = body;
    return (typeof data.name === "string" &&
        typeof data.email === "string" &&
        typeof data.isActive === "boolean");
}
app.get("/users", (_request, response) => {
    response.json(users);
});
app.get("/users/:id", (request, response) => {
    const id = Number(request.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
        response.status(404).json({ message: "Usuário não encontrado" });
        return;
    }
    response.json(user);
});
app.post("/users", (request, response) => {
    if (!isValidUser(request.body)) {
        response.status(400).json({
            message: "Dados inválidos. Envie: { name: string, email: string, isActive: boolean }",
        });
        return;
    }
    const nextId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;
    const newUser = {
        id: nextId,
        name: request.body.name,
        email: request.body.email,
        isActive: request.body.isActive,
    };
    users.push(newUser);
    response.status(201).json(newUser);
});
app.put("/users/:id", (request, response) => {
    const id = Number(request.params.id);
    if (!isValidUser(request.body)) {
        response.status(400).json({
            message: "Dados inválidos. Envie: { name: string, email: string, isActive: boolean }",
        });
        return;
    }
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        response.status(404).json({ message: "Usuário não encontrado" });
        return;
    }
    const updatedUser = {
        id,
        name: request.body.name,
        email: request.body.email,
        isActive: request.body.isActive,
    };
    users[index] = updatedUser;
    response.json(updatedUser);
});
app.delete("/users/:id", (request, response) => {
    const id = Number(request.params.id);
    const user = users.find((user) => user.id === id);
    if (!user) {
        response.status(404).json({ message: "Usuário não encontrado" });
        return;
    }
    users = users.filter((user) => user.id !== id);
    response.json(user);
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map