import { render, screen, waitFor } from "@testing-library/react";
import UserList from "./UserList";

// On mock global.fetch pour simuler les appels API
global.fetch = jest.fn();

describe("UserList", () => {
  // Réinitialise le mock avant chaque test
  beforeEach(() => {
    fetch.mockClear();
  });

  test("affiche le chargement initialement", () => {
    // Simule un fetch qui ne se termine jamais
    fetch.mockImplementation(() => new Promise(() => {}));

    render(<UserList />);

    expect(screen.getByText("Chargement...")).toBeInTheDocument();
  });

  test("affiche la liste des utilisateurs après chargement", async () => {
    const mockUsers = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];

    // Simule une réponse API réussie
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<UserList />);

    // Attend que les éléments apparaissent dans le DOM
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  test("affiche une erreur en cas de problème", async () => {
    // Simule un fetch qui échoue
    fetch.mockRejectedValueOnce(new Error("Erreur réseau"));

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Erreur : Erreur réseau",
      );
    });
  });
});
