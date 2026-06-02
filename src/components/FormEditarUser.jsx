import { useState } from 'react';
import EditarUsername from '../components/EditarUsername';
import EditarEmail from '../components/EditarEmail';
import EditarPassword from '../components/EditarPassword';
import EditarFotoUser from '../components/EditarFotoUser';

function FormEditarUser(props) {
  const { profile, setProfile, profileFile, setProfileFile } = props;

  const [isUpdateImgShowing, setIsUpdateImgShowing] = useState(false);
  const [isUpdateUsernameShowing, setIsUpdateUsernameShowing] = useState(false);
  const [isUpdateEmailShowing, setIsUpdateEmailShowing] = useState(false);
  const [isUpdatePasswordShowing, setIsUpdatePasswordShowing] = useState(false);

  const handleToggleUpdateImg = () => setIsUpdateImgShowing(!isUpdateImgShowing);

  const handleToggleUpdateUsername = () => setIsUpdateUsernameShowing(!isUpdateUsernameShowing);

  const handleToggleUpdateEmail = () => setIsUpdateEmailShowing(!isUpdateEmailShowing);

  const handleToggleUpdatePassword = () => setIsUpdatePasswordShowing(!isUpdatePasswordShowing);

  return (
    <div>
      <h3>
        Edita tu perfil:
        <button onClick={handleToggleUpdateImg}>Edita tu foto de perfil</button>
        <button onClick={handleToggleUpdateUsername}>Edita tu Username</button>
        <button onClick={handleToggleUpdateEmail}>Edita tu email</button>
        <button onClick={handleToggleUpdatePassword}>Modifica tu contraseña</button>
      </h3>

      {isUpdateImgShowing === true ? (
        <EditarFotoUser
          profileFile={profileFile}
          setProfileFile={setProfileFile}
          setProfile={setProfile}
          handleToggleUpdateImg={handleToggleUpdateImg}
        />
      ) : null}

      {isUpdateUsernameShowing === true ? (
        <EditarUsername
          profile={profile}
          setProfile={setProfile}
          handleToggleUpdateUsername={handleToggleUpdateUsername}
        />
      ) : null}
      {isUpdateEmailShowing === true ? (
        <EditarEmail profile={profile} setProfile={setProfile} handleToggleUpdateEmail={handleToggleUpdateEmail} />
      ) : null}
      {isUpdatePasswordShowing === true ? (
        <EditarPassword
          profile={profile}
          setProfile={setProfile}
          handleToggleUpdatePassword={handleToggleUpdatePassword}
        />
      ) : null}
    </div>
  );
}

export default FormEditarUser;
