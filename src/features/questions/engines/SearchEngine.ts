export class SearchEngine {
  constructor(private readonly semanticSearch: any, private readonly similarityIndex: any) {}

  public async search(query: string, filters: any): Promise<any[]> {
    // Executes Keyword, Semantic, and Filtered searches
    return [];
  }

  public async findDuplicates(questionVersionId: string): Promise<string[]> {
    return this.similarityIndex.findSimilar(questionVersionId);
  }
}
