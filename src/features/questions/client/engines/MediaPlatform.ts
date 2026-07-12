export class MediaPlatform {
  public async uploadAsset(file: Buffer, metadata: any): Promise<string> {
    // Stores asset, generates CDN url, returns QuestionAsset ID
    return "asset_url";
  }

  public async getAssetVersions(assetId: string): Promise<any[]> {
    return [];
  }
}
