const { createProxyMiddleware } = require('http-proxy-middleware')
import { Express, Request, Response, NextFunction } from 'express';
import { MangaInfoProviderFactory } from '../Providers/MangaInfoProvider.factory';
import { Logger } from 'tslog';
import { parse } from 'tldjs';
import { BadUrlException, ContentPageNotFoundError, ProviderNotImplemented } from '../common/Error';
import { OnErrorCallback, OnProxyReqCallback, OnProxyResCallback } from 'http-proxy-middleware/dist/types';
import { ClientRequest, IncomingMessage } from 'http';

const log = new Logger();

const whitelist = MangaInfoProviderFactory.getProvidersHostname();



function extractImageUrl(url: string): string {
    var reg = new RegExp('^/image-proxy/(.*)');
    var targetUrl = url.match(reg);

    return targetUrl ? targetUrl[1] : "";
}

function extractHostFromUrl(url: string): string {
    const parsedUrl = parse(url);
    let urlHost = parsedUrl.hostname;
    if (!parsedUrl.isValid || !urlHost) {
        throw new BadUrlException(url);
    }
    urlHost = urlHost.replace(/^www\./, '');

    return urlHost;
}

/**
 * @return {Boolean}
 */
const filter = function (pathname: string, req: Request) {
    if (!pathname.match('^/image-proxy') || req.method !== 'GET') {
        return false;
    }
    
    var targetUrl = extractImageUrl(req.url);
    
    log.debug(targetUrl);
    
    const urlHost = extractHostFromUrl(targetUrl);
    
    return true;
};

// Your custom "middleware" function:
export function GetImageProxyMiddleware(): (req: Request, res: Response, next: NextFunction) => void {
    return createProxyMiddleware(filter, {
        router: (req: Request) => new URL(extractImageUrl(req.url)),
        pathRewrite: (path: string, req: Request) => (new URL(extractImageUrl(req.url))).pathname,
        changeOrigin: true,
        on: {
            proxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
                if (proxyReq.hasHeader("Authorization")) {
                    proxyReq.removeHeader("Authorization");
                }
                if (proxyReq.hasHeader("Cookie")) {
                    proxyReq.removeHeader("Cookie");
                }
                proxyReq.setHeader("Accept", "image/*");
            },
            proxyRes: (proxyRes: IncomingMessage, req:  Request, res: Response) => {
              /* handle proxyRes */
            },
            error: (err: Error, req:  Request, res: Response) => {
                console.log("errrrooooooooooooooooooooooooooor");
            },
        },
    });
}