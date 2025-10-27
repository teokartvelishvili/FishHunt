import { ProductStatus } from "@/types";

interface StatusBadgeProps {
  status: ProductStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case ProductStatus.APPROVED:
        return {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          borderColor: "#059669",
        };
      case ProductStatus.PENDING:
        return {
          background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
          color: "white",
          borderColor: "#ea580c",
        };
      case ProductStatus.REJECTED:
        return {
          background: "linear-gradient(135deg, #f43f5e 0%, #dc2626 100%)",
          color: "white",
          borderColor: "#dc2626",
        };
      default:
        return {
          background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
          color: "white",
          borderColor: "#475569",
        };
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ProductStatus.APPROVED:
        return "✓ Approved";
      case ProductStatus.PENDING:
        return "⏳ Pending";
      case ProductStatus.REJECTED:
        return "✗ Rejected";
      default:
        return status;
    }
  };

  const styles = getStatusStyles();

  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border"
      style={{
        background: styles.background,
        color: styles.color,
        borderColor: styles.borderColor,
      }}
    >
      {getStatusText()}
    </span>
  );
}
