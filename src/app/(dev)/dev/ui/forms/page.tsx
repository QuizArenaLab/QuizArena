"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Form, FormRegistry, FormManifest, ValidationSummary } from "@/components/forms";
import { useQuizArenaForm } from "@/components/forms";
import { Icon } from "@/icons";

// Import new field components
import {
  TextField,
  EmailField,
  PasswordField,
  Textarea,
  SearchField,
  URLField,
  NumberField,
  CurrencyField,
  PercentageField,
  PhoneField,
  OTPField,
  CheckboxField,
  SwitchField,
  RadioGroupField,
  SelectField,
  MultiSelectField,
  ComboboxField,
  AutocompleteField,
  TagSelectorField,
  DatePicker,
  DateRangePicker,
  TimePicker,
  DateTimePicker,
  Calendar,
  MonthPicker,
  YearPicker,
  QuarterPicker,
  WeekPicker,
  DurationPicker,
  RelativeDatePicker,
  TimezoneSelector,
} from "@/components/forms/fields";

// 1. Define a dummy schema
const dummySchema = z.object({
  text: z.string().min(3, "Must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Must be at least 8 characters").optional(),
  textarea: z.string().max(200, "Maximum 200 characters allowed").optional(),
  search: z.string().optional(),
  url: z.string().url("Invalid URL format").optional(),
  number: z.coerce.number().min(0).max(100).optional(),
  currency: z.coerce.number().min(10, "Minimum $10").optional(),
  percentage: z.coerce.number().min(0).max(100).optional(),
  phone: z.string().min(10, "Invalid phone format").optional(),
  otp: z.string().length(6, "OTP must be exactly 6 digits").optional(),
  checkbox: z.boolean().optional(),
  switch: z.boolean().optional(),
  radio: z.string().optional(),
  select: z.string().optional(),
  multiselect: z.array(z.string()).optional(),
  combobox: z.string().optional(),
  autocomplete: z.string().optional(),
  tagselector: z.array(z.string()).optional(),
  // Date Fields
  datepicker: z.any().optional(),
  daterangepicker: z.any().optional(),
  timepicker: z.any().optional(),
  datetimepicker: z.any().optional(),
  calendar: z.any().optional(),
  monthpicker: z.any().optional(),
  yearpicker: z.any().optional(),
  quarterpicker: z.any().optional(),
  weekpicker: z.any().optional(),
  durationpicker: z.any().optional(),
  relativedatepicker: z.any().optional(),
  timezoneselector: z.string().optional(),
});

// 2. Register a dummy manifest for the playground
const dummyManifest: FormManifest = {
  metadata: {
    id: "playground-fields-form",
    name: "Enterprise Fields Playground",
    description: "Interactive playground for Enterprise Field Library.",
    owner: "Platform Team",
    category: "Development",
    version: "1.0.0",
    status: "draft",
    tags: ["demo", "playground", "fields"],
    dependencies: [],
  },
  lifecycle: "CREATED",
  validationSchema: dummySchema,
  themeVersion: "1.0",
  registryVersion: "1.0",
  accessibility: { ariaLabels: true, keyboardNav: true },
  responsive: true,
  motion: true,
};

// Only register once in the browser environment
if (typeof window !== "undefined") {
  FormRegistry.register(dummyManifest);
}

