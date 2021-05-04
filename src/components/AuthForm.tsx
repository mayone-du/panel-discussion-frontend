import { Button, TextField } from "@material-ui/core";
import { useState } from "react";

export const AuthForm: React.VFC = () => {
  const [name, setName] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <>
      <div>
        <div>
          <TextField
            type="text"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <Button variant='contained'>ログイン</Button>
        </div>

        <div className="text-lg">{name}</div>
      </div>
    </>
  );
};
