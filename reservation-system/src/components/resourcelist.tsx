import React, { useState } from "react";
import "../styles/index.css";
import { Resource } from "../types/custom";
import { useResources } from "../components/resourceContext";

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
  const [imageLoading, setImageLoading] = useState(true);

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
              {/* <button
                  onClick={() => onDeleteResource}
                  className="resource-delete-button"
                >
                  Delete
                </button> */}
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
    </div>
  );
};
