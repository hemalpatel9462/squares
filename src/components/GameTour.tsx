import { BookOpen, CheckCircle2, MousePointer2, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface GameTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOUR_STEPS = [
  {
    icon: BookOpen,
    title: "Welcome to Squares",
    body: "Fill the board by dividing it into rectangles. Every numbered clue tells you the exact area of the rectangle it belongs to.",
  },
  {
    icon: MousePointer2,
    title: "Choose a puzzle",
    body: "Pick a difficulty, then choose a numbered puzzle. Easy, Medium, and Hard each offer their own set of challenges.",
  },
  {
    icon: MousePointer2,
    title: "Drag from a clue",
    body: "Press and drag from a numbered square across the cells you want to include. Release when the rectangle has the correct area.",
  },
  {
    icon: Palette,
    title: "Use the colors",
    body: "Each clue has its own color. Once its rectangle is complete, every square in that rectangle shares the clue’s color.",
  },
  {
    icon: CheckCircle2,
    title: "Finish the board",
    body: "Cover every square with a valid rectangle to solve the puzzle. Undo a move, reset the puzzle, or choose another puzzle whenever you need.",
  },
] as const;

export function GameTour({ isOpen, onClose }: GameTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const step = TOUR_STEPS[stepIndex];
  const StepIcon = step.icon;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === TOUR_STEPS.length - 1;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStepIndex(0);
    panelRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="tour-modal" role="presentation">
      <div
        aria-labelledby="game-tour-title"
        aria-modal="true"
        className="tour-panel"
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="tour-panel__icon" aria-hidden="true">
          <StepIcon className="tour-panel__icon-svg" />
        </div>
        <p className="eyebrow">How to play</p>
        <p className="tour-panel__progress" aria-live="polite">
          Step {stepIndex + 1} of {TOUR_STEPS.length}
        </p>
        <h2 className="tour-panel__title" id="game-tour-title">
          {step.title}
        </h2>
        <p className="tour-panel__body">{step.body}</p>
        <div className="tour-panel__steps" aria-hidden="true">
          {TOUR_STEPS.map((tourStep, index) => (
            <span
              className="tour-panel__step-dot"
              data-active={index === stepIndex ? "true" : "false"}
              key={tourStep.title}
            />
          ))}
        </div>
        <div className="tour-panel__actions">
          <button className="tour-panel__skip" onClick={onClose} type="button">
            Skip tour
          </button>
          <div className="tour-panel__navigation">
            <button
              className="tour-button tour-button--secondary"
              disabled={isFirstStep}
              onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
              type="button"
            >
              Back
            </button>
            <button
              className="tour-button tour-button--primary"
              onClick={() => {
                if (isLastStep) {
                  onClose();
                  return;
                }

                setStepIndex((index) => Math.min(TOUR_STEPS.length - 1, index + 1));
              }}
              type="button"
            >
              {isLastStep ? "Start playing" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameTour;
