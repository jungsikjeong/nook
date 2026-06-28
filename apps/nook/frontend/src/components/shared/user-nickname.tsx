type Props = {
  nickname?: string | null;
};

export function UserNickname({ nickname }: Props) {
  if (!nickname) return null;

  return (
    <p
      className='max-w-28 truncate text-sm text-foreground/70'
      title={nickname}
    >
      {nickname}
    </p>
  );
}
