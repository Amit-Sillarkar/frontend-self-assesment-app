export interface TrueinUser {
  id: string;
  name: string;
  mobile: string;
  designation: string;
  trueinRole: string;
  customRole: string | null;
}

export const MOCK_TRUEIN_USERS: TrueinUser[] = [
  { id: "TRU001", name: "Emma Watson", mobile: "9998887771", designation: "Machine Operator", trueinRole: "Labor", customRole: null },
  { id: "TRU002", name: "Tom Hardy", mobile: "9998887772", designation: "Assembly Line Worker", trueinRole: "Labor", customRole: null },
  { id: "TRU003", name: "Chris Evans", mobile: "9998887773", designation: "Quality Control", trueinRole: "Labor", customRole: null },
  { id: "TRU004", name: "Scarlett Johnson", mobile: "9998887774", designation: "Floor Supervisor", trueinRole: "Supervisor", customRole: null },
  { id: "TRU005", name: "Robert Downey", mobile: "9998887775", designation: "Plant Manager", trueinRole: "Admin", customRole: null },
];