import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDeXnACyxCFUKcBl6EC-62fDa_bj5mlkGw',
  authDomain: 'target-5fcf7.firebaseapp.com',
  projectId: 'target-5fcf7',
  storageBucket: 'target-5fcf7.appspot.com',
  messagingSenderId: '403274436735',
  appId: '1:403274436735:web:122643962156a4b5566f4a',
  measurementId: 'G-S46XNTVB7V'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);