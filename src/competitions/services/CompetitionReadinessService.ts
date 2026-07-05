import { WizardDraftData } from "@/features/admin/competition/wizard/types/wizard.types";

export interface ReadinessReport {
  isReady: boolean;
  errors: string[];
  warnings: string[];
}

export class CompetitionReadinessService {
  /**
   * Validates the complete draft and returns a readiness report.
   * Ensures that all mandatory fields across all steps are correctly populated
   * before allowing the competition to be moved out of the DRAFT state.
   */
  validateDraft(draftData: WizardDraftData): ReadinessReport {
    const report: ReadinessReport = {
      isReady: true,
      errors: [],
      warnings: [],
    };

    // 1. Basics Validation
    if (!draftData.basics.title || draftData.basics.title.trim() === "") {
      report.errors.push("Competition Title is required.");
    }
    if (!draftData.basics.slug || draftData.basics.slug.trim() === "") {
      report.errors.push("Competition Slug is required.");
    }
    if (!draftData.basics.competitionType) {
      report.errors.push("Competition Type is required.");
    }

    // 2. Configuration Validation
    if ((draftData.config?.durationMinutes ?? 0) <= 0) {
      report.errors.push("Duration must be greater than 0 minutes.");
    }
    const maxMarks = draftData.config?.maximumMarks ?? 0;
    if (maxMarks <= 0) {
      report.errors.push("Maximum marks must be greater than 0.");
    }

    // 3. Composer Validation (Structure & Questions)
    if (!draftData.composer?.sections || draftData.composer.sections.length === 0) {
      report.errors.push("At least one section must be created in the Composer.");
    } else {
      let totalQuestions = 0;
      let totalComposerMarks = 0;

      draftData.composer.sections.forEach((section, index) => {
        if (!section.title || section.title.trim() === "") {
          report.errors.push(`Section ${index + 1} is missing a title.`);
        }
        
        const qCount = section.questions?.length || 0;
        totalQuestions += qCount;

        if (qCount === 0) {
          report.warnings.push(`Section "${section.title || index + 1}" has no questions.`);
        }

        section.questions?.forEach((q) => {
          totalComposerMarks += q.marks || 1;
        });
      });

      if (totalQuestions === 0) {
        report.errors.push("The assessment must contain at least one question.");
      }

      if (totalComposerMarks !== maxMarks && totalComposerMarks > 0) {
        report.errors.push(
          `Total marks from questions (${totalComposerMarks}) does not match the configured Maximum Marks (${maxMarks}).`
        );
      }
    }

    // 4. Participation & Scheduling Validation
    if (!draftData.participation.startsAt) {
      report.warnings.push("No Start Date is set. The competition must be started manually.");
    } else if (
      draftData.participation.endsAt &&
      new Date(draftData.participation.startsAt) >= new Date(draftData.participation.endsAt)
    ) {
      report.errors.push("End Date must be after the Start Date.");
    }

    if (report.errors.length > 0) {
      report.isReady = false;
    }

    return report;
  }
}
