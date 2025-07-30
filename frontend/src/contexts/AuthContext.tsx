import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "freelancer" | "client" | "admin";
  avatar?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on app load
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");

    console.log('AuthContext: Initializing with stored data:', { storedToken, storedUser });

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('AuthContext: Parsed user data:', userData);
        setToken(storedToken);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    } else {
      console.log('AuthContext: No stored auth data found');
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log('AuthContext: Login called with:', { userData, authToken });
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log('AuthContext: User data stored in localStorage');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Hook for role-based access
export const useRoleAccess = () => {
  const { user } = useAuth();

  return {
    isFreelancer: user?.role === "freelancer",
    isClient: user?.role === "client",
    isAdmin: user?.role === "admin",
    hasRole: (role: "freelancer" | "client" | "admin") => user?.role === role,
  };
};
