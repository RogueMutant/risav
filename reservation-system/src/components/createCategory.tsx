import React, { useState } from "react";
import "../styles/index.css";

interface categoryProps {
  onCreated: (categoryName: string) => void;
  onCancel: () => void;
}

export const CreateCategory: React.FC<categoryProps> = ({
  onCreated,
  onCancel,
}) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreated(categoryName);
    setCategoryName("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="create-category-form ">
        <label htmlFor="category-name">Category Name:</label>
        <input
          type="text"
          id="category-name"
          name="category-name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <button type="submit">Create Category</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>{" "}
      </form>
    </div>
  );
};
