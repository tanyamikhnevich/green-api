import { Button } from '../../shared';
import styles from './login-modal.module.scss';

interface Props {
  idInstance: string;
  setIdInstance: (value: string) => void;
  apiTokenInstance: string;
  setApiTokenInstance: (value: string) => void;
  handleLogin: () => void;

}
export function LoginModal(props: Props) {
  const {
    idInstance, setIdInstance, apiTokenInstance, setApiTokenInstance, handleLogin,
  } = props;
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Login to WhatsApp Chat</h2>
        <input
          type="text"
          placeholder="idInstance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
        />
        <input
          type="password"
          placeholder="apiTokenInstance"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
        />
        <Button onClick={handleLogin} className={styles.loginButton} name="Login" />
      </div>
    </div>
  );
}
