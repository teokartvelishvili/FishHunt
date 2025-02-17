import Link from "next/link";
import "./homePageShop.css";
import { ProductCard } from "@/modules/products/components/product-card";
import { getProducts } from "@/modules/products/api/get-products";

const HomePageShop = async () => {
  const { items: products } = await getProducts(1, 6); // მოაქვს მხოლოდ 6 პროდუქტი

  return (
    <div className="homePageShop">
      <h1 className="homePageForumH1">Shop</h1>
      <div className="productGrid">
        {products.map((product) => (
          <ProductCard key={product._id || product.name} product={product} />
        ))}
      </div>
      <Link href="/shop" className="forumPageLink">
        {" "}
        See More{" "}
      </Link>
    </div>
  );
};

export default HomePageShop;
