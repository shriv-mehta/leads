import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const CreateEmployeeForm = ({ onSubmit, isSubmitting }) => {
  const [values, setValues] = useState({ name: "", email: "", phone: "", password: "" });

  const handle = (key) => (event) => setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <Input name="name" label="Name" required value={values.name} onChange={handle("name")} />
      <Input name="email" label="Email" type="email" required value={values.email} onChange={handle("email")} />
      <Input name="phone" label="Phone" value={values.phone} onChange={handle("phone")} />
      <Input
        name="password"
        label="Temporary password"
        type="password"
        required
        minLength={8}
        value={values.password}
        onChange={handle("password")}
        hint="At least 8 characters. Share it with the rep directly."
      />
      <Button type="submit" label="Create Employee" full disabled={isSubmitting} />
    </form>
  );
};

export default CreateEmployeeForm;
