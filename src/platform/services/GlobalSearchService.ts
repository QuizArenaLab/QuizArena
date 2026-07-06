import { prisma } from "../../lib/prisma";

export interface SearchResult {
  type: 'COMPETITION' | 'USER' | 'QUESTION' | 'CERTIFICATE';
  id: string;
  title: string;
  subtitle?: string;
  url: string;
}

export class GlobalSearchService {
  /**
   * Performs a comprehensive search across the platform using Prisma and basic ILIKE matching
   * (or PG Full-Text Search in raw queries if heavily optimized).
   */
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const searchQuery = `%${query}%`;
    const results: SearchResult[] = [];

    // 1. Search Competitions (Challenges)
    const challenges = await prisma.challenge.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    });
    
    challenges.forEach(c => results.push({
      type: 'COMPETITION',
      id: c.id,
      title: c.title,
      subtitle: c.status,
      url: `/competitions/${c.slug}`
    }));

    // 2. Search Users
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    });

    users.forEach(u => results.push({
      type: 'USER',
      id: u.id,
      title: u.name || u.username || 'Unknown',
      subtitle: u.role,
      url: `/admin/users/${u.id}`
    }));

    // 3. Search Questions (Drafts/Approved)
    const questions = await prisma.question.findMany({
      where: {
        OR: [
          { questionCode: { contains: query, mode: 'insensitive' } },
          { question: { contains: query, mode: 'insensitive' } }
        ]
      },
      take: 5
    });

    questions.forEach(q => results.push({
      type: 'QUESTION',
      id: q.id,
      title: q.questionCode || 'Question',
      subtitle: q.subject || 'General',
      url: `/admin/questions/${q.id}`
    }));

    return results;
  }
}

export const globalSearchService = new GlobalSearchService();
