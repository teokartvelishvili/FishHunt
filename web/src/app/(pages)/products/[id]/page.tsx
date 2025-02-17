import { ProductDetails } from "@/modules/products/components/product-details";
import { getProduct } from "@/modules/products/api/get-product";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="Container">
      <ProductDetails product={product} />
    </div>
  );
}
