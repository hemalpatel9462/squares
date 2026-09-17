import { ArrowRight } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section aria-label="Squares welcome" className="start-screen">
      <div aria-hidden="true" className="start-screen__mark">
        <span />
        <span />
        <span />
        <span />
      </div>
      <p className="eyebrow">Squares</p>
      <h1 className="start-screen__title">Fill the board.<br />Find the fit.</h1>
      <p className="start-screen__copy">
        Build valid rectangles around every clue and cover the board one perfect fit at a time.
      </p>
      <button className="start-screen__button" onClick={onStart} type="button">
        Start playing
        <ArrowRight aria-hidden="true" className="icon" />
      </button>
    </section>
  );
}

export default StartScreen;
