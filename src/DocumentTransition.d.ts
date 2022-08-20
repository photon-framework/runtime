interface DocumentTransition {
  start(callback: () => void): void;
  prepare(callback: () => void): void;
  abandon(): void;
  finished: any|undefined;
}

interface Document {
  createDocumentTransition?: () => DocumentTransition;
}
