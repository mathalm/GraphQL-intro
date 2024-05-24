import { gql, useMutation, useQuery } from "@apollo/client";
import { FormEvent, useState } from "react";

type User = {
  id: string;
  name: string;
};

const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`;

const CREATE_USER = gql`
  mutation ($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`;

const Forms = () => {
  const [name, setName] = useState("");
  const [createUser] = useMutation(CREATE_USER);
  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();

    if (!name) {
      return;
    }
    await createUser({
      variables: {
        name,
      },
      refetchQueries: [GET_USERS],
    });

    setName("");
  };

  return (
    <form onSubmit={handleCreateUser}>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <button type="submit">Salvar</button>
    </form>
  );
};

function App() {
  const { data, loading } = useQuery<{ users: User[] }>(GET_USERS);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <ul>
      <Forms />
      {data?.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default App;
