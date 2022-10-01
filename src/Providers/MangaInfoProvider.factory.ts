import { parse } from 'tldjs';
import { BadUrlException, ProviderNotImplemented } from '../common/Error';
import { MangaInfoProvider } from './MangaInfoProvider';
import { ReadmanganatoProviderInfo } from './Sites/readmanganato.com';
import { ReadmngcomProviderInfo } from './Sites/readmng.com';

/**
 * @throws ProviderNotImplemented | BadUrlException | ContentPageNotFoundError
 */
export async function getMangaInfoProvider(pageUrl: string): Promise<MangaInfoProvider> {
    const parsedUrl = parse(pageUrl);
    let urlHost = parsedUrl.hostname;
    if (!parsedUrl.isValid || !urlHost) {
        throw new BadUrlException(pageUrl);
    }
    urlHost = urlHost.replace(/^www\./, '');

    let providerInfo: MangaInfoProvider;

    switch (urlHost) {
        case "readmng.com":
            providerInfo = new ReadmngcomProviderInfo();
            break;
        case "readmanganato.com":
            providerInfo = new ReadmanganatoProviderInfo();
            break;
        default:
            throw new ProviderNotImplemented(urlHost);
    }

    await providerInfo.setup(pageUrl);
    return providerInfo;
}