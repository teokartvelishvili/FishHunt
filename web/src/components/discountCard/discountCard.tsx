import "./discountCard.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface DiscountCardProps {
  title: string;
  description: string;
  imageSrc: string;
  altText: string;
  link?: string;
}

const DiscountCard: React.FC<DiscountCardProps> = ({
  title,
  description,
  imageSrc,
  altText,
  link,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      // თუ link იწყება http-ით, ახალ ფანჯარაში გახსენი
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        // თუ შიდა ლინკია, navigate გააკეთე
        router.push(link);
      }
    }
  };

  return (
    <div 
      className={`discountCard ${link ? 'clickable' : ''}`}
      onClick={handleClick}
      role={link ? "button" : undefined}
      tabIndex={link ? 0 : undefined}
    >
    <div className="circle-container">
      <div className="circle">
        <div className="line top-line"></div>
        <div className="line right-line"></div>
        <div className="line bottom-line"></div>
        <div className="line left-line"></div>
        <div className="circle-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="overlay-circle">
        {imageSrc ? (
          <Image 
            src={imageSrc} 
            alt={altText} 
            className="circle-image"
            width={140}
            height={140}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="circle-image" style={{ background: '#2c6133' }} />
        )}
      </div>
    </div>
    </div>
  );
};

export default DiscountCard;
