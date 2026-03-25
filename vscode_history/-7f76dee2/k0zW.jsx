import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';
describe('Button Component', () => {
 test('affiche le label correctement', () => {
 render(<Button label="Cliquez-moi" />);
 expect(screen.getByText('Cliquez-moi')).toBeInTheDocument();
 });
 test('appelle onClick quand cliqué', async () => {
 const handleClick = jest.fn();
 const user = userEvent.setup();
 render(<Button label="Test" onClick={handleClick} />);

 await user.click(screen.getByText('Test'));
 expect(handleClick).toHaveBeenCalledTimes(1);
 });
 test('est désactivé quand disabled=true', () => {
 render(<Button label="Test" disabled={true} />);
 expect(screen.getByText('Test')).toBeDisabled();
 });
});

