import { useState } from 'react';

export const API_BASE_URL = 'dglserver-production.up.railway.app';

type FetchOptions = {
  url: string;
  v?: number;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

type PostOptions = FetchOptions & {
  body: JsonObject;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
};

type FieldError = {
  field: string;
  message: string;
};

type FetchResponse<T = any> = {
  ok: boolean;
  data?: T;
  message?: string;
  errors?: FieldError[];
};
export default function useFetch() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setError] = useState<string | null>(null);

  const Post = async <T = any,>({
    url,
    body = {},
    v = 1,
    method = 'POST',
  }: PostOptions): Promise<FetchResponse<T>> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v${v}${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Something went wrong');
        return {
          ok: false,
          message: result.message || 'Something went wrong',
          errors: result.errors || [],
        };
      }

      setError(null);
      return { ok: true, data: result };
    } catch (err: any) {
      return {
        ok: false,
        message: err.message || 'Server error, something went wrong',
      };
    } finally {
      setIsLoading(false);
    }
  };
  const Fetch = async ({
    url,
    v = 1,
  }: FetchOptions): Promise<FetchResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v${v}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Something went wrong');
        return { ok: false, message: result.message || 'Something went wrong' };
      }

      setError(null);

      return { ok: true, data: result };
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message);
      return {
        ok: false,
        message: err.message || 'Server error, something went wrong',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, setIsLoading, errorMessage, setError, Post, Fetch };
}
