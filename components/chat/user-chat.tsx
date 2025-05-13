type UserChatProps = {
  message: string;
};

export default function UserChat({ message }: UserChatProps) {
  return (
    <div className="flex justify-end">
      <p className="bg-accent text-accent-foreground max-w-1/2 rounded-2xl rounded-tr-xs px-3 py-2">
        {message}
      </p>
    </div>
  );
}
