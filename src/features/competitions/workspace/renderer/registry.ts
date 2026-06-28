import React from "react";

export type QuestionRendererProps = {
  question: any;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  isSubmitting: boolean;
};

type RendererComponent = React.ComponentType<QuestionRendererProps>;

class RendererRegistry {
  private renderers = new Map<string, RendererComponent>();

  register(type: string, component: RendererComponent) {
    this.renderers.set(type, component);
  }

  get(type: string): RendererComponent | undefined {
    return this.renderers.get(type);
  }
}

export const rendererRegistry = new RendererRegistry();
