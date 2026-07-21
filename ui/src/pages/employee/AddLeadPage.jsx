import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeadForm from "../../features/leads/LeadForm";
import * as areaApi from "../../api/endpoints/areaApi";
import * as leadApi from "../../api/endpoints/leadApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useToast } from "../../hooks/useToast";
import Loader from "../../components/common/Loader";

const DRAFT_KEY = "leadDraft";

// Keeps a draft in localStorage until the POST succeeds, so a flaky signal
// in the field doesn't lose the rep's typing.
const AddLeadPage = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [areas, setAreas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    areaApi
      .getAreas()
      .then(({ data }) => {
        setAreas(data.areas);
        // Area starts blank on a fresh form — only an unsaved draft from this
        // same browser (a genuinely interrupted save) restores prior text.
        const draft = localStorage.getItem(DRAFT_KEY);
        setInitialValues(draft ? JSON.parse(draft) : {});
      })
      .catch(() => setInitialValues({}));
  }, []);

  const handleChange = (values) => localStorage.setItem(DRAFT_KEY, JSON.stringify(values));

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { data, duplicateWarning } = await leadApi.createLead(values);
      localStorage.removeItem(DRAFT_KEY);
      if (duplicateWarning) {
        showToast(
          `Heads up: ${duplicateWarning.contactName} at ${duplicateWarning.companyName} may already be a lead (logged by ${duplicateWarning.ownerName || "a teammate"}).`,
          "default"
        );
      }
      showToast("Lead saved.", "success");
      navigate(`/leads/${data.id}`);
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't save this lead — it's still saved as a draft."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialValues) return <Loader />;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Add Lead</h1>
      </div>
      <LeadForm
        initialValues={initialValues}
        areaSuggestions={areas}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save Lead"
      />
    </div>
  );
};

export default AddLeadPage;
