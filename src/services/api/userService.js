import { users } from '@/services/mockData/users.json';

let userData = [...users];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async () => {
  await delay(300);
  return [...userData];
};

export const getUserById = async (id) => {
  await delay(200);
  const user = userData.find(u => u.Id === parseInt(id));
  if (!user) throw new Error('User not found');
  return { ...user };
};

export const createUser = async (user) => {
  await delay(400);
  const newUser = {
    ...user,
    Id: Math.max(...userData.map(u => u.Id)) + 1,
    createdAt: new Date().toISOString()
  };
  userData.push(newUser);
  return { ...newUser };
};

export const updateUser = async (id, updates) => {
  await delay(300);
  const index = userData.findIndex(u => u.Id === parseInt(id));
  if (index === -1) throw new Error('User not found');
  
  userData[index] = { ...userData[index], ...updates };
  return { ...userData[index] };
};

export const deleteUser = async (id) => {
  await delay(250);
  const index = userData.findIndex(u => u.Id === parseInt(id));
  if (index === -1) throw new Error('User not found');
  
  userData.splice(index, 1);
  return true;
};