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
  correctOption: z.enum(["A", "B", "C", "D"], {
    message: "Correct option must be A, B, C, or D",
  }),
  explanation: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  subject: z.string().min(2, "Subject is required"),
  difficulty: z.enum(["BEGINNER", "MEDIUM", "HARDCORE"], {
    message: "Difficulty must be BEGINNER, MEDIUM, or HARDCORE",
  }),
  tags: z.string().optional(), // Comma-separated tags
  language: z.string().default("en"),
});

export type ImportRow = z.infer<typeof importRowSchema>;

export interface ParsedRow {
  rowNumber: number;
  data: Record<string, any>;
}

export interface ValidatedRow extends ParsedRow {
  isValid: boolean;
  errors?: string[];
  parsedData?: ImportRow;
  duplicateCheck?: {
    isDuplicate: boolean;
    isNearDuplicate: boolean;
    duplicateCode?: string;
    similarity?: number;
  };
}

// ─── Parsers ───────────────────────────────────────────────────────────────

export async function parseCSV(file: File): Promise<ParsedRow[]> {
  const text = await file.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
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

  return rawData.map((row, index) => ({
    rowNumber: index + 2,
    data: row,
  }));
}

export async function parseFile(file: File): Promise<ParsedRow[]> {
  if (file.name.endsWith(".csv")) {
    return parseCSV(file);
  } else if (file.name.endsWith(".xlsx")) {
    return parseXLSX(file);
  }
  throw new Error("Unsupported file format. Please upload a .csv or .xlsx file.");
}

// ─── Validation ─────────────────────────────────────────────────────────────

export async function validateRows(rows: ParsedRow[]): Promise<ValidatedRow[]> {
  const validatedRows: ValidatedRow[] = [];

  // We process rows sequentially for duplicate checks to prevent overloading the DB
  for (const row of rows) {
    try {
      // Clean and normalize keys to handle trailing spaces from headers
      const cleanedData: Record<string, any> = {};
      for (const [key, value] of Object.entries(row.data)) {
        cleanedData[key.trim()] = typeof value === "string" ? value.trim() : value;
      }

      const parsedData = importRowSchema.parse(cleanedData);

      // Check for duplicates
      const duplicateCheck = await checkForDuplicates(parsedData.question, parsedData.category);

      validatedRows.push({
        ...row,
        isValid: true,
        parsedData,
        duplicateCheck,
        errors: duplicateCheck.isDuplicate
          ? ["Duplicate question detected in the database"]
          : undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        validatedRows.push({
          ...row,
          isValid: false,
          errors: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
        });
      } else {
        validatedRows.push({
          ...row,
          isValid: false,
          errors: ["Unknown validation error occurred"],
        });
      }
    }
  }

  // Intra-upload duplicate detection
  const questionSet = new Set<string>();
  for (const row of validatedRows) {
    if (row.parsedData) {
      const normalizedQuestion = row.parsedData.question.toLowerCase().trim();
      if (questionSet.has(normalizedQuestion)) {
        row.isValid = false;
        row.errors = [...(row.errors || []), "Duplicate question within the same upload file"];
      } else {
        questionSet.add(normalizedQuestion);
      }
    }
  }

  return validatedRows;
}
