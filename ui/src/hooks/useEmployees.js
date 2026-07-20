import { useEffect, useState } from "react";
import * as userApi from "../api/endpoints/userApi";

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    userApi
      .getUsers({ limit: 100 })
      .then(({ data }) => setEmployees(data.filter((u) => u.role === "employee")))
      .catch(() => {});
  }, []);

  return employees;
};
