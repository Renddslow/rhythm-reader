import React, { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  completions: Completion[];
  links: Link[];
};

export type Completion = {
  read_at: string;
  movement: number;
  page: number;
};

export type Link = {
  collected_at: string;
  movement: number;
  page: number;
  link: string;
};

export type AuthenticationContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  completions: Completion[];
  links: Link[];
  user: User;
  getProfile: () => Promise<void>;
  completePage: (movement: number, page: number) => Promise<void>;
  collectLink: (link: string, movement: number, page: number) => Promise<void>;
};

const AuthenticationContext = createContext<AuthenticationContextType>({
  isAuthenticated: false,
  user: null,
} as AuthenticationContextType);

const post = (route: string, body: Record<string, unknown>) =>
  fetch(route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((d) => d.json());

const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getProfile = async () => {
    setIsLoading(true);
    fetch('/api/profile').then(async (d) => {
      if (d.status >= 400) {
        setUser(null);
        setIsAuthenticated(null);
        setIsLoading(false);
        return null;
      }

      setUser(await d.json());
      setIsAuthenticated(true);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setCompletions(user.completions);
      setLinks(user.links);
    }
  }, [user]);

  const completePage = async (movement: number, page: number) => {
    const completion = await post('/api/completions', {
      movement,
      page,
    });
    setCompletions((s) => [...s, completion]);
  };

  const collectLink = async (link: string, movement: number, page: number) => {
    const linkResponse = await post('/api/links', {
      link,
      movement,
      page,
    });
    setLinks((s) => [...s, linkResponse]);
  };

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        completions,
        links,
        isAuthenticated,
        isLoading,
        getProfile,
        completePage,
        collectLink,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;

export const useAuthenticatedUser = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthenticationContext);
  return { user, isAuthenticated, isLoading };
};

export const useProgress = () => {
  const { links, completions, completePage, collectLink } = useContext(AuthenticationContext);
  return { links, completions, completePage, collectLink };
};
