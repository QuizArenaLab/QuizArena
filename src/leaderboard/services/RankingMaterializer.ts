import { LeaderboardContext } from '../context/LeaderboardContext';
import { RankingAggregate } from '../models/RankingAggregate';
import { RankingCandidateSnapshot } from '../types/RankingCandidateSnapshot';
import { RankingAlgorithmEngine } from './engines/RankingAlgorithmEngine';
import { PercentileEngine } from './engines/PercentileEngine';
import { RankTimelineEngine } from './engines/RankTimelineEngine';
import { RankingStatisticsEngine } from './engines/RankingStatisticsEngine';
import { RankingSnapshotBuilder } from './builders/RankingSnapshotBuilder';
import { RankingManifestBuilder } from './builders/RankingManifestBuilder';
import { randomUUID } from 'crypto';

export class RankingMaterializer {
  constructor(
    private algorithmEngine: RankingAlgorithmEngine = new RankingAlgorithmEngine(),
    private percentileEngine: PercentileEngine = new PercentileEngine(),
    private timelineEngine: RankTimelineEngine = new RankTimelineEngine(),
    private statisticsEngine: RankingStatisticsEngine = new RankingStatisticsEngine(),
    private snapshotBuilder: RankingSnapshotBuilder = new RankingSnapshotBuilder(),
    private manifestBuilder: RankingManifestBuilder = new RankingManifestBuilder()
  ) {}

  public async materialize(context: LeaderboardContext): Promise<RankingAggregate> {
    const startTime = Date.now();
    
    const candidate = context.getCandidate();
    const existingAggregate = context.getExistingAggregate();

    // 1. Gather all candidates (merge existing with new)
    const candidatesMap = new Map<string, RankingCandidateSnapshot>();
    if (existingAggregate) {
      existingAggregate.snapshots.forEach(s => candidatesMap.set(s.candidate.userId, s.candidate));
    }
    
    // Override or add new candidate
    candidatesMap.set(candidate.userId, candidate);
    
    const allCandidates = Array.from(candidatesMap.values());

    // 2. Delegate to Engines
    const rankedSnapshots = this.algorithmEngine.sortAndRank(allCandidates);
    const percentiles = this.percentileEngine.calculate(rankedSnapshots);
    const timelines = this.timelineEngine.calculate(rankedSnapshots, existingAggregate);
    const statistics = this.statisticsEngine.calculate(rankedSnapshots);

    // 3. Build snapshot data
    this.snapshotBuilder
      .withSnapshots(rankedSnapshots)
      .withPercentiles(percentiles)
      .withTimelines(timelines)
      .withStatistics(statistics);

    const snapshotData = this.snapshotBuilder.build();

    // 4. Build manifest
    const duration = Date.now() - startTime;
    const manifest = this.manifestBuilder.build(
      allCandidates.length,
      rankedSnapshots.length,
      duration,
      candidate.submissionVersion
    );

    // 5. Construct Aggregate
    const aggregate: RankingAggregate = {
      aggregateId: randomUUID(),
      competitionId: candidate.competitionId,
      leaderboardScope: candidate.leaderboardScope,
      snapshots: snapshotData.snapshots,
      timelines: snapshotData.timelines,
      percentiles: snapshotData.percentiles,
      statistics: snapshotData.statistics,
      manifest,
      audit: {
        id: randomUUID(),
        startedAt: new Date(startTime),
        finishedAt: new Date(),
        durationMs: duration,
        candidatesProcessed: allCandidates.length,
        failures: 0,
        retryCount: 0,
        algorithmVersion: manifest.algorithmVersion,
        generatedBy: manifest.generatedBy,
        trigger: 'Immediate'
      },
      submissionVersion: manifest.submissionVersion,
      artifactVersion: manifest.artifactVersion,
      platformVersion: manifest.platformVersion,
      schemaVersion: manifest.schemaVersion,
      leaderboardVersion: '1.0'
    };

    return aggregate;
  }
}
