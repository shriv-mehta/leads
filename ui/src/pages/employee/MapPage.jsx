import { useEffect, useState } from "react";
import * as leadApi from "../../api/endpoints/leadApi";
import AreaPinMap from "../../features/map/AreaPinMap";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import { getErrorMessage } from "../../utils/getErrorMessage";

const MapPage = () => {
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState(null);

  const fetchMap = () => {
    setError(null);
    setGroups(null);
    leadApi
      .getLeadMap({})
      .then(({ data }) => setGroups(data))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load the map.")));
  };

  useEffect(fetchMap, []);

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">My Areas</h1>
      </div>
      {error && <ErrorState message={error} onRetry={fetchMap} />}
      {!error && !groups && <Loader />}
      {!error && groups && <AreaPinMap groups={groups} />}
    </div>
  );
};

export default MapPage;
