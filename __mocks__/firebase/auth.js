const mockCreateUserWithEmailAndPassword = jest.fn()
const mockSignInWithEmailAndPassword = jest.fn()
const mockGetAuth = jest.fn(() => ({}))

module.exports = {
  getAuth: mockGetAuth,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
}