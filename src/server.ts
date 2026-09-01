import express from "express";
import type { Request, Response } from "express";

interface IUser {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface IError {
  message: string;
}

interface IParams {
  id: string;
}

const app = express();
const PORT = 3000;

app.use(express.json());

let users: IUser[] = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", isActive: true },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", isActive: false },
];

function isValidUser(body: unknown): boolean {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const data = body as Partial<IUser>;

  return (
    typeof data.name === "string" &&
    typeof data.email === "string" &&
    typeof data.isActive === "boolean"
  );
}

app.get("/users", (_request: Request, response: Response<IUser[]>) => {
  response.json(users);
});

app.get("/users/:id", (request: Request<IParams>, response: Response<IUser | IError>) => {
  const id = Number(request.params.id);
  const user = users.find((user) => user.id === id);

  if (!user) {
    response.status(404).json({ message: "Usuário não encontrado" });
    return;
  }

  response.json(user);
});

app.post(
  "/users",
  (
    request: Request<object, IUser | IError, Omit<IUser, "id">>,
    response: Response<IUser | IError>,
  ) => {
    if (!isValidUser(request.body)) {
      response.status(400).json({
        message: "Dados inválidos. Envie: { name: string, email: string, isActive: boolean }",
      });
      return;
    }

    const nextId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    const newUser: IUser = {
      id: nextId,
      name: request.body.name,
      email: request.body.email,
      isActive: request.body.isActive,
    };

    users.push(newUser);

    response.status(201).json(newUser);
  },
);

app.put(
  "/users/:id",
  (
    request: Request<IParams, IUser | IError, Omit<IUser, "id">>,
    response: Response<IUser | IError>,
  ) => {
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

    const updatedUser: IUser = {
      id,
      name: request.body.name,
      email: request.body.email,
      isActive: request.body.isActive,
    };

    users[index] = updatedUser;

    response.json(updatedUser);
  },
);

app.delete("/users/:id", (request: Request<IParams>, response: Response<IUser | IError>) => {
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
