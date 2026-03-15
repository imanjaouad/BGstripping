import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "./TodoList";

describe("TodoList Component", () => {
  test("ajout d’une nouvelle tâche", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByPlaceholderText("Nouvelle tâche"), "Tâche 1");
    await user.click(screen.getByText("Ajouter"));

    expect(screen.getByText("Tâche 1")).toBeInTheDocument();
  });

  test("impossible d’ajouter une tâche vide", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.click(screen.getByText("Ajouter"));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "La tâche ne peut pas être vide",
    );
  });

  test("basculer le statut complété/non complété", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByPlaceholderText("Nouvelle tâche"), "Tâche 1");
    await user.click(screen.getByText("Ajouter"));

    const task = screen.getByText("Tâche 1");
    // Marquer comme complétée
    await user.click(task);
    expect(task).toHaveStyle("text-decoration: line-through");

    // Décocher
    await user.click(task);
    expect(task).toHaveStyle("text-decoration: none");
  });

  test("suppression d’une tâche", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByPlaceholderText("Nouvelle tâche"), "Tâche 1");
    await user.click(screen.getByText("Ajouter"));

    expect(screen.getByText("Tâche 1")).toBeInTheDocument();

    await user.click(screen.getByText("Supprimer"));
    expect(screen.queryByText("Tâche 1")).not.toBeInTheDocument();
  });
});
