import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Product, ProductStatus } from "@/types";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import "./productActions.css";
import { useUser } from "@/modules/auth/hooks/use-user";
import { Role } from "@/types/role";
import Link from "next/link";
import { useLanguage } from "@/hooks/LanguageContext";

interface ProductsActionsProps {
  product: Product;
  onStatusChange?: (productId: string, newStatus: ProductStatus) => void;
  onDelete?: () => void;
}

export function ProductsActions({
  product,
  onStatusChange,
  onDelete,
}: ProductsActionsProps) {
  const router = useRouter();
  const { user } = useUser();
  const { t } = useLanguage();

  console.log("Current user from useUser:", user);

  // Just check for admin role
  const isAdmin = user?.role === Role.Admin;
  console.log("Role check:", {
    userRole: user?.role,
    adminRole: Role.Admin,
    isAdmin,
  });

  const handleDelete = async () => {
    if (!product._id) {
      toast({
        variant: "destructive",
        title: t("adminProducts.actions.invalidProductId"),
        description: "",
      });
      return;
    }

    if (confirm(t("adminProducts.actions.confirmDelete"))) {
      try {
        const response = await fetchWithAuth(`/products/${product._id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast({
            title: t("adminProducts.actions.productDeleted"),
            description: "",
          });

          onDelete?.();
        } else {
          throw new Error("Failed to delete product");
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: t("adminProducts.actions.deleteFailed"),
          description: "",
        });
      }
    }
  };

  const handleStatusChange = async (newStatus: ProductStatus) => {
    try {
      const response = await fetchWithAuth(`/products/${product._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      onStatusChange?.(product._id, newStatus);

      toast({
        title: t("adminProducts.actions.statusUpdated"),
        description:
          newStatus === ProductStatus.APPROVED
            ? t("adminProducts.actions.productApproved")
            : t("adminProducts.actions.productRejected"),
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: t("adminProducts.actions.statusUpdateFailed"),
        description: "",
      });
    }
  };

  return (
    <div className="prd-actions-group">
      <Link
        href={{
          pathname: `/admin/products/edit`,
          query: { id: product._id, refresh: Date.now() },
        }}
        className="prd-action-btn prd-action-edit"
        title={t("adminProducts.actions.editProduct")}
      >
        <Pencil size={16} />
      </Link>

      {isAdmin && product.status === ProductStatus.PENDING && (
        <>
          <button
            onClick={() => handleStatusChange(ProductStatus.APPROVED)}
            className="prd-action-btn prd-action-approve"
            title={t("adminProducts.actions.approveProduct")}
          >
            <CheckCircle size={16} />
          </button>
          <button
            onClick={() => handleStatusChange(ProductStatus.REJECTED)}
            className="prd-action-btn prd-action-reject"
            title={t("adminProducts.actions.rejectProduct")}
          >
            <XCircle size={16} />
          </button>
        </>
      )}

      <button
        className="prd-action-btn prd-action-delete"
        onClick={handleDelete}
        title={t("adminProducts.actions.deleteProduct")}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
