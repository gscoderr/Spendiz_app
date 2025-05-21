import { Slot } from 'expo-router';
import { UserProvider } from '../context/user.context';
import {BestCardProvider} from '../context/bestcard.context';

export default function Layout() {
  return (
     <UserProvider>
      <BestCardProvider>
        <Slot />
      </BestCardProvider>
    </UserProvider>
  );
}
