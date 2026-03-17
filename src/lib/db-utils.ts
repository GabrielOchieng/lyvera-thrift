export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  retries = 2,
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await queryFn();
    } catch (error: any) {
      if (error.code === "ETIMEDOUT" && i < retries - 1) {
        console.log(`🔄 DB Warming up... Retry ${i + 1}`);
        await new Promise((res) => setTimeout(res, 2000));
        continue;
      }
      throw error;
    }
  }
  throw new Error("DB Timeout after retries");
}
