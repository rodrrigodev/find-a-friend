export class PetsNotFound extends Error {
  constructor() {
    super('⚠️ Pets not found!')
  }
}
