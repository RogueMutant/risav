import React from "react";
import { Resource } from "../types/custom";

interface ResourceListProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  onResourceClick,
}) => (
  <div className="resource-list">
    {resources.map((resource) => (
      <div
        className="resource-card"
        key={resource._id}
        onClick={() => onResourceClick(resource)}
      >
        <img
          src={resource.imageUrl as string}
          alt={resource.name}
          className="resource-image"
        />
        <div className="resource-details">
          <h3>{resource.name}</h3>
          <p>{resource.description}</p>
          <div className="status-badge">
            <p
              className={
                resource.status && resource.status.includes("available")
                  ? "available"
                  : resource.status && resource.status.includes("reserved")
                  ? "reserved"
                  : resource.status && resource.status.includes("maintenance")
                  ? "maintenance"
                  : ""
              }
            >
              {resource.status || "Unknown Status"}{" "}
            </p>
          </div>
          <button className="details-button">Details</button>
        </div>
      </div>
    ))}
  </div>
);

export default ResourceList;
