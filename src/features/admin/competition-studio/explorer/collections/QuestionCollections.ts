/**
 * Question Collections
 * 
 * Supports reusable collections across competitions.
 */

export interface QuestionCollection {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
  isGlobal: boolean;
}

class QuestionCollectionsService {
  private collections: Map<string, QuestionCollection> = new Map();

  createCollection(collection: Omit<QuestionCollection, 'id'>): QuestionCollection {
    const id = `col_${Date.now()}`;
    const newCollection = { ...collection, id };
    this.collections.set(id, newCollection);
    return newCollection;
  }

  getCollections(): QuestionCollection[] {
    return Array.from(this.collections.values());
  }

  addToCollection(collectionId: string, questionIds: string[]) {
    const collection = this.collections.get(collectionId);
    if (collection) {
      collection.questionIds = [...new Set([...collection.questionIds, ...questionIds])];
    }
  }
}

export const QuestionCollections = new QuestionCollectionsService();
