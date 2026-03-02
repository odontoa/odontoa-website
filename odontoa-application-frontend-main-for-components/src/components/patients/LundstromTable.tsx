import { useState } from "react";
import { useTranslation } from "react-i18next";

export function LundstromTable() {
  const { t } = useTranslation();
  // Sample data for demonstration
  const [lundstromData, setLundstromData] = useState({
    upperJaw: {
      desiredSpace: "",
      availableSpace: "",
      difference: "",
      assessment: "",
    },
    lowerJaw: {
      desiredSpace: "",
      availableSpace: "",
      difference: "",
      assessment: "",
    },
  });

  // Handle input changes
  const handleInputChange = (
    jaw: "upperJaw" | "lowerJaw",
    field: "desiredSpace" | "availableSpace",
    value: string
  ) => {

    // Create a copy of the current data
    const newData = { ...lundstromData };

    // Update the specified field
    newData[jaw][field] = value;

    // Calculate difference if both values are numbers
    if (
      newData[jaw].desiredSpace !== "" &&
      newData[jaw].availableSpace !== ""
    ) {
      const desired = parseFloat(newData[jaw].desiredSpace);
      const available = parseFloat(newData[jaw].availableSpace);
      const diff = available - desired;

      newData[jaw].difference = diff.toFixed(1);

      // Set assessment based on difference
      if (diff > 0) {
        newData[jaw].assessment = t("patientComponents.lundstromTable.spaceSurplus");
      } else if (diff < 0) {
        newData[jaw].assessment = t("patientComponents.lundstromTable.spaceDeficit");
      } else {
        newData[jaw].assessment = t("patientComponents.lundstromTable.idealSpace");
      }
    } else {
      newData[jaw].difference = "";
      newData[jaw].assessment = "";
    }

    setLundstromData(newData);
  };

  // Helper to determine text color based on value
  const getValueColor = (value: string): string => {
    if (value === "") return "";
    const numValue = parseFloat(value);
    if (numValue > 0) return "text-green-600";
    if (numValue < 0) return "text-red-600";
    return "text-gray-700";
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        {t("patientComponents.lundstromTable.title")}
      </h3>
      <div className="overflow-hidden rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">
                {t("patientComponents.lundstromTable.parameter")}
              </th>
              <th className="py-3 px-4 text-center font-medium text-gray-700 border-b">
                {t("patientComponents.lundstromTable.upperJaw")}
              </th>
              <th className="py-3 px-4 text-center font-medium text-gray-700 border-b">
                {t("patientComponents.lundstromTable.lowerJaw")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 text-gray-700 border-b">
                {t("patientComponents.lundstromTable.requiredSpace")}
              </td>
              <td className="py-3 px-4 border-b">
                <input
                  type="number"
                  value={lundstromData.upperJaw.desiredSpace}
                  onChange={(e) =>
                    handleInputChange(
                      "upperJaw",
                      "desiredSpace",
                      e.target.value
                    )
                  }
                  className="w-full p-1.5 text-center border-0 bg-gray-50 rounded focus:ring-1 focus:ring-primary"
                  step="0.1"
                />
              </td>
              <td className="py-3 px-4 border-b">
                <input
                  type="number"
                  value={lundstromData.lowerJaw.desiredSpace}
                  onChange={(e) =>
                    handleInputChange(
                      "lowerJaw",
                      "desiredSpace",
                      e.target.value
                    )
                  }
                  className="w-full p-1.5 text-center border-0 bg-gray-50 rounded focus:ring-1 focus:ring-primary"
                  step="0.1"
                />
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-gray-700 border-b">
                {t("patientComponents.lundstromTable.availableSpace")}
              </td>
              <td className="py-3 px-4 border-b">
                <input
                  type="number"
                  value={lundstromData.upperJaw.availableSpace}
                  onChange={(e) =>
                    handleInputChange(
                      "upperJaw",
                      "availableSpace",
                      e.target.value
                    )
                  }
                  className="w-full p-1.5 text-center border-0 bg-gray-50 rounded focus:ring-1 focus:ring-primary"
                  step="0.1"
                />
              </td>
              <td className="py-3 px-4 border-b">
                <input
                  type="number"
                  value={lundstromData.lowerJaw.availableSpace}
                  onChange={(e) =>
                    handleInputChange(
                      "lowerJaw",
                      "availableSpace",
                      e.target.value
                    )
                  }
                  className="w-full p-1.5 text-center border-0 bg-gray-50 rounded focus:ring-1 focus:ring-primary"
                  step="0.1"
                />
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-700 border-b">
                {t("patientComponents.lundstromTable.difference")}
              </td>
              <td
                className={`py-3 px-4 text-center font-medium border-b ${getValueColor(
                  lundstromData.upperJaw.difference
                )}`}
              >
                {lundstromData.upperJaw.difference}
              </td>
              <td
                className={`py-3 px-4 text-center font-medium border-b ${getValueColor(
                  lundstromData.lowerJaw.difference
                )}`}
              >
                {lundstromData.lowerJaw.difference}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-700">{t("patientComponents.lundstromTable.assessment")}</td>
              <td
                className={`py-3 px-4 text-center font-medium ${getValueColor(
                  lundstromData.upperJaw.difference
                )}`}
              >
                {lundstromData.upperJaw.assessment}
              </td>
              <td
                className={`py-3 px-4 text-center font-medium ${getValueColor(
                  lundstromData.lowerJaw.difference
                )}`}
              >
                {lundstromData.lowerJaw.assessment}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
