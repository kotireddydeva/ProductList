import { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type { FC } from "react";


interface Column {
  id: number;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  validation: string;
  vlvs: string[];
}

const DynamicForm: FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const url: string = "http://localhost:8088/columns";

  useEffect(() => {
    const readMetaData = async (): Promise<void> => {
      try {
        const response: AxiosResponse<Column[]> = await axios.get(url);
        setColumns(response.data);

        // Initialize form data
        const initialData: Record<string, string> = {};
        response.data.forEach((col) => {
          initialData[col.name] = "";
        });
        setFormData(initialData);
      } catch (error) {
        console.error("Error fetching column metadata:", (error as Error).message);
      }
    };
    readMetaData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => {
      if (type === "checkbox") {
        const prevValues = Array.isArray(prev[name]) ? (prev[name] as string[]) : [];
        if (checked) {
          return {
            ...prev,
            [name]: [...prevValues, value],
          };
        } else {
          return {
            ...prev,
            [name]: prevValues.filter((val) => val !== value),
          };
        }
      } else if (type === "radio") {
        return {
          ...prev,
          [name]: value,
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add submission logic here (e.g., POST to API)
  };

  return (
    <form onSubmit={handleSubmit}>
      {columns.map((col) => (
        <div key={col.id} style={{ marginBottom: "1rem" }}>
          <label>{col.label}</label><br />

          {/* Render radio/checkbox buttons */}
          {(col.type === "radio" || col.type === "checkbox") && col.vlvs ? (
            col.vlvs.split(",").map((option) => (
              <label key={option.trim()} style={{ display: "block" }}>
                <input
                  type={col.type}
                  name={col.name}
                  value={option.trim()}
                  checked={
                    col.type === "checkbox"
                      ? Array.isArray(formData[col.name]) && formData[col.name].includes(option.trim())
                      : formData[col.name] === option.trim()
                  }
                  onChange={handleChange}
                  required={col.validation === "required" && col.type === "radio"}
                />
                {option.trim()}
              </label>
            ))
          ) : col.type === "select" && col.vlvs ? (
            <select
              id={col.name}
              name={col.name}
              value={formData[col.name] || ""}
              required={col.validation === "required"}
              onChange={handleChange}
            >
              <option value="">Select {col.label}</option>
              {col.vlvs.split(",").map((option) => (
                <option key={option.trim()} value={option.trim()}>
                  {option.trim()}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={col.type}
              id={col.name}
              name={col.name}
              placeholder={col.placeholder}
              value={formData[col.name] || ""}
              required={col.validation === "required"}
              pattern={col.pattern || undefined}
              onChange={handleChange}
            />
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm;