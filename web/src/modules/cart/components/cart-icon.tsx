import { useCart } from "../context/cart-context";
import Link from "next/link";
import "./cart-icon.css";
import { ShoppingCart } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageContext";

export function CartIcon({ onNavigate }: { onNavigate?: () => void }) {
  const { items } = useCart();
  const { t } = useLanguage();
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Link href="/cart" className="cart-icon-container" onClick={onNavigate}>
      <ShoppingCart className="shopping-cart-icon" size={24} />
      <span className="cart-text">{t("cart.title")}</span>
      {itemCount > 0 && <span className="cartIconsSpan">{itemCount}</span>}
    </Link>
  );
}
