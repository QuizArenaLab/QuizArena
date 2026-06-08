import { z } from "zod";
import * as Papa from "papaparse";
import * as XLSX from "xlsx";
import { checkForDuplicates } from "./duplicate-detection";

// ─── Row Schema Validation ──────────────────────────────────────────────────

export const importRowSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  optionA: z.string().min(1, "Option A is required"),
  optionB: z.string().min(1, "Option B is required"),
  optionC: z.string().min(1, "Option C is required"),
  optionD: z.string().min(1, "Option D is required"),
  optionE: z.string().optional(),
  optionF: z.string().optional(),
  correctOption: z.enum(["A", "B", "C", "D", "E", "F"], {
    message: "Correct option must be A, B, C, D, E, or F",
  }),
  explanation: z.string().min(1, "Explanation is required"),
  category: z.string().min(2, "Category is required"),
  subject: z.string().min(2, "Subject is required"),
  topic: z.string().optional(),
  difficulty: z.enum(["BEGINNER", "MEDIUM", "HARDCORE"], {
    message: "Difficulty must be BEGINNER, MEDIUM, or HARDCORE",
  }),
  marks: z.coerce.number().min(1).default(1),
  negativeMarks: z.coerce.number().min(0).default(0),
  tags: z.string().optional(), // Comma-separated tags
  language: z.string().default("en"),
});

export type ImportRow = z.infer<typeof importRowSchema>;

export interface ParsedRow {
  rowNumber: number;
  data: Record<string, any>;
}

export interface ValidationIssue {
  severity: "WARNING" | "ERROR";
  message: string;
  suggestedFix?: string;
}

export interface ValidatedRow extends ParsedRow {
  status: "VALID" | "WARNING" | "BLOCKED";
  issues: ValidationIssue[];
  parsedData?: ImportRow;
  duplicateCheck?: {
    status: "NONE" | "SIMILAR" | "EXACT";
    highestScore: number;
    duplicateCode?: string;
    similarity?: number;
  };
  qualityScore: number;
}

// ─── Parsers ───────────────────────────────────────────────────────────────

const REQUIRED_HEADERS = [
  "question",
  "optiona",
  "optionb",
  "optionc",
  "optiond",
  "correctoption",
  "explanation",
  "category",
  "subject",
  "difficulty",
];

function validateHeaders(headers: string[]) {
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());
  const missing = REQUIRED_HEADERS.filter((req) => !normalizedHeaders.includes(req));

  // Provide helpful fallbacks in error messages (e.g. CorrectAnswer vs correctoption)
  if (missing.length > 0) {
    const missingStr = missing
      .map((m) => (m === "correctoption" ? "correctOption (or CorrectAnswer)" : m))
      .join(", ");
    throw new Error(
      `Missing required columns: ${missingStr}. Please fix the template and re-upload.`
    );
  }
}

export async function parseCSV(file: File): Promise<ParsedRow[]> {
  const text = await file.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.meta.fields || results.meta.fields.length === 0) {
          return reject(new Error("File is empty or corrupted."));
        }
        try {
          validateHeaders(results.meta.fields);
        } catch (e) {
          return reject(e);
        }

        const rows: ParsedRow[] = results.data.map((row: any, index) => ({
          rowNumber: index + 2, // 1-indexed, +1 for header
          data: row,
        }));
        resolve(rows);
      },
      error: (error: any) => reject(error),
    });
  });
}

export async function parseXLSX(file: File): Promise<ParsedRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  if (rawData.length === 0) {
    throw new Error("File is empty or corrupted.");
  }

  const headers = Object.keys(rawData[0]);
  validateHeaders(headers);

  return rawData.map((row, index) => ({
    rowNumber: index + 2,
    data: row,
  }));
}

