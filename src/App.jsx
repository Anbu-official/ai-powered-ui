// Import necessary libraries
import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { extract, login } from "./services/apicall";
import { classNames } from "primereact/utils";
import { isValidUrl } from "./utils/commonFunction";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

let timeoutId;
export default function AIPoweredExtractor() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [authIn, setAuthIn] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);

  const toast = useRef(null);

  const showClear = url && !isValidUrl(url);
  const showSubmit = isValidUrl(url);

  const show = (content) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: content || "Something went wrong.",
    });
  };

  const handleLogin = async () => {
    if (!password && !username) return;

    try {
      await login({ username, password });
      setAuthIn(true);
    } catch (err) {
      console.error("Login failed", err);
      show(err.message);
    }
  };

  const debounced = (e) => {
    const value = e.target.value.trim();
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      handleExtract(value);
    }, 500);
  };

  const handleExtract = async (values) => {
    if (!isValidUrl(url)) return;

    setLoading(true);
    try {
      const response = await extract({ url, keySearch: values });
      setData(response.data.result || []);
    } catch (err) {
      console.error("Extraction failed", err);
      show(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {!authIn ? (
        <div className="flex flex-column align-items-center justify-content-center">
          <div
            style={{
              borderRadius: "56px",
              padding: "0.3rem",
            }}
          >
            <div
              className="surface-card py-8 px-5 sm:px-8"
              style={{ borderRadius: "53px", width: "87%" }}
            >
              <div className="text-center mb-5">
                <div className="text-900 text-3xl font-medium mb-3">
                  Welcome!
                </div>
                <span className="text-600 font-medium">
                  Sign in to continue
                </span>
              </div>

              <div>
                <label
                  htmlFor="email1"
                  className="block text-900 text-xl font-medium mb-2"
                >
                  User Name
                </label>
                <InputText
                  id="email1"
                  type="text"
                  placeholder="User Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full md:w-30rem mb-5"
                  style={{ padding: "1rem" }}
                />

                <label
                  htmlFor="password1"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Password
                </label>
                <Password
                  inputId="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full mb-5"
                  inputClassName="w-full p-3 md:w-30rem"
                ></Password>

                <Button
                  label="Sign In"
                  type="submit"
                  className="w-full p-3 text-xl"
                  onClick={handleLogin}
                ></Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <DataTable
            value={data}
            paginator
            rows={10}
            globalFilter={globalFilter}
            header={
              <div className="flex justify-content-between">
                <span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText
                    style={{ minWidth: "321px" }}
                    type="search"
                    onInput={debounced}
                    placeholder="New Points search in same website"
                  />
                </span>
                <span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Key Point Search"
                  />
                </span>
              </div>
            }
          >
            <Column
              field="Extracted Content"
              header="Title"
              sortable
              filter
            ></Column>
            <Column field="Summary" header="Summary" sortable filter></Column>
            <Column
              field="Key Points"
              header="Key Points"
              body={(rowData) => (
                <ol style={{ paddingLeft: "1rem", margin: 0 }}>
                  {rowData["Key Points"]?.map((point, index) => (
                    <li key={index} style={{ marginBottom: "0.5rem" }}>
                      {point}
                    </li>
                  ))}
                </ol>
              )}
            />
          </DataTable>

          <div className=" relative flex w-full items-end px-3 py-3">
            <span className="p-input-icon-right w-full flex items-center gap-2">
              <InputText
                placeholder="Enter a public URL"
                className={classNames("w-full", {
                  "p-invalid": url && !isValidUrl(url),
                })}
                invalid={showSubmit}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {showClear && (
                <Button
                  icon="pi pi-times"
                  className="p-button-text p-button-danger"
                  onClick={() => setUrl("")}
                  style={{ borderRadius: "50px" }}
                  tooltipOptions={{ position: "top" }}
                  tooltip="Clear"
                />
              )}
              {showSubmit && (
                <Button
                  icon="pi pi-send"
                  className="p-button-primary"
                  onClick={() => handleExtract()}
                  loading={loading}
                  style={{ borderRadius: "50px" }}
                  tooltipOptions={{ position: "top" }}
                  tooltip="Submit"
                />
              )}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
