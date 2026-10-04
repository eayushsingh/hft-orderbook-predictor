import { IMarketDataProvider, ProviderHealth } from "./dataProviderInterface";

export class DataProviderRegistry {
  private static instance: DataProviderRegistry;
  private providers: Map<string, IMarketDataProvider> = new Map();

  private constructor() {}

  public static getInstance(): DataProviderRegistry {
    if (!DataProviderRegistry.instance) {
      DataProviderRegistry.instance = new DataProviderRegistry();
    }
    return DataProviderRegistry.instance;
  }

  public registerProvider(provider: IMarketDataProvider): void {
    this.providers.set(provider.providerName, provider);
  }

  public getProvider(name: string): IMarketDataProvider | undefined {
    return this.providers.get(name);
  }

  public getAllProviders(): IMarketDataProvider[] {
    return Array.from(this.providers.values());
  }

  public async getAllProviderHealth(): Promise<ProviderHealth[]> {
    const healthPromises = Array.from(this.providers.values()).map((p) => p.getHealthStatus());
    return Promise.all(healthPromises);
  }
}
