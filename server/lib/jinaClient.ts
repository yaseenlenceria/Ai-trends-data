/**
 * Jina AI Client
 * Handles all interactions with Jina AI Search and Reader APIs
 */

const JINA_API_KEY = process.env.JINA_API_KEY || "jina_d8046360c20a427aafc55afc07e20d5aY78HBbD27vWA6JdbfPUZV93Bxlb1";
const JINA_SEARCH_URL = "https://s.jina.ai/";
const JINA_READER_URL = "https://r.jina.ai/";

export interface JinaSearchOptions {
  query: string;
  count?: number;
  country?: string;
  language?: string;
  fetchFavicons?: boolean;
  readFullContent?: boolean;
  location?: string;
}

export interface JinaSearchResult {
  url: string;
  title: string;
  content: string;
  description?: string;
  favicon?: string;
  timestamp?: string;
}

export interface JinaReaderOptions {
  url: string;
  bypassCache?: boolean;
}

export interface JinaReaderResult {
  url: string;
  title: string;
  content: string;
  description?: string;
  images?: string[];
  links?: string[];
  metadata?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    [key: string]: any;
  };
}

/**
 * Search the web using Jina AI Search API
 */
export async function jinaSearch(options: JinaSearchOptions): Promise<JinaSearchResult[]> {
  const params = new URLSearchParams({
    q: options.query,
  });

  if (options.count) params.append('count', options.count.toString());
  if (options.country) params.append('country', options.country);
  if (options.language) params.append('language', options.language);
  if (options.location) params.append('location', options.location);

  const url = `${JINA_SEARCH_URL}?${params.toString()}`;

  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (JINA_API_KEY) {
    headers['Authorization'] = `Bearer ${JINA_API_KEY}`;
  }

  if (options.fetchFavicons) {
    headers['X-With-Generated-Alt'] = 'true';
  }

  if (options.readFullContent) {
    headers['X-With-Links-Summary'] = 'true';
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Jina Search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the response based on Jina's format
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error('Jina Search error:', error);
    throw error;
  }
}

/**
 * Read content from a URL using Jina AI Reader API
 */
export async function jinaReader(options: JinaReaderOptions): Promise<JinaReaderResult> {
  const url = `${JINA_READER_URL}${options.url}`;

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'X-Return-Format': 'json',
  };

  if (JINA_API_KEY) {
    headers['Authorization'] = `Bearer ${JINA_API_KEY}`;
  }

  if (options.bypassCache) {
    headers['X-No-Cache'] = 'true';
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Jina Reader API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.url || options.url,
      title: data.title || '',
      content: data.content || '',
      description: data.description,
      images: data.images || [],
      links: data.links || [],
      metadata: data.metadata || {},
    };
  } catch (error) {
    console.error('Jina Reader error:', error);
    throw error;
  }
}

/**
 * Batch search for multiple queries
 */
export async function batchSearch(queries: string[], options?: Omit<JinaSearchOptions, 'query'>): Promise<Map<string, JinaSearchResult[]>> {
  const results = new Map<string, JinaSearchResult[]>();

  for (const query of queries) {
    try {
      const searchResults = await jinaSearch({ ...options, query });
      results.set(query, searchResults);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
      results.set(query, []);
    }
  }

  return results;
}

/**
 * Batch read multiple URLs
 */
export async function batchReader(urls: string[], options?: Omit<JinaReaderOptions, 'url'>): Promise<Map<string, JinaReaderResult>> {
  const results = new Map<string, JinaReaderResult>();

  for (const url of urls) {
    try {
      const content = await jinaReader({ ...options, url });
      results.set(url, content);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error reading "${url}":`, error);
    }
  }

  return results;
}
