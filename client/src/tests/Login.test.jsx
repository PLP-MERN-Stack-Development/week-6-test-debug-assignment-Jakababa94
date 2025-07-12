import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../pages/Login';
import { AuthProvider } from '../components/AuthGuard';

// Mocks for shadcn/ui components using useRef/forwardRef
vi.mock('@/components/ui/input', () => ({
  Input: (props) => <input {...props} />,
}));

vi.mock('@/components/ui/button', () => ({
  Button: (props) => <button {...props} />,
}));

vi.mock('@/components/ui/label', () => ({
  Label: (props) => <label {...props} />,
}));

vi.mock('@/components/ui/card', () => ({
  Card: (props) => <div {...props} />,
  CardContent: (props) => <div {...props} />,
  CardDescription: (props) => <div {...props} />,
  CardHeader: (props) => <div {...props} />,
  CardTitle: (props) => <h2 {...props} />,
}));

// ✅ Correct API mock (must match the one in the component)
vi.mock('../services/api', () => ({
  authService: {
    login: vi.fn(),
  },
}));

const LoginWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  it('renders login form', () => {
    render(<LoginWithProviders />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const { authService } = await import('../services/api');
    authService.login.mockResolvedValue({
      user: { email: 'test@example.com' },
      token: 'test-token',
    });

    render(<LoginWithProviders />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
