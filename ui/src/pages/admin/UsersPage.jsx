import { useEffect, useState } from "react";
import * as userApi from "../../api/endpoints/userApi";
import CreateEmployeeForm from "../../features/users/CreateEmployeeForm";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/getErrorMessage";

const UsersPage = () => {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const fetchUsers = () => {
    setError(null);
    userApi
      .getUsers({ limit: 100 })
      .then(({ data }) => setUsers(data))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load employees.")));
  };

  useEffect(fetchUsers, []);

  const handleCreate = async (values) => {
    setIsSubmitting(true);
    try {
      await userApi.createEmployee(values);
      showToast("Employee created.", "success");
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't create employee."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (user) => {
    try {
      await userApi.updateUser(user.id, { isActive: !user.isActive });
      showToast(user.isActive ? "Employee deactivated." : "Employee reactivated.", "success");
      fetchUsers();
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't update employee."), "error");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone", render: (u) => u.phone || "—" },
    { key: "role", label: "Role" },
    { key: "isActive", label: "Status", render: (u) => (u.isActive ? "Active" : "Deactivated") },
    {
      key: "actions",
      label: "",
      render: (u) =>
        u.role === "employee" && (
          <Button
            size="sm"
            variant={u.isActive ? "secondary" : "primary"}
            label={u.isActive ? "Deactivate" : "Reactivate"}
            onClick={() => toggleActive(u)}
          />
        ),
    },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Manage Employees</h1>
        <Button label="Add Employee" onClick={() => setIsModalOpen(true)} />
      </div>

      {error && <ErrorState message={error} onRetry={fetchUsers} />}
      {!error && !users && <Loader />}
      {!error && users && <Table columns={columns} rows={users} keyField="id" />}

      <Modal title="Add Employee" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateEmployeeForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
      </Modal>
    </div>
  );
};

export default UsersPage;
