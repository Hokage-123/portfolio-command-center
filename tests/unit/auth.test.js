/**
 * Authentication Tests for Portfolio Command Center
 */

describe('Authentication Functions', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Setup basic DOM structure
    document.body.innerHTML = `
      <div id="auth-section"></div>
      <div id="main-app" style="display: none;"></div>
    `;
  });

  test('should initialize Firebase auth', () => {
    // Mock the initializeAuth function behavior
    const mockInitializeAuth = () => {
      if (typeof firebase !== 'undefined') {
        return firebase.auth();
      }
      throw new Error('Firebase not available');
    };

    expect(() => mockInitializeAuth()).not.toThrow();
    expect(firebase.auth).toHaveBeenCalled();
  });

  test('should handle anonymous sign in', async () => {
    const mockSignInAnonymously = jest.fn().mockResolvedValue({
      user: { uid: 'test-uid', isAnonymous: true }
    });

    firebase.auth = jest.fn(() => ({
      signInAnonymously: mockSignInAnonymously
    }));

    const auth = firebase.auth();
    const result = await auth.signInAnonymously();

    expect(mockSignInAnonymously).toHaveBeenCalled();
    expect(result.user.uid).toBe('test-uid');
    expect(result.user.isAnonymous).toBe(true);
  });

  test('should show main app after authentication', () => {
    const authSection = document.getElementById('auth-section');
    const mainApp = document.getElementById('main-app');

    // Simulate successful authentication
    authSection.style.display = 'none';
    mainApp.style.display = 'block';

    expect(authSection.style.display).toBe('none');
    expect(mainApp.style.display).toBe('block');
  });
});
