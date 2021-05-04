import { TextField } from '@material-ui/core'
import { useState } from 'react';

export const Auth: React.VFC = () => {
  const [name, setName] = useState('');
  const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  return (
    <>
      <TextField
        type="text"
        value={name}
        onChange={handleNameChange}
      />
    </>
  );
};
