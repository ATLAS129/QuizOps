export const formatTime = (value: number) => {
  const mins = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const secs = (value % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};
