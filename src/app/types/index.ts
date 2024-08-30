export type MultiSelectFields = {
  id?: string | undefined,
  key?: string | undefined,
  name?: string | undefined,
  type?: string | undefined,
  order?: number | undefined,
  object?: string | undefined
}

export type ValuesType = {
  customField: string | undefined;
  customFieldLabel: string | undefined;
  selectedTag: string | undefined;
  selectedTagLabel: string | undefined;
};

export type Client = {
  avatarImageUrl?: string | undefined;
    companyId?: string | undefined;
    createdAt?: string | undefined;
    creationMethod?: string | undefined;
    email?: string | undefined;
    fallbackColor?: string | undefined;
    familyName?: string | undefined;
    firstLoginDate?: string | undefined;
    givenName?: string | undefined;
    id?: string | undefined;
    inviteUrl?: string | undefined;
    invitedBy?: string | undefined;
    lastLoginDate?: string | undefined;
    object?: string | undefined;
    status?: string | undefined;
}

export type MessageChannelData = {
  id?: string | undefined;
  object?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
  membershipType?: string | undefined;
  membershipEntityId?: string | undefined;
  memberIds?: string[] | undefined;
  lastMessageDate?: any;
}