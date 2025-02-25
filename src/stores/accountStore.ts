import { defineStore } from "pinia";

export interface Account {
  id: number;
  label: { text: string }[];
  type: "LDAP" | "Local";
  login: string;
  password: string | null;
}

export const useAccountStore = defineStore("accountStore", {
  state: () => ({
    accounts: [] as Account[],
    nextId: 1,
  }),
  actions: {
    addAccount() {
      this.accounts.push({
        id: this.nextId++,
        label: [],
        type: "Local",
        login: "",
        password: "",
      });
    },
    removeAccount(id: number) {
      this.accounts = this.accounts.filter((account) => account.id !== id);
    },
    updateAccount(updatedAccount: Account) {
      const index = this.accounts.findIndex((account) => account.id === updatedAccount.id);
      if (index !== -1) {
        this.accounts[index] = updatedAccount;
      }
    },
  },
});
