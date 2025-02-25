<script setup lang="ts">
import { computed, ref } from "vue";
import { useAccountStore } from "../stores/accountStore.ts";
import "@fortawesome/fontawesome-free/css/all.css";

const accountStore = useAccountStore();
const accounts = computed(() => accountStore.accounts);

const passwordVisibility = ref<Record<number, boolean>>({});

function addAccount() {
  accountStore.addAccount();
}

function removeAccount(id: number) {
  accountStore.removeAccount(id);
  delete passwordVisibility.value[id];
}

function updateLabel(account: any) {
  account.label = account.label.split(";").map((text: string) => ({ text: text.trim() }));
  updateAccount(account);
}

function updateAccount(account: any) {
  accountStore.updateAccount(account);
}

function isValidLabel(account: any) {
  return account.label.length <= 50;
}

function isValidLogin(account: any) {
  return account.login.length > 0 && account.login.length <= 100;
}

function isValidPassword(account: any) {
  return account.type === "LDAP" || (account.password && account.password.length <= 100);
}

function togglePasswordVisibility(id: number) {
  passwordVisibility.value[id] = !passwordVisibility.value[id];
}
</script>

<template>
  <div class="container">
    <div class="field">
      <button class="button is-primary" @click="addAccount">Добавить учетную запись</button>
    </div>
    <div v-for="account in accounts" :key="account.id" class="box">
      <div class="field is-flex">
        <div class="control">
          <label class="label">Метка</label>
          <input class="input" type="text" v-model="account.label" @blur="updateLabel(account)" :class="{ 'is-danger': !isValidLabel(account) }" />
        </div>
        <div class="control">
          <label class="label">Тип записи</label>
          <div class="select">
            <select v-model="account.type" @change="updateAccount(account)">
              <option value="LDAP">LDAP</option>
              <option value="Local">Локальная</option>
            </select>
          </div>
        </div>
        <div class="control">
          <label class="label">Логин</label>
          <input class="input" type="text" v-model="account.login" @blur="updateAccount(account)" :class="{ 'is-danger': !isValidLogin(account) }" />
        </div>
        <div class="control" v-if="account.type === 'Local'">
          <label class="label">Пароль</label>
          <div class="password-input">
            <input
              class="input"
              :type="passwordVisibility[account.id] ? 'text' : 'password'"
              v-model="account.password"
              @blur="updateAccount(account)"
              :class="{ 'is-danger': !isValidPassword(account) }"
            />
            <i class="fas" :class="passwordVisibility[account.id] ? 'fa-eye-slash' : 'fa-eye'" @click="togglePasswordVisibility(account.id)"></i>
          </div>
        </div>
        <button class="button is-danger align-bottom" @click="removeAccount(account.id)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  box-sizing: border-box;
}

.field.is-flex {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.control {
  flex-grow: 1;
}

.password-input {
  position: relative;
}

.password-input .input {
  width: 100%;
  padding-right: 30px;
}

.password-input i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #650;
}

.button.is-danger {
  font-size: 25px;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  align-self: flex-end;
}

.button.is-danger:hover {
  color: darkred;
}

.is-danger {
  border-color: red;
}
</style>
