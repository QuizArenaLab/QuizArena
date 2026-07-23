export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { InfrastructureBootstrap } = await import("./platform/bootstrap/InfrastructureBootstrap");
    await InfrastructureBootstrap.start();
  }
}
