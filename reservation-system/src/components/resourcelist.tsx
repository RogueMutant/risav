import React from "react";
import "../styles/index.css";
import { Resource } from "../types/custom";
import { CreateResource } from "./createResource";

interface ResourceListProps {
  category: string | null;
  resources: Resource[];
  onDeleteResource: (resourceId: string) => void;
}

export const ResourceList: React.FC<ResourceListProps> = ({
  category,
  resources,
  onDeleteResource,
}) => {
  return (
    <div className="resource-list-container">
      {resources.length > 0 ? (
        <div className="resource-card-container">
          {resources.map((resource) => (
            <div key={resource.id} className="resource-card">
              <div className="resource-card-content">
                {" "}
                {/* Added content wrapper */}
                {resource.image && (
                  <img
                    src={URL.createObjectURL(resource.image)}
                    alt={resource.name}
                    className="resource-image" // Added image class
                  />
                )}
                <div className="resource-text">
                  {" "}
                  {/* Added text wrapper */}
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                </div>
                <button
                  onClick={() => onDeleteResource}
                  className="resource-delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-resources-message">
          <p>
            {category
              ? `No resources found in ${category}.`
              : "No resources found."}
          </p>
        </div>
      )}
    </div>
  );
};
