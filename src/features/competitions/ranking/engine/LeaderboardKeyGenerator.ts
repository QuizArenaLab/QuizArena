export class LeaderboardKeyGenerator {
  /**
   * Generates a unique standard identifier for a leaderboard dimension.
   */
  public static global(): string {
    return "GLOBAL";
  }

  public static competition(competitionId: string): string {
    return `COMPETITION:${competitionId}`;
  }

  public static exam(examId: string): string {
    return `EXAM:${examId}`;
  }

  public static weekly(year: number, week: number): string {
    return `WEEKLY:${year}-W${week.toString().padStart(2, "0")}`;
  }

  public static monthly(year: number, month: number): string {
    return `MONTHLY:${year}-${month.toString().padStart(2, "0")}`;
  }

  /**
   * Parses a LeaderboardKey back into its metadata.
   */
  public static parse(key: string): { type: string; id?: string } {
    if (key === "GLOBAL") return { type: "GLOBAL" };
    const [type, id] = key.split(":");
    return { type, id };
  }
}
