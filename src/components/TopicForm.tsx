import { Button, TextField } from "@material-ui/core";

export const TopicForm: React.VFC = () => {
  return (
    <>
      <div className="flex items-center">
        <div>
          <TextField variant="outlined" placeholder="話題を入力" />
        </div>
        <div>
          <Button variant="outlined">作成</Button>
        </div>
      </div>
    </>
  );
};
