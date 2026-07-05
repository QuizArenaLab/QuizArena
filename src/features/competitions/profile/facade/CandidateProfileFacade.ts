import { prisma } from "@/lib/prisma";

export interface CandidateProfileData {
  userId: string;
  name: string;
  email: string;
  joinDate: string;
  bookmarkedCompetitionIds: string[];
}

export class CandidateProfileFacade {
  /**
   * Mock bookmark storage for the MVP.
   * In a real system, this would be a join table in the DB.
   */
  private static mockBookmarks = new Map<string, string[]>();

  public static async getProfile(userId: string): Promise<CandidateProfileData> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      userId: user.id,
      name: user.name || "Aspirant",
      email: user.email || "",
      joinDate: user.createdAt.toISOString(),
      bookmarkedCompetitionIds: this.mockBookmarks.get(userId) || [],
    };
  }

  public static async toggleBookmark(userId: string, competitionId: string): Promise<boolean> {
    const current = this.mockBookmarks.get(userId) || [];
    const isBookmarked = current.includes(competitionId);
    
    if (isBookmarked) {
      this.mockBookmarks.set(userId, current.filter(id => id !== competitionId));
      return false; // Removed
    } else {
      this.mockBookmarks.set(userId, [...current, competitionId]);
      return true; // Added
    }
  }
}
