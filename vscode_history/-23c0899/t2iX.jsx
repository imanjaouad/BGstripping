import { render, screen, waitFor } from '@testing-library/react';
import UserList from './UserList';
global.fetch = jest.fn();
describe('UserList', () => {
 beforeEach(() => {
 fetch.mockClear();
 });
 test('affiche le chargement initialement', () => {
 fetch.mockImplementation(() => new Promise(() => {}));
 render(<UserList />);
 expect(screen.getByText('Chargement...')).toBeInTheDocument();
 });
 test('affiche la liste des utilisateurs après chargement', async () => {
 const mockUsers = [
 { id: 1, name: 'Alice' },
 { id: 2, name: 'Bob' }
 ];
 
 fetch.mockResolvedValueOnce({
 ok: true,
 json: async () => mockUsers
 });
 
 render(<UserList />);
 
 await waitFor(() => {
 expect(screen.getByText('Alice')).toBeInTheDocument();
 expect(screen.getByText('Bob')).toBeInTheDocument();
 });
 });
 test('affiche une erreur en cas de problème', async () => {
 fetch.mockRejectedValueOnce(new Error('Erreur réseau'));
 
 render(<UserList />);
 
 await waitFor(() => {
 expect(screen.getByRole('alert')).toHaveTextContent('Erreur : Erreur réseau');
 });
 });
});

