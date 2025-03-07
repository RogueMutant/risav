import React, { useState } from "react";
import "../styles/index.css";
import { Resource } from "../types/custom";
import { useResource } from "../hooks/useResource";
import { CreateResource } from "./createResource";
import { BsThreeDotsVertical, BsTrash, BsPen } from "react-icons/bs";

interface ResourceListProps {
  category: string | null;
  resources: Resource[];
}

export const ResourceList: React.FC<ResourceListProps> = ({
  category,
  resources,
}) => {
  const [dropdown, setDropdownOpen] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const { deleteResource, isLoading } = useResource();
  const [showCreateResource, setShowCreateResource] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);

  const toggleDropdown = (name: string) => {
    setDropdownOpen(dropdown === name ? null : name);
  };

  const handleEditResource = (resource: Resource) => {
    setResourceToEdit(resource);
    setShowCreateResource(true);
  };

  return (
    <div className="resource-list-container">
      {resources.length > 0 ? (
        resources.map((resource, index) => (
          <div key={index} className="resource-card-container">
            <div className="resource-card-content">
              {imageLoading ? (
                <div className="image-skeleton"></div>
              ) : (
                <img
                  src={resource.imageUrl as string}
                  alt={resource.name}
                  className="resource-image"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              )}
              <div className="resource-text">
                <h3>{resource.name}</h3>
                <p>{resource.description}</p>
                <div className="week-container">
                  {resource.availableDays
                    ? resource.availableDays.map((available, index) => {
                        return (
                          <p className="day-tile" key={index}>
                            {available}
                          </p>
                        );
                      })
                    : "No date available"}
                </div>
                <p>{`From ${resource.availableTime[0]} to ${resource.availableTime[1]}`}</p>
              </div>
              <div className="edit" style={{ marginTop: "10px" }}>
                <BsThreeDotsVertical
                  className="threeDots"
                  onClick={() => toggleDropdown(resource.name)}
                />
                {dropdown === resource.name && (
                  <div className="edit-drop">
                    <button
                      onClick={() => handleEditResource(resource)}
                      className="resource-button"
                    >
                      <BsPen />
                      Edit
                    </button>
                    <button
                      className="resource-button"
                      onClick={() =>
                        deleteResource(
                          resource._id as string,
                          resource.imageUrl as string
                        )
                      }
                    >
                      <BsTrash style={{ color: "red" }} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-resources-message">
          <p>
            {category
              ? `No resources found in ${category}.`
              : "No resources found."}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showCreateResource && (
        <CreateResource
          categories={[category || ""]} // Pass the current category
          onCancel={() => {
            setShowCreateResource(false);
            setResourceToEdit(null);
          }}
          isEditing={true}
          initialData={resourceToEdit as Resource}
        />
      )}
    </div>
  );
};
