import { useNavigate, useParams } from 'react-router-dom';

export const useActiveGroup = () => {
  const { relay, groupId } = useParams();

  const navigate = useNavigate();

  const setActiveGroupId = (groupId: string | undefined) => {
    if (groupId) {
      navigate(`/${relay}/${groupId}`);
    } else {
      navigate(`/${relay}`);
    }
  };

  return { activeGroupId: groupId, setActiveGroupId };
};
