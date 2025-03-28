import React, { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "./authContext";
import "../styles/index.css";
import { firstLetterToUpperCase } from "../helper/helper";
import { ModalView } from "./modal";

interface CategoryProps {
  onCreated: (categoryName: string) => void;
  onCancel: () => void;
}

export const CreateCategory: React.FC<CategoryProps> = ({
  onCreated,
  onCancel,
}) => {
  const { error: fetchError, fetchData } = useFetch(
    "/api/categories/v1",
    false,
    "post"
  );
  const [categoryName, setCategoryName] = useState<string>("");
  const { refreshUserData } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      console.error("Category name cannot be empty");
      return;
    }

    try {
      setCategoryName(firstLetterToUpperCase(categoryName.trim()));
      setShowModal(true);
      const result = await fetchData({ name: categoryName }, "post");

      if (result) {
        console.log("Category created:", result);
        onCreated(categoryName);
        refreshUserData();
        setCategoryName("");
      }
    } catch (error) {
      console.log("Error creating category:", error);
      if (fetchError) {
        console.log("Fetch error:", fetchError);
      }
    }
  };

  return (
    <>
      <div className="create-modal">
        <form onSubmit={handleSubmit} className="create-category-form">
          <label htmlFor="category-name">Category Name:</label>
          <input
            type="text"
            id="category-name"
            name="category-name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <p style={{ color: "red", marginBottom: "10px" }}>
            {fetchError ? fetchError + " !" : ""}
          </p>
          <button type="submit">Create Category</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
        {showModal && <ModalView str="Successfully created a category" />}
      </div>
    </>
  );
};
