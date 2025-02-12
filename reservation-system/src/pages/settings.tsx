import React, { useState } from "react";
import "../styles/settings.css";
import { UserSettings } from "../types/custom";

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    pushNotificationsEnabled: true, // Default enabled
    emailNotificationsEnabled: false, // Default disabled
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = event.target as HTMLInputElement;
    const checked = (event.target as HTMLInputElement).checked;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value, // Handle checkboxes
    } as UserSettings);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Saving settings:", settings);
    alert("Settings saved!");
  };

  return (
    <div className="settings-container">
      <form onSubmit={handleSubmit}>
        <div className="settings-group">
          <h2>Push Notifications</h2>
          <div className="setting-item">
            <label htmlFor="pushNotificationsEnabled">
              Enable Push Notifications:
            </label>
            <input
              type="checkbox"
              id="pushNotificationsEnabled"
              name="pushNotificationsEnabled"
              checked={settings.pushNotificationsEnabled}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-group">
          <h2>Email Notifications</h2>
          <div className="setting-item">
            <label htmlFor="emailNotificationsEnabled">
              Enable Email Notifications:
            </label>
            <input
              type="checkbox"
              id="emailNotificationsEnabled"
              name="emailNotificationsEnabled"
              checked={settings.emailNotificationsEnabled}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};
