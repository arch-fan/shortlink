export const JResponse = <T>(body: T, status?: number) => {
  return new Response(JSON.stringify(body), {
    status: status ?? 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
