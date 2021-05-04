import {Dispatch, SetStateAction} from 'react';

export type USER_CONTEXT = {
  adminUsername: string;
  setAdminUsername: Dispatch<SetStateAction<string>>;
}