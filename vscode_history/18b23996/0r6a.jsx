import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter Component', () => {
  test('affiche le compteur initial à 0', () => {
    render(<Counter />);
    expect(screen.getByText('Compteur : 0')).toBeInTheDocument();
  });

  test('incrémente le compteur quand on clique sur +1', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByText('+1'));
    expect(screen.getByText('Compteur : 1')).toBeInTheDocument();
  });

  test('décrémente le compteur quand on clique sur -1', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    await user.click(screen.getByText('-1'));
    expect(screen.getByText('Compteur : -1')).toBeInTheDocument();
  });

  test('réinitialise le compteur quand on clique sur Réinitialiser', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    // Incrémente pour tester reset
    await user.click(screen.getByText('+1'));
    await user.click(screen.getByText('+1'));
    expect(screen.getByText('Compteur : 2')).toBeInTheDocument();

    // Réinitialiser
    await user.click(screen.getByText('Réinitialiser'));
    expect(screen.getByText('Compteur : 0')).toBeInTheDocument();
  });
});
