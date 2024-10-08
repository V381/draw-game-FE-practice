const initializeFirestore = jest.fn(() => ({
    // Mock Firestore instance methods if necessary
  }))
  
  const collection = jest.fn()
  const query = jest.fn()
  const orderBy = jest.fn()
  const getDocs = jest.fn()
  const deleteDoc = jest.fn()
  const doc = jest.fn()
  const addDoc = jest.fn()
  
  module.exports = {
    initializeFirestore,
    collection,
    query,
    orderBy,
    getDocs,
    deleteDoc,
    doc,
    addDoc,
  }