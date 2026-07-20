import { useState } from "react";
import Input from "../../components/common/Input";
import TextArea from "../../components/common/TextArea";
import DatePicker from "../../components/common/DatePicker";
import Select from "../../components/common/Select";
import ChanceToggle from "../../components/common/ChanceToggle";
import Button from "../../components/common/Button";
import { todayDateOnly } from "../../utils/formatters";
import { STATUS_OPTIONS } from "../../utils/constants";

const LeadForm = ({
  initialValues,
  areaSuggestions = [],
  onChange,
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
  showStatus = false,
}) => {
  // A saved lead comes back from the API with null for any unset optional
  // field (designation, phone, …) — null on a controlled input trips
  // React's "should not be null" warning, so coerce to "" up front.
  const cleanedInitialValues = Object.fromEntries(
    Object.entries(initialValues || {}).map(([key, value]) => [key, value === null ? "" : value])
  );

  const [values, setValues] = useState({
    contactName: "",
    companyName: "",
    designation: "",
    email: "",
    phone: "",
    metOn: todayDateOnly(),
    conversationNotes: "",
    businessChance: "warm",
    status: "new",
    area: "",
    nextFollowupOn: "",
    ...cleanedInitialValues,
  });
  const [formError, setFormError] = useState(null);

  const update = (patch) => {
    setValues((prev) => {
      const next = { ...prev, ...patch };
      onChange?.(next);
      return next;
    });
  };

  const handleField = (key) => (event) => update({ [key]: event.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!values.email && !values.phone) {
      setFormError("Enter at least an email or a phone number.");
      return;
    }
    setFormError(null);

    // Optional text/date fields left blank must be omitted, not sent as "" —
    // an empty string still passes zod's .optional() string checks but then
    // fails at the database (e.g. "" isn't a valid DATEONLY for nextFollowupOn).
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, value]) => value !== "")
    );
    onSubmit(payload);
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <Input name="contactName" label="Contact name" required value={values.contactName} onChange={handleField("contactName")} />
      <Input name="companyName" label="Company" required value={values.companyName} onChange={handleField("companyName")} />
      <Input name="designation" label="Designation" value={values.designation} onChange={handleField("designation")} />
      <Input
        name="email"
        label="Email"
        type="email"
        value={values.email}
        onChange={handleField("email")}
        error={formError}
      />
      <Input name="phone" label="Phone" value={values.phone} onChange={handleField("phone")} />
      <DatePicker name="metOn" label="Date" value={values.metOn} onChange={handleField("metOn")} />
      <TextArea
        name="conversationNotes"
        label="Conversation notes"
        rows={3}
        value={values.conversationNotes}
        onChange={handleField("conversationNotes")}
      />
      <ChanceToggle value={values.businessChance} onChange={(value) => update({ businessChance: value })} />
      {showStatus && (
        <Select name="status" label="Status" options={STATUS_OPTIONS} value={values.status} onChange={handleField("status")} />
      )}
      <Input
        name="area"
        id="area"
        label="Area"
        required
        list="lead-form-area-suggestions"
        value={values.area}
        onChange={handleField("area")}
        hint='Free text, e.g. "Allard, Edmonton" — a pin is placed automatically.'
      />
      <datalist id="lead-form-area-suggestions">
        {areaSuggestions.map((area) => (
          <option key={area} value={area} />
        ))}
      </datalist>
      <DatePicker
        name="nextFollowupOn"
        label="Next follow-up (optional)"
        value={values.nextFollowupOn || ""}
        onChange={handleField("nextFollowupOn")}
      />
      <Button type="submit" label={submitLabel} full disabled={isSubmitting} />
    </form>
  );
};

export default LeadForm;
