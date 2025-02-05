import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ResourceList } from "../components/resourcelist";
import { CreateResource } from "../components/createResource";
import { useResources } from "../components/resourceContext";
import { Resource } from "../types/custom";
import { BsPlus } from "react-icons/bs";

export const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { resources, createResource, loading } = useResources(); // Use the context hook
  const [showCreateResource, setShowCreateResource] = useState(false);

  const filteredResources = resources.filter(
    (resource) => resource.category === categoryName
  );

  // const handleResourceCreate = (resourceData: Resource) => {
  //   if (categoryName)
  //     createResource({ ...resourceData, category: categoryName });
  //   setShowCreateResource(false);
  // };

  return (
    <div className="category-page-container">
      <div className="category-page">
        <div className="category-header">
          <h2 className="category-title">
            {categoryName ? `Resources in : ${categoryName}` : "All Resources"}
          </h2>
          <button
            onClick={() => setShowCreateResource(true)}
            className="add-resource-button"
          >
            <BsPlus /> Add Resource
          </button>
        </div>
        <ResourceList
          category={categoryName ?? null}
          resources={filteredResources}
          onDeleteResource={() => {}} // Make sure this is defined
        />
        {showCreateResource && (
          <div className="create-resource-overlay">
            {" "}
            {/* Overlay for the form */}
            <CreateResource
              categories={[categoryName ?? ""]}
              onCancel={() => setShowCreateResource(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
