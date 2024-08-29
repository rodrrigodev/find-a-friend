export class PetsNotFoundError extends Error {
  constructor() {
    super('⚠️ Pet not found!')
  }
}
