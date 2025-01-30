import React, { useState } from "react";

interface CreateResourceProps {
  categories: string[];
  onCreate: (resourceData: any) => void;
  onCancel: () => void;
}

export const CreateResource: React.FC<CreateResourceProps> = ({
  categories,
  onCreate,
  onCancel,
}) => {
  const [resourceData, setResourceData] = useState({
    name: "",
    description: "",
    category: "",
    image: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setResourceData({ ...resourceData, [name]: value });
  };

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setResourceData({ ...resourceData, image: e.target.files?.[0] });
  //   };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(resourceData);
    setResourceData({ name: "", description: "", category: "", image: null });
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="create-resource-form"
    >
      <select
        name="category"
        value={resourceData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select a Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="file"
        name="image"
        // onChange={handleImageChange}
        accept="image/*"
      />
      <button type="submit">Create Resource</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};
