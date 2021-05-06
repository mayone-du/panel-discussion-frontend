import {Dispatch, SetStateAction} from 'react';

export type USER_CONTEXT = {
  isAdminLogin: boolean;
  setIsAdminLogin: Dispatch<SetStateAction<boolean>>;
  isAdminEditMode: boolean;
  setIsAdminEditMode: Dispatch<SetStateAction<boolean>>;
}