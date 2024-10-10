export const bearerAuth = (token: string) => ({
  Authorization: `Bearer ${token}`,
});
