import React, { useState } from "react";
import "../styles/settings.css";
import { UserSettings } from "../types/custom";
import Back from "../components/back";

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    pushNotificationsEnabled: true, // Default enabled
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
      <Back position="absolute" />
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
        <button type="submit" className="save-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};
