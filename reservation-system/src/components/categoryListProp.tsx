import React from "react";
import { Category } from "../types/custom";

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryClick: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
}) => (
  <div className="category-list">
    {categories.map((category) => (
      <div
        className={`category-card ${
          selectedCategory === category._id ? "active" : ""
        }`}
        key={category._id}
        onClick={() => onCategoryClick(category._id)}
      >
        {category.name}
      </div>
    ))}
  </div>
);

export default CategoryList;