// 3. Inner component to consume the form context and display fields
function FieldsPlaygroundInner() {
  const { rhf, validation, lifecycle } = useQuizArenaForm();

  // Text/Number Toggles
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [required, setRequired] = useState(false);

  // Selection Specific Toggles
  const [searchable, setSearchable] = useState(true);
  const [clearable, setClearable] = useState(true);
  const [multiple, setMultiple] = useState(false);
  const [asyncReady, setAsyncReady] = useState(false);
  const [virtualized, setVirtualized] = useState(false);
  const [largeDataset, setLargeDataset] = useState(false);

  // Date Specific Toggles
  const [calendarMode, setCalendarMode] = useState<"single" | "multiple" | "range">("single");
  const [weekNumbers, setWeekNumbers] = useState(false);
  const [multipleMonths, setMultipleMonths] = useState(false);

  // Mock global form loading state manually for demo purposes
  const isFormLoading = loading || lifecycle.state === "SUBMITTING";

  const standardOptions = [
    { id: "apple", value: "apple", label: "Apple" },
    { id: "banana", value: "banana", label: "Banana" },
    { id: "orange", value: "orange", label: "Orange" },
  ];

  const largeOptions = Array.from({ length: 1000 }).map((_, i) => ({
    id: `item-${i}`,
    value: `item-${i}`,
    label: `Item ${i}`,
  }));

  const options = largeDataset ? largeOptions : standardOptions;

  return (
    <div className="flex flex-col gap-8 mt-4">
      {/* Interactive Controls */}
      <div className="p-6 border border-border rounded-xl bg-card shadow-sm sticky top-4 z-10">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Icon name="Settings2" className="w-5 h-5" />
          Interactive Toggles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Disabled</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={loading}
              onChange={(e) => setLoading(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Loading</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Required</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={searchable}
              onChange={(e) => setSearchable(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Searchable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={clearable}
              onChange={(e) => setClearable(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Clearable</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={multiple}
              onChange={(e) => setMultiple(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Multiple</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={asyncReady}
              onChange={(e) => setAsyncReady(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Async Ready</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={virtualized}
              onChange={(e) => setVirtualized(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Virtualized</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={largeDataset}
              onChange={(e) => setLargeDataset(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Large Dataset (1000+)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={weekNumbers}
              onChange={(e) => setWeekNumbers(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Week Numbers</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={multipleMonths}
              onChange={(e) => setMultipleMonths(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium">Multiple Months</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Mode:</span>
            <select
              value={calendarMode}
              onChange={(e) => setCalendarMode(e.target.value as any)}
              className="text-sm border rounded"
            >
              <option value="single">Single</option>
              <option value="multiple">Multiple</option>
              <option value="range">Range</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* SELECTION FIELDS */}
        <section className="space-y-8 lg:col-span-2">
          <div className="border-b pb-2">
            <h2 className="text-xl font-semibold">Selection Fields (FS-01.3)</h2>
            <p className="text-sm text-muted-foreground">
              Checkboxes, Radios, Switches, and Dropdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <CheckboxField
                name="checkbox"
                label="I agree to the terms"
                description="You must accept before continuing."
                disabled={disabled}
                required={required}
              />

              <SwitchField
                name="switch"
                label="Enable Notifications"
                description="Receive updates via email."
                disabled={disabled}
                required={required}
              />

              <RadioGroupField
                name="radio"
                label="Select Plan"
                description="Choose the plan that best fits your needs."
                options={[
                  { id: "free", value: "free", label: "Free Plan", description: "Basic features" },
                  { id: "pro", value: "pro", label: "Pro Plan", description: "Advanced features" },
                ]}
                disabled={disabled}
                required={required}
              />
            </div>

            <div className="space-y-6">
              <SelectField
                name="select"
                label="Fruit"
                placeholder="Select a fruit..."
                options={options}
                disabled={disabled}
                required={required}
              />

              <MultiSelectField
                name="multiselect"
                label="Favorite Fruits"
                placeholder="Select multiple..."
                options={options}
                disabled={disabled}
                required={required}
              />

              <ComboboxField
                name="combobox"
                label="Technology Stack"
                placeholder="Search technologies..."
                options={options}
                searchable={searchable}
                asyncReady={asyncReady}
                disabled={disabled}
                required={required}
              />

              <AutocompleteField
                name="autocomplete"
                label="City"
                placeholder="Start typing..."
                recentSearches={true}
                suggested={true}
                disabled={disabled}
                required={required}
              />

              <TagSelectorField
                name="tagselector"
                label="Categories"
                placeholder="Add tags..."
                creatable={true}
                deletable={true}
                disabled={disabled}
                required={required}
              />
            </div>
          </div>
        </section>

        {/* DATE & TIME FIELDS */}
        <section className="space-y-8 lg:col-span-2">
          <div className="border-b pb-2">
            <h2 className="text-xl font-semibold">Date & Time Fields (FS-01.4)</h2>
            <p className="text-sm text-muted-foreground">
              Pickers, Calendars, Timezones, and Durations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <DatePicker
                name="datepicker"
                placeholder="Select a date..."
                disabled={disabled}
                required={required}
              />
              <DateRangePicker
                name="daterangepicker"
                placeholder="Select date range..."
                disabled={disabled}
                required={required}
              />
              <TimePicker name="timepicker" disabled={disabled} required={required} />
              <DateTimePicker name="datetimepicker" disabled={disabled} required={required} />
              <div className="border rounded-md p-4 bg-white shadow-sm">
                <span className="text-sm font-medium block mb-2">Calendar Base Component</span>
                <Calendar
                  name="calendar"
                  mode={calendarMode}
                  disabled={disabled}
                  required={required}
                />
              </div>
              <TimezoneSelector name="timezoneselector" disabled={disabled} required={required} />
            </div>

            <div className="space-y-6">
              <RelativeDatePicker
                name="relativedatepicker"
                disabled={disabled}
                required={required}
              />
              <MonthPicker name="monthpicker" disabled={disabled} required={required} />
              <YearPicker name="yearpicker" disabled={disabled} required={required} />
              <QuarterPicker name="quarterpicker" disabled={disabled} required={required} />
              <WeekPicker name="weekpicker" disabled={disabled} required={required} />
              <DurationPicker name="durationpicker" disabled={disabled} required={required} />
            </div>
          </div>
        </section>

        {/* TEXT FIELDS (Collapsible or just standard below) */}
        <section className="space-y-8 opacity-70">
          <div className="border-b pb-2">
            <h2 className="text-xl font-semibold">1. Text Fields (FS-01.2)</h2>
          </div>
          <TextField name="text" label="Text Field" disabled={disabled} required={required} />
        </section>

        <section className="space-y-8 opacity-70">
          <div className="border-b pb-2">
            <h2 className="text-xl font-semibold">2. Numeric & Phone Fields (FS-01.2)</h2>
          </div>
          <NumberField name="number" label="Age" disabled={disabled} required={required} />
        </section>
      </div>

      <div className="mt-8 pt-8 border-t flex items-center justify-between">
        <button
          type="submit"
          disabled={isFormLoading}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isFormLoading && <Icon name="Loader2" className="w-4 h-4 animate-spin" />}
          Submit Validation Test
        </button>

        <button
          type="button"
          onClick={() => rhf.reset()}
          className="bg-secondary text-secondary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-secondary/80"
        >
          Reset Form
        </button>
      </div>

      {rhf.formState.isSubmitted && Object.keys(rhf.formState.errors).length > 0 && (
        <div className="mt-6">
          <ValidationSummary issues={validation.issues} />
        </div>
      )}

      <div className="p-4 mt-8 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-900/50">
        <h3 className="font-semibold text-lg mb-2">Form State Data</h3>
        <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto">
          {JSON.stringify(rhf.watch(), null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function FormsFieldsPage() {
  const [lastEvent, setLastEvent] = useState<any>(null);

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Enterprise Field Library</h1>
        <p className="text-muted-foreground text-lg">
          The permanent input system for all QuizArena workspaces.
        </p>
      </div>

      <Form
        manifestId="playground-fields-form"
        defaultValues={{
          text: "",
          email: "",
          password: "",
          textarea: "",
          search: "",
          url: "",
          number: "",
          currency: "",
          percentage: "",
          phone: "",
          otp: "",
          checkbox: false,
          switch: false,
          radio: "",
          select: "",
          multiselect: [],
          combobox: "",
          autocomplete: "",
          tagselector: [],
          datepicker: null,
          daterangepicker: null,
          timepicker: null,
          datetimepicker: null,
          calendar: null,
          monthpicker: null,
          yearpicker: null,
          quarterpicker: null,
          weekpicker: null,
          durationpicker: null,
          relativedatepicker: null,
          timezoneselector: "",
        }}
        onSubmit={(data) => {
          console.log("Success:", data);
        }}
        onEvent={(e) => setLastEvent(e)}
      >
        <FieldsPlaygroundInner />
      </Form>
    </div>
  );
}
