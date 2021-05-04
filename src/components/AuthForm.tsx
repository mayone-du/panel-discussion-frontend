import { TextField } from '@material-ui/core'
import { useState } from 'react';

export const AuthForm: React.VFC = () => {
  const [name, setName] = useState('');
  const handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  return (
    <>
      <TextField
        type="text"
        variant='outlined'
        value={name}
        onChange={handleNameChange}
      />
      <div className="text-lg">
        {name}
      </div>
    </>
  );
};
