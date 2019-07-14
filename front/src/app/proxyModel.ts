
export class ProxyModel {
    id: number;
    name: string;
    encoding: string;
    description: string;
    slug: string;
    destination: string;
    owner: string;
    delay: number;
    allowedTo: string[];
    createdAt: Date;

    lastUsage: Date; // only in proxy config.
}
