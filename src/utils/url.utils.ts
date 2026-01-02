import { useSearchParams } from "react-router-dom";

export function extractQuerryParams(params: string): string | null {
    const [searchParams] = useSearchParams();
    const paramValue = searchParams.get(params);

    return paramValue;
}

export function checkStringIsInURL(stringToCheck: string): boolean {
    const dest = '/' + stringToCheck;
    const currentURL = window.location.href;
    return currentURL.includes(dest);
}