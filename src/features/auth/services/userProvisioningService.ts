interface ProvisionUserInput {
  email: string;
  displayName: string;
}

export interface ProvisionedUser {
  uid: string;
  email: string;
}

const localId = () => `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const userProvisioningService = {
  async createUser(input: ProvisionUserInput): Promise<ProvisionedUser> {
    const email = input.email.trim().toLowerCase();
    return {
      uid: localId(),
      email,
    };
  },
};
