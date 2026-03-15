import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  test('affiche une erreur si les champs sont vides', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Tous les champs sont requis'
    );
  });

  test('affiche une erreur si le mot de passe est trop court', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), '123');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Le mot de passe doit contenir au moins 6 caractères'
    );
  });

  test('soumet le formulaire avec des données valides', async () => {
    const handleSubmit = jest.fn(); // <-- corrigé
    const user = userEvent.setup();
    render(<LoginForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'test@test.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
  });
});
