import { LeaderboardPresentationService } from '../services/LeaderboardPresentationService';
import { LeaderboardSummary, LeaderboardStatistics, LeaderboardCurrentUser, LeaderboardEntry } from '../models/LeaderboardReadModels';
import { CursorPaginationResult } from '../repositories/RankingSnapshotRepository';
import { LeaderboardSearchIndex } from '../infrastructure/LeaderboardSearchIndex';

export class LeaderboardFacade {
  constructor(
    private presentationService: LeaderboardPresentationService,
    private searchIndex: LeaderboardSearchIndex
  ) {}

  public async getGlobal(limit: number, cursor?: string): Promise<CursorPaginationResult<LeaderboardEntry>> {
    return this.presentationService.getEntries('global', 'GLOBAL', limit, cursor);
  }

  public async getCompetition(competitionId: string, limit: number, cursor?: string): Promise<CursorPaginationResult<LeaderboardEntry>> {
    return this.presentationService.getEntries(competitionId, 'COMPETITION', limit, cursor);
  }

  public async getWeekly(limit: number, cursor?: string): Promise<CursorPaginationResult<LeaderboardEntry>> {
    return this.presentationService.getEntries('weekly', 'WEEKLY', limit, cursor);
  }

  public async getMonthly(limit: number, cursor?: string): Promise<CursorPaginationResult<LeaderboardEntry>> {
    return this.presentationService.getEntries('monthly', 'MONTHLY', limit, cursor);
  }

  public async getExam(examId: string, limit: number, cursor?: string): Promise<CursorPaginationResult<LeaderboardEntry>> {
    return this.presentationService.getEntries(examId, 'EXAM', limit, cursor);
  }

  public async getCurrentUser(competitionId: string, userId: string): Promise<LeaderboardCurrentUser | null> {
    return this.presentationService.getCurrentUser(competitionId, 'COMPETITION', userId);
  }

  public async search(competitionId: string, query: string): Promise<LeaderboardEntry[]> {
    return this.searchIndex.search(competitionId, query);
  }

  public async statistics(competitionId: string): Promise<LeaderboardStatistics | null> {
    return this.presentationService.getStatistics(competitionId, 'COMPETITION');
  }
}
