import { parse } from 'tldjs';
import { Logger } from 'tslog';
import { BadUrlException, ProviderNotImplemented } from '../common/Error';
import { MangaInfoProvider } from './MangaInfoProvider';
import { ReadmanganatoProviderInfo } from './Sites/readmanganato.com';
import { ReadmngcomProviderInfo } from './Sites/readmng.com';

const log = new Logger();

export class MangaInfoProviderFactory {

    static providers = [
        ReadmngcomProviderInfo,
        ReadmanganatoProviderInfo
    ];

    static providersMap: { [x: string]: typeof ReadmngcomProviderInfo; };

    /**
     * @throws ProviderNotImplemented | BadUrlException | ContentPageNotFoundError
     */
    static async getMangaInfoProvider(pageUrl: string): Promise<MangaInfoProvider> {
        if (!this.providersMap) {
            this.prepareMap();
        }
        const parsedUrl = parse(pageUrl);
        let urlHost = parsedUrl.hostname;
        if (!parsedUrl.isValid || !urlHost) {
            throw new BadUrlException(pageUrl);
        }
        urlHost = urlHost.replace(/^www\./, '');

        if (!(urlHost in this.providersMap)) {
            throw new ProviderNotImplemented(urlHost);
        }

        const providerInfo: MangaInfoProvider = new this.providersMap[urlHost]();

        await providerInfo.setup(pageUrl);
        return providerInfo;
    }

    static prepareMap() {
        this.providersMap = {};
        this.providers.forEach(provider => {
            if (provider.hostnames.length === 0) {
                const err = new Error("No hostname for MangaInfoProvider " + provider.name);
                log.fatal(err);
                process.exit(-1);
            }

            provider.hostnames.forEach((hostname) => this.providersMap[hostname] = provider);
        });
    }

    static getProvidersHostname() : string[] {
        if (!this.providersMap) {
            this.prepareMap();
        }

        return Object.keys(this.providersMap);
    }
}

