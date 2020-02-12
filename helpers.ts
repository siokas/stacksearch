/**
 *
 * Simple http get fetching from given url
 *
 * @param url (String) to fetch
 * @return (Primise<T>) response that came back
 */
export function http_get<T>(url: string): Promise<T> {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

/**
 *
 * Just strip off HTML tags from a given string
 *
 * @param text (String) to remove the html tags
 * @return (String) without html tags
 */
export function escape_html_tags(text: string): string {
  return text.replace(/<\/?[^>]+(>|$)/g, "");
}
