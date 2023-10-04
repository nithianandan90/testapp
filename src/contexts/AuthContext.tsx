import {CognitoUser} from 'amazon-cognito-identity-js';
import {Auth, Hub} from 'aws-amplify';
import {
  Dispatch,
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';
import {HubCallback} from '@aws-amplify/core';

type UserType = CognitoUser | null | undefined;

type AuthContextType = {
  user: UserType;
  userId: string;
  checkUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  userId: '',
  checkUser: async () => {},
});

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<UserType>(undefined);

  //   console.log('usr', user);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      console.log('set user firing', authUser.attributes);
      setUser(authUser);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener: HubCallback = data => {
      //   console.log(data);

      const {event} = data.payload;
      if (event === 'signOut') {
        setUser(null);
      }
      if (event === 'signIn') {
        checkUser();
      }
    };
    const listenerHandle = Hub.listen('auth', listener);

    // In your component's cleanup function (e.g., useEffect cleanup)
    return () => {
      // Remove the listener using the listenerHandle
      listenerHandle();
    };
  }, []);

  console.log('attributes', user?.attributes?.sub);

  return (
    <AuthContext.Provider
      value={{user, userId: user?.attributes?.sub, checkUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
