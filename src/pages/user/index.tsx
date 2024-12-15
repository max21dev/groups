import { useParams } from 'react-router-dom';

export function UserPage(){
  const { user } = useParams();
  return <>
      User Profile for: {user}
  </>
}