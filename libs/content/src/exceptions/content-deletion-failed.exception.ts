export class DeletionFailedException extends Error {
  constructor(id: string) {
    super(`Deletion of item with id ${id} failed.`);
    this.name = 'DeletionFailedException';
  }
}
