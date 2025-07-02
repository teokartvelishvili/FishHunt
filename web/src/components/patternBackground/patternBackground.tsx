import Pattern from "../pattern/pattern";
import './patternBackground.css';

interface PatternBackgroundProps {
  imageSize?: number;
}

const PatternBackground = ({ imageSize = 250 }: PatternBackgroundProps) => {
  return (
    <div className="pattern-viewport">
      <Pattern imageSize={imageSize} />
    </div>
  );
};

export default PatternBackground;
