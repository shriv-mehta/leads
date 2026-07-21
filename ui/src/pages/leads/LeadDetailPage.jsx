import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeadForm from "../../features/leads/LeadForm";
import ActivityLog from "../../features/leads/ActivityLog";
import * as leadApi from "../../api/endpoints/leadApi";
import * as areaApi from "../../api/endpoints/areaApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/common/Button";

const LeadDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  const fetchLead = useCallback(async () => {
    setError(null);
    try {
      const { data } = await leadApi.getLeadById(id);
      setLead(data);
    } catch (err) {
      setError(getErrorMessage(err, "This lead couldn't be found."));
    }
  }, [id]);

  useEffect(() => {
    fetchLead();
    areaApi.getAreas().then(({ data }) => setAreas(data.areas)).catch(() => {});
  }, [fetchLead]);

  const handleSave = async (values) => {
    setIsSaving(true);
    try {
      // Duplicate warnings matter when a rep is about to create a fresh
      // lead blind — on an edit they're already looking at the record,
      // so this just re-surfaces noise about itself/a sibling. Skip it here.
      await leadApi.updateLead(id, values);
      showToast("Lead updated.", "success");
      await fetchLead();
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't save changes."), "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddActivity = async (payload) => {
    setIsAddingActivity(true);
    try {
      await leadApi.addActivity(id, payload);
      await fetchLead();
      return true;
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't log that activity."), "error");
      return false;
    } finally {
      setIsAddingActivity(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this lead? This can't be undone from the UI.")) return;
    try {
      await leadApi.deleteLead(id);
      showToast("Lead deleted.", "success");
      navigate("/admin/leads");
    } catch (err) {
      showToast(getErrorMessage(err, "Couldn't delete this lead."), "error");
    }
  };

  if (error) return <ErrorState message={error} onRetry={fetchLead} />;
  if (!lead) return <Loader />;

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">{lead.contactName}</h1>
        {user.role === ROLES.ADMIN && (
          <Button variant="danger" size="sm" label="Delete Lead" onClick={handleDelete} />
        )}
      </div>

      <div className="grid grid--cols-2">
        <Card title="Lead Details">
          <LeadForm
            initialValues={lead}
            areaSuggestions={areas}
            onSubmit={handleSave}
            isSubmitting={isSaving}
            submitLabel="Save Changes"
            showStatus
          />
        </Card>
        <Card title="Follow-up Activity">
          <ActivityLog activities={lead.activities || []} onAdd={handleAddActivity} isSubmitting={isAddingActivity} />
        </Card>
      </div>
    </div>
  );
};

export default LeadDetailPage;