export async function parseFile(file: File): Promise<ParsedRow[]> {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File exceeds maximum allowed size of 10MB. Actual size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );
  }

  if (file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv") {
    return parseCSV(file);
  } else if (file.name.toLowerCase().endsWith(".xlsx") || file.type.includes("spreadsheetml")) {
    return parseXLSX(file);
  }
  throw new Error(
    "Unsupported file format. Please upload a .csv or .xlsx file. PDF, DOCX, TXT, ZIP are rejected."
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

import { calculateQuestionQuality } from "@/lib/validations/question-engine";

export async function validateRows(rows: ParsedRow[]): Promise<ValidatedRow[]> {
  const validatedRows: ValidatedRow[] = [];
  const questionSet = new Set<string>();

  for (const row of rows) {
    const issues: ValidationIssue[] = [];
    let parsedData: ImportRow | undefined;
    let duplicateResult: any;
    let qualityScore = 0;

    try {
      // Step 14: Auto-Correction Engine
      const cleanedData: Record<string, any> = {};
      for (const [key, value] of Object.entries(row.data)) {
        if (typeof value === "string") {
          // Normalize line breaks and remove duplicate whitespace
          cleanedData[key.trim()] = value.replace(/\r\n/g, "\n").replace(/ {2,}/g, " ").trim();
        } else {
          cleanedData[key.trim()] = value;
        }
      }

      parsedData = importRowSchema.parse(cleanedData);

      const options = [
        { optionText: parsedData.optionA, isCorrect: parsedData.correctOption === "A", order: 1 },
        { optionText: parsedData.optionB, isCorrect: parsedData.correctOption === "B", order: 2 },
        { optionText: parsedData.optionC, isCorrect: parsedData.correctOption === "C", order: 3 },
        { optionText: parsedData.optionD, isCorrect: parsedData.correctOption === "D", order: 4 },
      ];
      if (parsedData.optionE)
        options.push({
          optionText: parsedData.optionE,
          isCorrect: parsedData.correctOption === "E",
          order: 5,
        });
      if (parsedData.optionF)
        options.push({
          optionText: parsedData.optionF,
          isCorrect: parsedData.correctOption === "F",
          order: 6,
        });

      // Step 5: Duplicate Scan
      duplicateResult = await checkForDuplicates({
        question: parsedData.question,
        category: parsedData.category,
        subject: parsedData.subject,
        explanation: parsedData.explanation,
        options,
      });

      // Step 4: Question Validation using Engine
      const qualityResult = calculateQuestionQuality(
        {
          question: parsedData.question,
          explanation: parsedData.explanation,
          category: parsedData.category,
          subject: parsedData.subject,
          topic: parsedData.topic,
          difficulty: parsedData.difficulty as any,
          options: options as any,
        },
        duplicateResult
      );

      qualityScore = qualityResult.score;

      // Map Engine Results to Issues
      qualityResult.blockingErrors.forEach((err) => {
        issues.push({ severity: "ERROR", message: err });
      });
      qualityResult.warnings.forEach((warn) => {
        issues.push({ severity: "WARNING", message: warn });
      });

      // Intra-upload Duplicate Check
      const normalizedQuestion = parsedData.question.toLowerCase().trim();
      if (questionSet.has(normalizedQuestion)) {
        issues.push({
          severity: "ERROR",
          message: "Duplicate question within the same upload file.",
          suggestedFix: "Remove the duplicate row.",
        });
      } else {
        questionSet.add(normalizedQuestion);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          issues.push({ severity: "ERROR", message: `${issue.path.join(".")}: ${issue.message}` });
        });
      } else {
        issues.push({ severity: "ERROR", message: "Unknown validation error occurred" });
      }
    }

    const hasErrors = issues.some((i) => i.severity === "ERROR");
    const hasWarnings = issues.some((i) => i.severity === "WARNING");
    const status = hasErrors ? "BLOCKED" : hasWarnings ? "WARNING" : "VALID";

    validatedRows.push({
      ...row,
      status,
      issues,
      parsedData,
      qualityScore,
      duplicateCheck: duplicateResult
        ? {
            status: duplicateResult.status,
            highestScore: duplicateResult.highestScore,
            duplicateCode: duplicateResult.candidates?.[0]?.questionCode,
            similarity: duplicateResult.highestScore,
          }
        : undefined,
    });
  }

  return validatedRows;
}
