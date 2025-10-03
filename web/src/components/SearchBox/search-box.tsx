"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/hooks/LanguageContext";
import "./SearchBox.css";

export default function SearchBox() {
  const { t } = useLanguage();
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search/${keyword.trim()}`);
    }
  };

  return (
    <form onSubmit={onSubmit} className="search-form">
      <input
        type="text"
        placeholder={t("common.searchPlaceholder")}
        value={keyword}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.target.value)
        }
        className="search-input"
      />
      <button type="submit" className="search-button">
        <Search size={18} />
      </button>
    </form>
  );
}
